# @sside-net/backend

## 注意点

DBのマイグレーション時に`.env`ファイルを参照するため、リポジトリルートの`.env`のシンボリックリンクを張っておくこと。

```powershell
# run on administrator
New-Item -Path .\ -Name .env -Value ..\..\.env.sample -ItemType SymbolicLink
```
