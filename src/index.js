const express = require("express");

const { ApolloServer, gql } = require("apollo-server-express");

require("dotenv").config();
const db = require("./db");

// .env 에 명시된 포트 또는 4000 에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

let notes = [
  {
    id: "1",
    content: "This is a note",
    author: "Adam Scott",
  },
  {
    id: "2",
    content: "This is another note",
    author: "harlow Everly",
  },
  {
    id: "3",
    content: "another note again",
    author: "Riley Harrison",
  },
];

const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    newNote(content: String!): Note
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello There",
    notes: () => notes,
    note: (parent, args) => notes.find((note) => note.id === args.id),
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        author: "Rexian",
      };

      notes.push(noteValue);
      return noteValue;
    },
  },
};

// 이전과 동일한 아폴로 3.0 이상 버전의 서버 시작
async function startApolloServer(typeDefs, resolvers) {
  // Apollo 서버 설정
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();

  db.connect(DB_HOST);

  // GraphQL 미들웨어 적용하고 경로를 /api 로 설정
  server.applyMiddleware({ app, path: "/api" });

  await new Promise(() =>
    app.listen({ port }, () => {
      console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
      );
    })
  );
}

startApolloServer(typeDefs, resolvers);
