import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { client as redisClient, setDataByKey } from "./helpers/redis";
import { readFileSync } from "fs";
import fetch from "node-fetch";
import resolvers from "./graphql/resolvers";

const typeDefs = readFileSync("src/graphql/schema.graphql", {
  encoding: "utf-8",
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  const res = await fetch("https://random-data-api.com/api/v2/users");
  const { id, uid, first_name, last_name, username, email, message } =
    await res.json();

  const user = {
    id,
    uid,
    first_name,
    last_name,
    username,
    email,
    message,
  };
  await setDataByKey("USER", user);

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
