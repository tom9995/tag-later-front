import { createClient } from "@supabase/supabase-js";

// ブラウザ環境でのランタイム環境変数の取得
function getSupabaseUrl(): string {
  // ビルド時とランタイム時の環境変数を考慮
  if (typeof window !== "undefined") {
    // ブラウザ環境では、ビルド時に注入された環境変数を使用
    return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseAnonKey(): string {
  // ビルド時とランタイム時の環境変数を考慮
  if (typeof window !== "undefined") {
    // ブラウザ環境では、ビルド時に注入された環境変数を使用
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

// 環境変数の検証
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// 静的ビルド時かどうかの判定
const isStaticBuild = process.env.GITHUB_PAGES === "true";

// 静的ビルド時のフォールバック値（プレースホルダー）
const fallbackUrl = "https://placeholder.supabase.co";
const fallbackKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxMjM0NTYsImV4cCI6MTk2MDY5OTQ1Nn0.placeholder";

// ビルド時（サーバーサイド）では必須チェックを行わない
const finalUrl = supabaseUrl || (isStaticBuild ? fallbackUrl : "");
const finalKey = supabaseAnonKey || (isStaticBuild ? fallbackKey : "");

// ランタイム環境変数の検証（ブラウザ環境でのみ）
function validateEnvironmentVariables() {
  if (typeof window === "undefined") return; // サーバーサイドではスキップ

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || url === fallbackUrl) {
    console.error(
      "❌ NEXT_PUBLIC_SUPABASE_URL environment variable is missing or using placeholder"
    );
    console.error("Please ensure GitHub Secrets are properly configured:");
    console.error("- Repository Settings > Secrets and variables > Actions");
    console.error(
      "- Add NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL"
    );
    return false;
  }

  if (!key || key === fallbackKey) {
    console.error(
      "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is missing or using placeholder"
    );
    console.error("Please ensure GitHub Secrets are properly configured:");
    console.error("- Repository Settings > Secrets and variables > Actions");
    console.error(
      "- Add NEXT_PUBLIC_SUPABASE_ANON_KEY with your Supabase anon key"
    );
    return false;
  }

  console.log("✅ Supabase environment variables validated successfully");
  return true;
}

// Supabaseクライアントの作成
export const supabase = createClient(finalUrl, finalKey);

// ブラウザ環境でのみ環境変数の検証を実行
if (typeof window !== "undefined") {
  validateEnvironmentVariables();
}

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
