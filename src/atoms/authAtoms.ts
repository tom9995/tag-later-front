import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// ユーザー情報の型定義
export interface User {
  id: number;
  email: string;
  name: string;
}

// localStorage と同期するatom
export const authTokenAtom = atomWithStorage<string | null>("authToken", null);
export const userDataAtom = atomWithStorage<User | null>("userData", null);

// 計算されたatom（認証状態）
export const isAuthenticatedAtom = atom((get) => {
  const token = get(authTokenAtom);
  const user = get(userDataAtom);
  return Boolean(token && user);
});

// ログイン処理のatom
export const loginAtom = atom(
  null,
  async (
    get,
    set,
    { email, password }: { email: string; password: string }
  ) => {
    try {
      // 入力値の検証
      if (!email || !password) {
        return {
          success: false,
          error: "メールアドレスとパスワードを入力してください",
        };
      }

      // メールアドレスの形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: "正しいメールアドレスの形式で入力してください",
        };
      }

      // パスワードの長さチェック
      if (password.length < 6) {
        return {
          success: false,
          error: "パスワードは6文字以上で入力してください",
        };
      }

      // 実際のAPI呼び出し（現在は簡易認証）
      // TODO: 将来的には実際のAPIエンドポイントに変更
      const isValidCredentials = await validateCredentials(email, password);

      if (isValidCredentials.success && isValidCredentials.user) {
        const user: User = {
          id: isValidCredentials.user.id,
          email: email.toLowerCase().trim(),
          name: isValidCredentials.user.name,
        };
        const token = generateAuthToken(user);

        // atomを更新（自動的にlocalStorageにも保存）
        set(authTokenAtom, token);
        set(userDataAtom, user);

        return { success: true };
      } else {
        return {
          success: false,
          error: isValidCredentials.error || "ログインに失敗しました",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "ログイン処理中にエラーが発生しました" };
    }
  }
);

// 認証情報を検証する関数（簡易版）
async function validateCredentials(email: string, password: string) {
  // シミュレーション用の遅延
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 簡易的な認証ロジック（実際のAPIに置き換える）
  const validUsers = [
    {
      email: "user@example.com",
      password: "password123",
      id: 1,
      name: "テストユーザー",
    },
    { email: "admin@example.com", password: "admin123", id: 2, name: "管理者" },
    { email: "test@test.com", password: "test123", id: 3, name: "テスト太郎" },
  ];

  const user = validUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
  );

  if (user) {
    return {
      success: true,
      user: { id: user.id, name: user.name },
    };
  } else {
    return {
      success: false,
      error: "メールアドレスまたはパスワードが正しくありません",
    };
  }
}

// 認証トークンを生成する関数
function generateAuthToken(user: User): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `auth-${user.id}-${timestamp}-${randomStr}`;
}

// ログアウト処理のatom
export const logoutAtom = atom(null, (get, set) => {
  set(authTokenAtom, null);
  set(userDataAtom, null);
});
