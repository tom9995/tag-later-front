import { supabase } from "../lib/supabase";

export interface Card {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail_url?: string;
  favicon_url?: string;
  is_read: boolean;
  is_favorite: boolean;
  reading_time?: number;
  site_name?: string;
  author?: string;
  published_at?: string;
  saved_at: string;
  read_at?: string;
  updated_at: string;
  tags?: Tag[];
  collections?: Collection[];
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags: Tag[];
  created: string;
  modified: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Collection {
  id: string;
  name: string;
}

export interface CreateCardData {
  title?: string;
  url?: string;
  description?: string;
  thumbnail_url?: string;
  favicon_url?: string;
  is_read?: boolean;
  is_favorite?: boolean;
  reading_time?: number;
  site_name?: string;
  author?: string;
  published_at?: string;
  tag_ids?: string[];
}

export interface UpdateCardData {
  title?: string;
  url?: string;
  description?: string;
  thumbnail_url?: string;
  favicon_url?: string;
  is_read?: boolean;
  is_favorite?: boolean;
  reading_time?: number;
  site_name?: string;
  author?: string;
  published_at?: string;
  tag_ids?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface CardsListResponse {
  cards: Card[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ユーザーIDを取得する関数
const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return user.id;
  }
  throw new Error("User not authenticated");
};

class SupabaseApiService {
  // Cards API
  async getCards(params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
    is_favorite?: boolean;
    tag_id?: string;
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  }): Promise<ApiResponse<CardsListResponse>> {
    try {
      const userId = await getCurrentUserId();
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const offset = (page - 1) * limit;

      let query = supabase
        .from("cards")
        .select(
          `
          *,
          tags:card_tags(
            tag:tags(*)
          ),
          collections:collection_cards(
            collection:collections(*)
          )
        `
        )
        .eq("user_id", userId);

      // フィルター適用
      if (params?.is_read !== undefined) {
        query = query.eq("is_read", params.is_read);
      }
      if (params?.is_favorite !== undefined) {
        query = query.eq("is_favorite", params.is_favorite);
      }
      if (params?.search) {
        query = query.or(
          `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
        );
      }

      // ソート適用
      const sortBy = params?.sort_by || "created_at";
      const sortOrder = params?.sort_order || "desc";
      query = query.order(sortBy, { ascending: sortOrder === "asc" });

      // ページネーション適用
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // データ変換
      const cards: Card[] = (data || []).map((card) => ({
        ...card,
        tags:
          card.tags?.map((ct: { tag: Tag }) => ct.tag).filter(Boolean) || [],
        collections:
          card.collections
            ?.map((cc: { collection: Collection }) => cc.collection)
            .filter(Boolean) || [],
      }));

      // 総数を取得
      const { count: totalCount } = await supabase
        .from("cards")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const total = totalCount || 0;
      const total_pages = Math.ceil(total / limit);

      return {
        success: true,
        message: "Cards fetched successfully",
        data: {
          cards,
          pagination: {
            current_page: page,
            per_page: limit,
            total,
            total_pages,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching cards:", error);
      return {
        success: false,
        message: "Failed to fetch cards",
        data: {
          cards: [],
          pagination: {
            current_page: 1,
            per_page: 10,
            total: 0,
            total_pages: 0,
          },
        },
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getCard(id: string): Promise<ApiResponse<Card>> {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select(
          `
          *,
          tags:card_tags(
            tag:tags(*)
          ),
          collections:collection_cards(
            collection:collections(*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Card not found");
      }

      const card: Card = {
        ...data,
        tags:
          data.tags?.map((ct: { tag: Tag }) => ct.tag).filter(Boolean) || [],
        collections:
          data.collections
            ?.map((cc: { collection: Collection }) => cc.collection)
            .filter(Boolean) || [],
      };

      return {
        success: true,
        message: "Card fetched successfully",
        data: card,
      };
    } catch (error) {
      console.error("Error fetching card:", error);
      throw error;
    }
  }

  async createCard(data: CreateCardData): Promise<ApiResponse<Card>> {
    try {
      const userId = await getCurrentUserId();

      // カードを作成
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tag_ids: _, ...cardData } = data; // tag_idsを分離
      const { data: card, error: cardError } = await supabase
        .from("cards")
        .insert({
          ...cardData,
          user_id: userId,
          is_read: data.is_read || false,
          is_favorite: data.is_favorite || false,
        })
        .select()
        .single();

      if (cardError) {
        throw cardError;
      }

      // タグを紐づけ
      if (data.tag_ids && data.tag_ids.length > 0) {
        const cardTagInserts = data.tag_ids.map((tagId) => ({
          card_id: card.id,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from("card_tags")
          .insert(cardTagInserts);

        if (tagError) {
          console.error("Error linking tags to card:", tagError);
          // タグの紐づけに失敗してもカード作成は成功として扱う
        }
      }

      // 作成されたカードをタグ情報付きで取得
      const { data: cardWithTags, error: fetchError } = await supabase
        .from("cards")
        .select(
          `
          *,
          tags:card_tags(
            tag:tags(*)
          )
        `
        )
        .eq("id", card.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // データ変換
      const transformedCard = {
        ...cardWithTags,
        tags:
          cardWithTags.tags
            ?.map((ct: { tag: Tag }) => ct.tag)
            .filter(Boolean) || [],
      };

      return {
        success: true,
        message: "Card created successfully",
        data: transformedCard,
      };
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  }

  async updateCard(
    id: string,
    data: UpdateCardData
  ): Promise<ApiResponse<Card>> {
    try {
      // カード情報を更新
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tag_ids: _, ...cardData } = data; // tag_idsを分離
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: updatedCard, error: cardError } = await supabase
        .from("cards")
        .update({
          ...cardData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (cardError) {
        throw cardError;
      }

      // タグ情報が含まれている場合、タグの紐づけを更新
      if (data.tag_ids !== undefined) {
        // 既存のタグ紐づけを削除
        const { error: deleteError } = await supabase
          .from("card_tags")
          .delete()
          .eq("card_id", id);

        if (deleteError) {
          console.error("Error deleting existing card tags:", deleteError);
        }

        // 新しいタグ紐づけを追加
        if (data.tag_ids.length > 0) {
          const cardTagInserts = data.tag_ids.map((tagId) => ({
            card_id: id,
            tag_id: tagId,
          }));

          const { error: insertError } = await supabase
            .from("card_tags")
            .insert(cardTagInserts);

          if (insertError) {
            console.error("Error inserting new card tags:", insertError);
          }
        }
      }

      // 更新されたカードをタグ情報付きで取得
      const { data: cardWithTags, error: fetchError } = await supabase
        .from("cards")
        .select(
          `
          *,
          tags:card_tags(
            tag:tags(*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // データ変換
      const transformedCard = {
        ...cardWithTags,
        tags:
          cardWithTags.tags
            ?.map((ct: { tag: Tag }) => ct.tag)
            .filter(Boolean) || [],
      };

      return {
        success: true,
        message: "Card updated successfully",
        data: transformedCard,
      };
    } catch (error) {
      console.error("Error updating card:", error);
      throw error;
    }
  }

  async deleteCard(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from("cards").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Card deleted successfully",
        data: null,
      };
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<ApiResponse<Card>> {
    try {
      const { data: card, error } = await supabase
        .from("cards")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Card marked as read",
        data: { ...card, tags: [], collections: [] },
      };
    } catch (error) {
      console.error("Error marking card as read:", error);
      throw error;
    }
  }

  async toggleFavorite(
    id: string,
    isFavorite: boolean
  ): Promise<ApiResponse<Card>> {
    try {
      const { data: card, error } = await supabase
        .from("cards")
        .update({
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Card favorite status updated",
        data: { ...card, tags: [], collections: [] },
      };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }

  // Tags API
  async getTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("user_id", userId)
        .order("name");

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Tags fetched successfully",
        data: data || [],
      };
    } catch (error) {
      console.error("Error fetching tags:", error);
      return {
        success: false,
        message: "Failed to fetch tags",
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createTag(data: {
    name: string;
    color: string;
  }): Promise<ApiResponse<Tag>> {
    try {
      const userId = await getCurrentUserId();
      const { data: tag, error } = await supabase
        .from("tags")
        .insert({
          ...data,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Tag created successfully",
        data: tag,
      };
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  }

  async updateTag(
    id: string,
    data: { name?: string; color?: string }
  ): Promise<ApiResponse<Tag>> {
    try {
      const { data: tag, error } = await supabase
        .from("tags")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Tag updated successfully",
        data: tag,
      };
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  }

  async deleteTag(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: "Tag deleted successfully",
        data: null,
      };
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  }
}

export const apiService = new SupabaseApiService();

// 既存のBookmarks APIも保持（互換性のため）
export async function fetchBookmarks(): Promise<Bookmark[]> {
  try {
    const response = await apiService.getCards();
    if (!response.success) {
      return [];
    }

    // CardsデータをBookmarks形式に変換
    const cards = response.data.cards;
    return cards.map((card) => ({
      id: parseInt(card.id.slice(-8), 16), // UUIDの一部を数値IDに変換
      title: card.title,
      url: card.url,
      description: card.description || "",
      tags: card.tags || [],
      created: card.saved_at,
      modified: card.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await apiService.getTags();
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// 新しいカード作成関数
export async function createCard(cardData: {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}): Promise<Card> {
  try {
    const response = await apiService.createCard(cardData);
    if (!response.success) {
      throw new Error(response.error || "Failed to create card");
    }
    return response.data;
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
}

// カード更新関数
export async function updateCard(
  id: string,
  updateData: {
    title?: string;
    url?: string;
    description?: string;
    is_read?: boolean;
    is_favorite?: boolean;
  }
): Promise<Card> {
  try {
    const response = await apiService.updateCard(id, updateData);
    if (!response.success) {
      throw new Error(response.error || "Failed to update card");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
}

// カード削除関数
export async function deleteCard(id: string): Promise<boolean> {
  try {
    const response = await apiService.deleteCard(id);
    return response.success;
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
}
