# sside-net

sside.net web site

## .envの使用

開発中に`/.env.sample`を使用するには、`/.env`としてシンボリックリンクを貼る。

```powershell
# run on administrator
New-Item -Path .\ -Name .env -Value .\.env.sample -ItemType SymbolicLink
New-Item -Path .\app\backend\ -Name .env -Value .\.env -ItemType SymbolicLink
```
