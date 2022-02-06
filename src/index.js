const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
require("dotenv").config();

const db = require("./db");
const models = require("./models");

// .env 에 명시된 포트 또는 4000 에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// 그래프QL 스키마 언어로 스키마를 구성
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

// 스키마 필드를 위한 리졸버 함수
const resolvers = {
  Query: {
    hello: () => "Hello There",
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    },
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: "Rexian",
      });
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

  // 아폴로 GraphQL 미들웨어를 적용하고 경로를 /api 로 설정
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
