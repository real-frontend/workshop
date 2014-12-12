# 今日できたこと
## gitHubのアカウントを取得
<https://github.com/>
## PCにGit、SourceTree（Gitも一緒に）をインストール
## SSHの公開鍵を作成しGithubに登録
ローカルに「.ssh」フォルダを作成
- 参考URL1: http://monsat.hatenablog.com/entry/generating-ssh-keys-for-github
- 参考URL2: http://git-scm.com/book/ja/Git-%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC-SSH-%E5%85%AC%E9%96%8B%E9%8D%B5%E3%81%AE%E4%BD%9C%E6%88%90  
## ローカルファイル更新後、コミット。そのあとpush
- git add .
- git commit
- git push 
__最初のpushの時は__
git push -u origin xxxxxxxxx(gitリポジトリ名)

### SSHの認証鍵をgithubに登録させる方法
1 ホーム画面の [edit profile] からSSH key に。
2 [Add SSH key]で__公開鍵__ を追加する (.pubのほう)

