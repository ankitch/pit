import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { client as redisClient, setDataByKey } from "./helpers/redis";
import { readFileSync } from "fs";
import fetch from "node-fetch";
import resolvers from "./graphql/resolvers";
import { everyMinuteUpdateUserScheduler } from "./scheduler";

import "dotenv/config";
import { REDIS_KEY } from "./constants";

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

  // Fetch data from api and set data into redis
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
  await setDataByKey(REDIS_KEY, user);

  //run scheduler at startup
  await everyMinuteUpdateUserScheduler.start();
  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
