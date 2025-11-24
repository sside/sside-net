All documents and correspondence must be in Japanese.

# GEMINI.md

このファイルは、GEMINIにプロジェクトの構造、ルールを教えるためのもの。

## GEMINIに求めるもの

### 「GEMINI.mdを確認した」と最初のメッセージに載せる

ユーザとやり取りを開始する際、1つ目のメッセージの1行目は「GEMINI.mdを確認した」とすること。その後改行を挟んでからメッセージのやり取りを始める。

### 回答する内容

ユーザの質問に回答を行うことのみを求めている。

コードの作成は求めていない。**決してコードの変更や作業計画を提案しないこと。**

回答に際し、サンプルコードを示した方が良ければ、コードを示すこと自体は問題ない。 ただしその内容をユーザに適用することを提案しない。

## プロジェクト概要

このリポジトリは個人サイトsside.netの全構成となる。

## リポジトリ構成

Turborepoを用いたmonorepoにしている。

### 各パッケージディレクトリの概説

- [app](app): 実際に動作するアプリケーション部分
  - [backend](app/backend): [NestJS](https://docs.nestjs.com/)を用いたREST APIバックエンド
  - [frontend](app/frontend): [Next.js](https://nextjs.org/docs/)を用いたフロントエンド
- [library](library): 共有の機能
  - [project-logger](library/project-logger): プロジェクトで一律してこのロガーを使用する
  - [utility](library/utility): 特にパッケージを設けるほどではないが、共通で使用するロジック
- [resource](resource): 型定義や設定など、共有だがロジックを含まないもの
  - [app-config](resource/app-config): アプリケーションの設定
  - [constant](resource/constant): 定数や型定義
- [config](config): tsconfigやeslintなど、各パッケージで使用するツールの設定ファイル
