# EmDash menu integration

このサイトのメニュー表示は `/api/menu` を経由してEmDashから取得できる構成です。

## Cloudflare Pages の環境変数

Cloudflare Pages の **Settings → Environment variables** に次の3つを設定してください。

- `EMDASH_API_URL`: EmDash Workerの公開URL（例: `https://north-emdash.<subdomain>.workers.dev`）
- `EMDASH_TOKEN`: EmDashのPersonal Access Token（`ec_pat_` から始まるトークン）
- `EMDASH_COLLECTION`: `products`

EmDash側は、このリポジトリの `emdash/` ディレクトリをCloudflare Workerとしてデプロイします。

### EmDashの管理画面

デプロイ後の `https://north-emdash.<subdomain>.workers.dev/_emdash/admin` を開き、セットアップウィザードを完了してください。初回セットアップ時に `seed/seed.json` のProductsコレクションと初期メニューが適用されます。

その後、管理画面でPersonal Access Tokenを作成し、`content:read` を付与します。

`EMDASH_TOKEN` はブラウザへ公開しません。NorThのCloudflare Pages Functionがサーバー側でEmDash APIを呼び出します。

環境変数がまだ設定されていない間は、NorThサイトは現在のメニューをフォールバック表示します。


<!-- Cloudflare deploy verification: 2026-10-05 -->

