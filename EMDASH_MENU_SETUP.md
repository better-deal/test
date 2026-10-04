# EmDash menu integration

このサイトのメニュー表示は `/api/menu` を経由してEmDashから取得できる構成です。

## Cloudflare Pages の環境変数

Cloudflare Pages の **Settings → Environment variables** に次の3つを設定してください。

- `EMDASH_API_URL`: EmDashサイトのベースURL（例: `https://cms.example.com`）
- `EMDASH_TOKEN`: EmDashのPersonal Access Token（`ec_pat_` から始まるトークン）
- `EMDASH_COLLECTION`: メニュー用コレクション名。初期値は `products`

`EMDASH_TOKEN` はブラウザへ公開しません。Cloudflare Pages Function がサーバー側でEmDash APIを呼び出します。

## EmDash側

「Products」などのコレクションを作成し、少なくとも次のフィールドを用意してください。

- `name` または `title`
- `price`
- `category`
- `description`
- `featured`
- `sortOrder`
- 必要に応じて `image` / `imageUrl`

公開した商品が `/_emdash/api/content/{collection}` で取得できるよう、トークンには `content:read` を付与します。

環境変数がまだ設定されていない間は、サイトは現在のNorThメニューをフォールバック表示します。
