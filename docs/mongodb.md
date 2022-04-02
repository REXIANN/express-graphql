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

## execute
몽고디비의 경우 주소는 `mongodb://localhost:{PORT}/{dbname}` 를 사용한다. 
포트는 기본적으로 27017 을 사용하며 dbname 은 없다면 자동으로 생성된다.

```zsh
$ mongo

$ use <db-name> # db 선택
```

## 도큐먼트와 컬렉션
몽고디비는 컬렉션 이라는 개념을 제공한다. 컬렉션은 비슷한 도큐먼트끼리 그룹화 하는 것이다. 
컬렉션은 자바스크립트 객체로 치면 최상위 객체에 해당하고 도큐먼트는 그 안에 종속된 개별 객체가 된다.

