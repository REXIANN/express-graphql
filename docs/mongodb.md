# mongodb

## install
```zsh
$ brew update && brew tap mongodb/brew
$ brew install mongodb-community@4.4
```

## launch
몽고디비를 맥OS 서비스로 실행 가능. 실행 시 몽고DB 서비스가 시작되고, 백그라운드 프로세스로 유지됨.
몽고디비가 설치되어 있고 실행 중인지 여부를 확인하려면 터미널에서 `ps -ef | grep mongod` 를 실행하면 됨
 ```zsh
# launch
$ brew services start mongodb-community
```
