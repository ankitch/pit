import { getDataByKey, setDataByKey } from "../helpers/redis";

const resolvers = {
  Query: {
    getUsers: async () => {
      const data = await getDataByKey("USER");
      return data;
    },
  },
  Mutation: {
    updateUser: async (_: any, args: any) => {
      const data = await getDataByKey("USER");

      const updatedData = { ...data, message: `manual = ${args.message}` };
      await setDataByKey("USER", updatedData);
      return updatedData;
    },
  },
};

export default resolvers;
