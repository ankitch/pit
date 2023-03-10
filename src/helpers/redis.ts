import * as redis from "redis";
import { REDIS_KEY } from "../constants";

interface User {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  message: string;
}

export const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

client.connect();

client.on("SIGINT", async () => {
  await client.quit();
  await setDataByKey(REDIS_KEY, "");
});

export const getDataByKey = async (keyName: string): Promise<User> => {
  try {
    const data = await client.GET(keyName);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const setDataByKey = async (keyName: string, value: {}) => {
  try {
    const data = await client.SET(keyName, JSON.stringify(value));
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const setMessage = async (
  keyName: string,
  message: string
): Promise<Boolean> => {
  try {
    const data = await getDataByKey(keyName);
    if (!data) {
      return false;
    }
    const updatedData = { ...data, message };
    await setDataByKey(keyName, updatedData);
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
