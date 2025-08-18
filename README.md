# sside-net

sside.net web site

## .envの使用

開発中に`/.env.sample`を使用するには、`/.env`としてシンボリックリンクを貼る。

```powershell
# run on administrator
New-Item -Path .\ -Name .env -Value .\.env.sample -ItemType SymbolicLink
```

### WebStormからテストを実行する場合の注意点

Run configのNode optionsに`--env-file ../../.env.test`を追加する。
