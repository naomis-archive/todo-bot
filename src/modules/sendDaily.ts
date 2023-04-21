import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

import { Daily, DailyModel } from "../database/models/Daily";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Sends a daily reminder to Naomi.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Daily} staleDaily The daily to send.
 */
export const sendDaily = async (bot: ExtendedClient, staleDaily: Daily) => {
  try {
    const guild = await bot.guilds.fetch(bot.env.homeGuild);
    const naomi = await guild.members.fetch(bot.env.ownerId);

    const daily = await DailyModel.findById(staleDaily._id);

    if (!daily) {
      await naomi.send(`Daily **${staleDaily.name}** does not exist.`);
      bot.cronCache[staleDaily._id].cancel();
      delete bot.cronCache[staleDaily._id];
      return;
    }

    const button = new ButtonBuilder()
      .setLabel("Complete")
      .setCustomId(`complete-${daily._id}`)
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅");
    const skip = new ButtonBuilder()
      .setLabel("Skip")
      .setCustomId(`skip-${daily._id}`)
      .setStyle(ButtonStyle.Danger)
      .setEmoji("⏭");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      button,
      skip
    );

    await naomi.send({
      content: `It is time to do **${daily.name}**\n${daily.description}\nYou have a ${daily.streak} day streak.`,
      components: [row],
    });
  } catch (err) {
    await errorHandler(bot, "send daily", err);
  }
};
