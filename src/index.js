const express = require("express");
const { ApolloServer } = require("apollo-server-express");
require("dotenv").config();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

const db = require("./db");
const models = require("./models");

// .env 에 명시된 포트 또는 4000 에서 서버 실행
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const config = {
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  },
};

(async function startApolloServer(config) {
  // Apollo 서버 설정
  const server = new ApolloServer(config);
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
})(config);
