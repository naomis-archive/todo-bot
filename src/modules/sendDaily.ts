import { Daily } from "../database/models/Daily";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a daily reminder to Naomi.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Daily} daily The daily to send.
 */
export const sendDaily = async (bot: ExtendedClient, daily: Daily) => {
  try {
    const guild = await bot.guilds.fetch(bot.env.homeGuild);
    const naomi = await guild.members.fetch(bot.env.ownerId);

    await naomi.send({
      content: `It is time to do **${daily.name}**\n${daily.description}`,
    });
  } catch (err) {
    await errorHandler(bot, "send daily", err);
  }
};
