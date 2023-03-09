import * as redis from "redis";

export const client = redis.createClient();

client.connect();

client.on("SIGINT", async () => {
  await client.quit();
  await setDataByKey("USER", "");
});

export const getDataByKey = async (keyName: string): Promise<{}> => {
  try {
    const data = await client.GET(keyName);
    return data ? JSON.parse(data) : {};
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
