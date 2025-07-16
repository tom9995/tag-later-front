import { createClient } from "@supabase/supabase-js";

// 環境変数の検証
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 開発環境とプロダクション環境での詳細なエラーメッセージ
const isDevelopment = process.env.NODE_ENV === "development";
const isStaticBuild = process.env.GITHUB_PAGES === "true";

// 静的ビルド時はダミー値を使用（実際には使用されない）
const fallbackUrl = "https://placeholder.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder";

const finalUrl = supabaseUrl || (isStaticBuild ? fallbackUrl : "");
const finalKey = supabaseAnonKey || (isStaticBuild ? fallbackKey : "");

if (!finalUrl && !isStaticBuild) {
  const errorMessage = isDevelopment
    ? "NEXT_PUBLIC_SUPABASE_URL environment variable is required. Please check your .env.local file."
    : "NEXT_PUBLIC_SUPABASE_URL environment variable is required. Please check GitHub repository secrets.";
  throw new Error(errorMessage);
}

if (!finalKey && !isStaticBuild) {
  const errorMessage = isDevelopment
    ? "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required. Please check your .env.local file."
    : "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required. Please check GitHub repository secrets.";
  throw new Error(errorMessage);
}

// URL形式の検証（静的ビルド時はスキップ）
if (!isStaticBuild && finalUrl) {
  try {
    new URL(finalUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL");
  }
}

// Supabaseキーの基本的な検証（JWT形式かどうか）（静的ビルド時はスキップ）
if (!isStaticBuild && finalKey && !finalKey.startsWith("eyJ")) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid (should be a JWT)"
  );
}

export const supabase = createClient(finalUrl!, finalKey!);

// Database型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          url: string;
          description: string | null;
          thumbnail_url: string | null;
          favicon_url: string | null;
          is_read: boolean;
          is_favorite: boolean;
          reading_time: number | null;
          site_name: string | null;
          author: string | null;
          published_at: string | null;
          saved_at: string;
          read_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          url: string;
          description?: string | null;
          thumbnail_url?: string | null;
          favicon_url?: string | null;
          is_read?: boolean;
          is_favorite?: boolean;
          reading_time?: number | null;
          site_name?: string | null;
          author?: string | null;
          published_at?: string | null;
          saved_at?: string;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          url?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          favicon_url?: string | null;
          is_read?: boolean;
          is_favorite?: boolean;
          reading_time?: number | null;
          site_name?: string | null;
          author?: string | null;
          published_at?: string | null;
          saved_at?: string;
          read_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          color: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          color?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          color?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          color: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          color?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          color?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      card_tags: {
        Row: {
          id: string;
          card_id: string | null;
          tag_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id?: string | null;
          tag_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string | null;
          tag_id?: string | null;
          created_at?: string;
        };
      };
      collection_cards: {
        Row: {
          id: string;
          collection_id: string | null;
          card_id: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_id?: string | null;
          card_id?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_id?: string | null;
          card_id?: string | null;
          position?: number;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          card_id: string | null;
          user_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          card_id?: string | null;
          user_id?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string | null;
          user_id?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
