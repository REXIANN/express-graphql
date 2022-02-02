const express = require("express");

const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello There",
  },
};

const port = process.env.PORT || 4000;

// 이전과 동일한 아폴로 3.0 이상 버전의 서버 시작
async function startApolloServer(typeDefs, resolvers) {
  // Apollo 서버 설정
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = express();

  // GraphQL 미들웨어 적용하고 경로를 /api 로 설정
  server.applyMiddleware({ app, path: "/api" });

  await new Promise(() =>
    app.listen({ port }, () => {
      console.log(
        `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
      );
    }));
}

startApolloServer(typeDefs, resolvers);
