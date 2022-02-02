const express = require("express");

const { ApolloServer, gql } = require("apollo-server-express");

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
`;

const resolvers = {
  Query: {
    hello: () => "Hello There",
    notes: () => notes,
    note: (parent, args) => notes.find(note => note.id === args.id),
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
    })
  );
}

startApolloServer(typeDefs, resolvers);
