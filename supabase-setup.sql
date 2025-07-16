-- テスト用のユーザーを作成するSQL
-- Supabaseのダッシュボード > SQL Editorで実行してください

-- テストユーザーの作成（固定UUID）
INSERT INTO public.users (
  id,
  email,
  password_hash,
  name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  'dummy_hash', -- 実際のパスワードハッシュではありません
  'Test User',
  null,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- サンプルタグの作成
INSERT INTO public.tags (id, user_id, name, color, description, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Technology', '#2196F3', 'Technology related articles', now(), now()),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Design', '#E91E63', 'Design and UI/UX articles', now(), now()),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'Programming', '#4CAF50', 'Programming tutorials and tips', now(), now())
ON CONFLICT (id) DO NOTHING;

-- サンプルコレクションの作成
INSERT INTO public.collections (id, user_id, name, description, color, is_public, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'My Favorites', 'Personal favorite articles', '#FF9800', false, now(), now()),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'To Read Later', 'Articles to read when I have time', '#9C27B0', false, now(), now())
ON CONFLICT (id) DO NOTHING;
