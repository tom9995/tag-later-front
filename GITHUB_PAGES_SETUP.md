# Production Environment Variables for GitHub Pages

## GitHub Secrets に設定する必要がある環境変数

GitHub リポジトリの Settings > Secrets and variables > Actions で以下の環境変数を設定してください：

### 必須設定

1. **NEXT_PUBLIC_SUPABASE_URL**
   - 値: あなたのSupabaseプロジェクトURL
   - 例: `https://your-project-id.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - 値: あなたのSupabase Anonymous Key
   - 例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 設定手順

1. GitHubリポジトリページで `Settings` タブをクリック
2. 左サイドバーで `Secrets and variables` > `Actions` をクリック
3. `New repository secret` ボタンをクリック
4. 上記の環境変数を1つずつ追加

## セキュリティ注意事項

- 🔒 Secret値は一度設定すると表示されません
- 🔑 本番環境用の強力なキーを使用してください
- 🛡️ 定期的にキーをローテーションしてください
- ⚠️ Supabase Row Level Security (RLS) が有効になっていることを確認してください
