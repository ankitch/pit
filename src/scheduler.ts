import cron, { ScheduleOptions } from "node-cron";
import { REDIS_KEY } from "./constants";
import { setMessage } from "./helpers/redis";

const scheduleOptions: ScheduleOptions = {
  scheduled: false,
  name: "updateUser",
};

const scheduleAction = async () => {
  const currentDate = new Date();

  const data = await setMessage(
    REDIS_KEY,
    `automated - ${currentDate.toUTCString()}`
  );

  if (data) {
    console.log("🪄 Updated user automagically !", currentDate.toUTCString());
  }
};

const everyMinuteUpdateUserScheduler = cron.schedule(
  "* * * * *",
  scheduleAction,
  scheduleOptions
);

export { everyMinuteUpdateUserScheduler };
