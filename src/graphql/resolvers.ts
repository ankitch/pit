import { REDIS_KEY } from "../constants";
import { getDataByKey, setDataByKey } from "../helpers/redis";
interface UpdatedUserResponse {
  success: boolean;
  message: string;
}

interface UpdatePayload {
  message: string;
}

const resolvers = {
  Query: {
    getUsers: async () => {
      const data = await getDataByKey(REDIS_KEY);
      return data;
    },
  },
  Mutation: {
    updateUser: async (
      _parent: undefined,
      payload: UpdatePayload
    ): Promise<UpdatedUserResponse> => {
      try {
        const data = await getDataByKey(REDIS_KEY);

        if (!payload.message) {
          return {
            success: false,
            message: "Please provide a payload to update the user.",
          };
        }

        if (!data) {
          return {
            success: false,
            message: "No data to be updated.",
          };
        }

        const updatedData = { ...data, message: `manual - ${payload.message}` };
        await setDataByKey(REDIS_KEY, updatedData);

        return {
          success: true,
          message: "Updated user successfully.",
        };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: `There was an error updating user ${err}`,
        };
      }
    },
  },
};

export default resolvers;
