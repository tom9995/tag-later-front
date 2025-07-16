# TagLater Frontend

これは[Next.js](https://nextjs.org)を使用した TagLater のフロントエンドアプリケーションです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

⚠️ **重要**: 環境変数ファイル（`.env.local`）は機密情報を含むため、Git リポジトリにコミットしないでください。

#### 環境変数ファイルの作成

1. `.env.example`ファイルをコピーして`.env.local`を作成：

```bash
cp .env.example .env.local
```

2. `.env.local`ファイルを編集し、実際の値に置き換え：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

#### セキュリティ注意事項

- 🔒 `.env.local`ファイルは**絶対に Git にコミットしない**でください
- 🔑 環境変数の値は**他人と共有しない**でください
- 🛡️ 本番環境では**強力なキー**を使用してください
- 🔄 定期的に**キーをローテーション**してください

#### 環境変数の検証

アプリケーション起動時に以下の検証が行われます：

- Supabase URL の形式チェック
- Anon key の JWT 形式チェック
- 必須環境変数の存在確認

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 機能

- ✅ カードの作成、編集、削除
- ✅ タグ管理
- ✅ お気に入り機能
- ✅ 既読/未読管理
- ✅ 検索・フィルタリング
- ✅ レスポンシブデザイン
- ✅ Supabase 直接接続

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: Material-UI
- **Database**: Supabase (PostgreSQL)
- **Styling**: Modern glassmorphism design

## 機能

### 🔐 認証システム

- **ユーザー登録**: メールアドレスとパスワードでアカウント作成
- **ログイン/ログアウト**: セキュアな認証フロー
- **セッション管理**: 自動的なログイン状態維持
- **保護されたルート**: 未認証ユーザーのアクセス制御

### 📚 カード管理

- **カード作成**: URL から自動メタデータ取得
- **読書状態管理**: 読了/未読の切り替え
- **お気に入り機能**: 重要な記事のブックマーク
- **タグ管理**: カテゴリ別の整理
- **検索・フィルタリング**: 効率的な記事検索

### 🎨 ユーザーエクスペリエンス

- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **モダン UI**: Glassmorphism デザイン
- **リアルタイム更新**: 即座の状態反映

## 📦 デプロイ

### GitHub Pages へのデプロイ

このプロジェクトは GitHub Pages への自動デプロイに対応しています。

#### 設定手順

1. **リポジトリ設定**
   ```bash
   # リポジトリをGitHubにプッシュ
   git push origin main
   ```

2. **GitHub Secrets の設定**
   
   GitHub リポジトリの `Settings` > `Secrets and variables` > `Actions` で以下を設定：
   
   - `NEXT_PUBLIC_SUPABASE_URL`: あなたのSupabaseプロジェクトURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: あなたのSupabase Anonymous Key

3. **GitHub Pages の有効化**
   
   リポジトリの `Settings` > `Pages` で：
   - Source: `GitHub Actions` を選択

4. **デプロイの確認**
   
   mainブランチにプッシュすると自動的にデプロイされます。
   
   アクセスURL: `https://[username].github.io/tag-later-front/`

#### ローカルでのプロダクションビルドテスト

```bash
# GitHub Pages用のビルド
npm run build:github

# ビルド結果の確認
npm run export
```

詳細な設定手順は `GITHUB_PAGES_SETUP.md` を参照してください。
