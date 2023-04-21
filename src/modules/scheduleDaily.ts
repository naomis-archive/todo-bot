import { scheduleJob } from "node-schedule";

import { Daily } from "../database/models/Daily";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

import { sendDaily } from "./sendDaily";

/**
 * Schedules a daily reminder job.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Daily} daily The daily to schedule.
 */
export const scheduleDaily = async (bot: ExtendedClient, daily: Daily) => {
  try {
    const job = await scheduleJob(
      daily.cron,
      async () => await sendDaily(bot, daily)
    );
    bot.cronCache[daily._id] = job;
  } catch (err) {
    await errorHandler(bot, "schedule daily", err);
  }
};
