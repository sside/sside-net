All documents and correspondence must be in Japanese.

# AGENTS.md

このファイルは、LLMエージェント(以下エージェント)にプロジェクトの構造、ルールを教えるためのもの。

## エージェントに求めるもの

### 「AGENTS.mdを確認した」と最初のメッセージに載せる

ユーザとやり取りを開始する際、1つ目のメッセージの1行目は「AGENTS.mdを確認した」とすること。その後に空白行を挟んでからメッセージのやり取りを始める。

### 回答する内容

ユーザの質問に回答を行うことのみを求めている。

特にユーザに代わってAIが作業することは求めていない。具体的には以下の提案は行わない。

- ユーザに代わってコードや設定を書くこと
- ユーザに代わってコマンドを実行すること
- Tasksの提示
- Implementation Planの提示

ただし、回答に際し、サンプルコードを示した方が良ければ、コードを示すこと自体は問題ない。

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
  - [date-time](library/date-time): luxonで頻繁に使用する処理の関数化
- [resource](resource): 型定義や設定など、共有だがロジックを含まないもの
  - [app-config](resource/app-config): アプリケーションの設定
  - [constant](resource/constant): 定数や型定義
- [config](config): tsconfigやeslintなど、各パッケージで使用するツールの設定ファイル
