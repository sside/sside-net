All documents and correspondence must be in Japanese.

# GEMINI.md

このファイルは、GEMINIにプロジェクトの構造、ルールを教えるためのもの。

## プロジェクト概要

このリポジトリは個人サイトsside.netの全構成となる。

## リポジトリ構成

Turborepoを用いたmonorepoにしている。

### 各パッケージディレクトリの概説

- [app](app): 実際に動作するアプリケーション部分
  - [backend](app/backend): [NestJS](https://docs.nestjs.com/)を用いたREST APIバックエンド
- [library](library): 共有の機能
  - [project-logger](library/project-logger): プロジェクトで一律してこのロガーを使用する
  - [utility](library/utility): 特にパッケージを設けるほどではないが、共通で使用するロジック
- [resource](resource): 型定義や設定など、共有だがロジックを含まないもの
  - [app-config](resource/app-config): アプリケーションの設定
  - [constant](resource/constant): 定数や型定義
- [config](config): tsconfigやeslintなど、かくパッケージで使用するツールの設定ファイル
