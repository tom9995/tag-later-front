const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8765/api";

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
  title: string;
  url: string;
  description?: string;
  thumbnail_url?: string;
  favicon_url?: string;
  is_read?: boolean;
  is_favorite?: boolean;
  reading_time?: number;
  site_name?: string;
  author?: string;
  published_at?: string;
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

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

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
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/cards${queryString ? `?${queryString}` : ""}`;

    return this.request<CardsListResponse>(endpoint);
  }

  async getCard(id: string): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${id}`);
  }

  async createCard(data: CreateCardData): Promise<ApiResponse<Card>> {
    return this.request<Card>("/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCard(
    id: string,
    data: UpdateCardData
  ): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/cards/${id}`, {
      method: "DELETE",
    });
  }

  async markAsRead(id: string): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${id}/mark-as-read`, {
      method: "POST",
    });
  }

  async toggleFavorite(
    id: string,
    isFavorite: boolean
  ): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${id}/toggle-favorite`, {
      method: "POST",
      body: JSON.stringify({ is_favorite: isFavorite }),
    });
  }

  // Tags API
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>("/tags");
  }

  async createTag(data: {
    name: string;
    color: string;
  }): Promise<ApiResponse<Tag>> {
    return this.request<Tag>("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTag(
    id: string,
    data: { name?: string; color?: string }
  ): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/tags/${id}`, {
      method: "DELETE",
    });
  }

  // Collections API
  async getCollections(): Promise<ApiResponse<Collection[]>> {
    return this.request<Collection[]>("/collections");
  }

  async createCollection(data: {
    name: string;
  }): Promise<ApiResponse<Collection>> {
    return this.request<Collection>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCollection(
    id: string,
    data: { name: string }
  ): Promise<ApiResponse<Collection>> {
    return this.request<Collection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCollection(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/collections/${id}`, {
      method: "DELETE",
    });
  }

  async addCardToCollection(
    cardId: string,
    collectionId: string
  ): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${cardId}/collections/${collectionId}`, {
      method: "POST",
    });
  }

  async removeCardFromCollection(
    cardId: string,
    collectionId: string
  ): Promise<ApiResponse<null>> {
    return this.request<null>(`/cards/${cardId}/collections/${collectionId}`, {
      method: "DELETE",
    });
  }

  async addTagToCard(
    cardId: string,
    tagId: string
  ): Promise<ApiResponse<Card>> {
    return this.request<Card>(`/cards/${cardId}/tags/${tagId}`, {
      method: "POST",
    });
  }

  async removeTagFromCard(
    cardId: string,
    tagId: string
  ): Promise<ApiResponse<null>> {
    return this.request<null>(`/cards/${cardId}/tags/${tagId}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();

// 既存のBookmarks APIも保持
// Fetch all bookmarks - 新しいcardsエンドポイントを使用
export async function fetchBookmarks(): Promise<Bookmark[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // APIからのCardsデータをBookmarks形式に変換
    const cards = data.data?.cards || [];
    return cards.map((card: any) => ({
      id: parseInt(card.id || "0"),
      title: card.title || "Untitled",
      url: card.url || "",
      description: card.description || "",
      tags: card.tags || [],
      created: card.saved_at || new Date().toISOString(),
      modified: card.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await apiService.getTags();
    return response.success ? response.data : [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
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
    return response.success
      ? response.data
      : Promise.reject(new Error(response.error));
  } catch (error) {
    console.error("Error creating card:", error);
    throw error;
  }
}

// Create a new bookmark - 新しいcardsエンドポイントを使用
export async function createBookmark(
  bookmark: Omit<Bookmark, "id" | "created" | "modified">
): Promise<Bookmark> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookmark),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating bookmark:", error);
    throw error;
  }
}

// Update a bookmark
export async function updateBookmark(
  id: number,
  bookmark: Partial<Bookmark>
): Promise<Bookmark> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookmark),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error updating bookmark:", error);
    throw error;
  }
}

// Delete a bookmark
export async function deleteBookmark(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting bookmark:", error);
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
    return response.success
      ? response.data
      : Promise.reject(new Error(response.error));
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
