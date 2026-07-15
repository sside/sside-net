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

# 共有パッケージのwatch
npm run dev:shared

# バックエンド立ち上げ
npm run --workspace @sside-net/backend dev

# フロントエンド立ち上げ
npm run --workspace @sside-net/frontend dev
```

## 注意点

### バックエンド

### 非公開エンドポイントは全て`/private`配下に置く

認証を必要とするエンドポイントは、全て`/private`以下のパスにすること。

理由はフロントエンド側のAPIクライアント。`/private/`から始まるパスの際、Bearerトークンをヘッダに入れるようになっている。

### WebStormからテストを実行する場合の.env読み込み

Run configのNode optionsに`--env-file ../../.env.test`を追加する。
