# sside-net

sside.net web site

## prerequisite

- Node.js@24
- npm@11

## セットアップ

```shell
npm install

# .envのセット
# コミットしないトークンはコピー後に適宜セット
cp .env.sample .env
cp .env.test.sample .env.test

# バックエンドのseed
npm run --workspace @sside-net/backend seed:dev

# ローカルでのサーバ立ち上げとwatch
npm run dev
```

## 注意点

### バックエンド

### 非公開エンドポイントは全て`/private`配下に置く

認証を必要とするエンドポイントは、全て`/private`以下のパスにすること。

理由はフロントエンド側のAPIクライアント。`/private/`から始まるパスの際、Bearerトークンをヘッダに入れるようになっている。

### WebStormからfrontendテストを実行する場合の.env読み込み

Run configのNode optionsに`--env-file ../../.env.test`を追加する。
