# Express with GraphQL

## installation

### expressjs

```zsh
$ git init

$ npm init -y
$ npm install express
$ npm install --save-dev nodemon
```

### mongodb

```zsh
$ brew update && brew tap mongodb/brew
$ brew install mongodb-community@4.4

# launch
$ brew services start mongodb-community
```

### expo

```zsh
$ npm install -g expo-cli
```

### apollo-server-express

```zsh
$ npm install apollo-server-express
```

### eslint & prettier

```zsh
# eslint
$ npm install --save-dev eslint
$ npm init @eslint/config # to config eslint

# prettier
$ npm install --save-dev --save-exact prettier
$ echo {}> .prettierrc.json
```

## graphQL

그래프QL API 의 두 가지 기본 구성 요소는 스키마와 리졸버 이다.

### 스키마

스키마는 데이터와 상호작용을 글로 표현한 것이다.

그래프QL은 스키마를 필요로 하며, 이는 API 에 대해 엄격한 계획을 강제하기 위한 것이다.
API가 스키마 내에서 정의한 데이터만 반환하고 상호작요응ㄹ 수행할 수 있기 때문이다.

스키마의 기본 구성 요소는 객체 자료형이다. 그래프QL에는 5가지 스칼라 자료형이 내장되어 있다.

1. String: utf-8 문자 인코딩을 사용하는 문자열
2. Boolean: 참 또는 거짓의 값을 가짐
3. Int: 32비트 정수형
4. Float: 부동 소수점 값
5. ID: 고유 식별자

이러한 기본 구성 요소를 사용하여 API 의 스키마를 구성할 수 있다.

```gql
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- `Character`: GraphQL 오브젝트 타입. 해당 타입은 필드들을 가진다. 스키마에 존재하는 대부분의 타입은 그래프QL 오브젝트 타입이다.
- `name`, `appearsIn`: Character 타입의 필드들이다. Character 타입에 존재하는 필드는 오직 `name` 과 `appearsIn` 두개밖에 없음을 나타낸다.
- `String`: 내장된 스트링 자료형 타입 - 하나의 스칼라 오브젝트임을 나타내며 하위선택자가 없음을 나타낸다.
- `String!`: 해당 필드는 non-nullable 임을 의미하며 느낌표로 나타냄. 해당 필드에 대한 쿼리를 날리면 GraphQL은 반드시 해당 필드의 값을 줌을 보장한다.
- `[Episode!]!`: 반환값은 `Episode` 오브젝트들의 배열임을 나타낸다. non-nullable이므로 항상 (0 개 이상의 값을 가지는) 배열을 받을 수 있음을 알 수 있으며, `Episode!` 또한 non-nullable 이므로 배열에 있는 모든 아이템은 `Episode` 오브젝트 임을 확신할 수 있다.

### 리졸버

리졸버는 그 이름이 지닌 '해결사' 라는 의미 그대로, API 사용자가 요청한 데이터를 해결(resolve)한다.

리졸버를 작성하려면 먼저 스키마에서 리졸버를 정의한 다음 자바스크립트 코드 내에서 로직을 구현해야 한다.
API 에는 쿼리와 뮤테이션이라는 두 가지 자료형의 리졸버가 포함된다.

모든 그래프QL 서비스는 쿼리 타입을 가지며, 뮤테이션 타입을 가질 수 있다. 이 두 타입들은 일반 오브젝트 타입과 동일하나,
그래프QL 쿼리의 엔트리 포인트(entry point)를 정의한다는 면에서 특별하다.

#### 쿼리

쿼리는 API에 특정 데이터를 원하는 형식으로 요청한다. 그러면 쿼리는 API 사용자가 요청한 데이터를 포함하는 객체를 반환한다.
쿼리는 데이터를 수정하지 않으며, 데이터에 접근만 할 수 있다.

#### 뮤테이션

API에서 데이터를 수정할 때에는 뮤테이션을 사용한다. 쿼리와 마찬가지로 뮤테이션도 객체의 형태로 결과를 반환하며,
일반적으로 수행한 작업의 최종 결과를 반환한다.

### API 적용하기

그래프QL API 를 이용하여 notes 데이터를 가져온다. 스키마는 그래프QL의 데이터 표현 및 상호작용 방식이다. 
이 애플리케이션에서 쿼리와 뮤테이션의 대상은 `Note` 이고, 이 `Note` 에는 `id`, `content`, `author` 필드가 포함된다.

이에 해당하는 자료형을 `typeDefs` 그래프QL  스키마 내에 생성한다.
```ts
type Note {
  id: ID!
  content: String!
  author: String!
}
```

다음으로 모든 노트 목록을 검색할 수 있는 쿼리를 추가하자. 노트 개체의 배열을 반환하는 `notes` 쿼리를 포함하도록 Query 자료형을 업데이트 한다.
```ts
type Query {
  hello: String!
  notes: [Note]!
}
```

이제 리졸버 코드를 업데이트하여 데이터 배열을 반환하게 해야 한다. 
```ts
const resolvers = {
  //...
  notes: () => notes
}
```

다음 쿼리를 입력하여 제대로 응답이 오는지 확인해보자.
```ts
query {
  notes {
    id
    content
    author
  }
}
```

이제 요청할 필드 중 일부를 제거해보자. 그렇게 하면 API가 나머지 데이터만을 정확하게 반환한다.
이 특징을 이용하면 데이터를 소비하는 클라이언트가 각 요청에 의해 전송되는 데이터의 양을 제어하고, 전송되는 데이터를 정확히 필요한 만큼으로 제한할 수 있다. 

이제 하나의 노트만 쿼리하는 코드를 작성해보자.

```ts
// 스키마
type Query {
  hello: String!
  notes: [Note]!
  note(id: ID!): Note!
}
```

```ts
// 리졸버
const resolvers = {
  //...
  notes: () => notes,
  note: (parent, args) => notes.find(note => note.id === args.id)
}
```

이 때 사용자가 쿼리와 함께 전달한 인수가 필요하므로 리졸버에 전달되는 네 개의 값 중 `args` 를 꺼내어 사용한다. 
리졸버에는 총 네 개의 값이 전달되며 각 전달인자는 다음과 같다.

* `parent`: `parent` 쿼리의 결과로, 쿼리를 중복으로 감쌀 때 유용하다.
* `args`: 사용자가 쿼리와 함께 전달한 인수(전달인자) 이다.
* `context`: 서버 애플리케이션이 리졸버 함수에 전달하는 정보로, 현재 사용자나 데이터베이스의 정보와 같은 것이 포함된다.
* `info`: 쿼리 자체에 대한 정보이다.
