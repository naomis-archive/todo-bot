import { Client, GatewayIntentBits } from "discord.js";

import { connectDatabase } from "./database/connectDatabase";
import { DailyModel } from "./database/models/Daily";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { scheduleDaily } from "./modules/scheduleDaily";
import { loadCommands } from "./utils/loadCommands";
import { validateEnv } from "./utils/validateEnv";

async () => {
  const bot = new Client({
    intents: [GatewayIntentBits.Guilds],
  }) as ExtendedClient;
  bot.env = validateEnv();
  // does not change the values of bot.
  // eslint-disable-next-line require-atomic-updates
  bot.commands = await loadCommands(bot);
  await connectDatabase(bot);

  bot.on("ready", async () => {
    await bot.env.debugHook.send({
      content: `Bot is ready! Logged in as ${bot.user?.tag}`,
    });
    const dailies = await DailyModel.find();
    for (const daily of dailies) {
      await scheduleDaily(bot, daily);
    }
  });

  bot.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.user.id !== bot.env.ownerId) {
        await interaction.reply({
          content: "Only Naomi may use this bot.",
          ephemeral: true,
        });
      }
      await interaction.deferUpdate();
      const [type, id] = interaction.customId.split("-");
      const daily = await DailyModel.findById(id);
      if (!daily) {
        await interaction.update({
          content: "This daily no longer exists.",
          components: [],
        });
        return;
      }
      if (type === "complete") {
        daily.streak++;
        await daily.save();
        await interaction.update({
          content: `You have completed **${daily.name}**. Your streak is now ${daily.streak} days.`,
          components: [],
        });
      }
      if (type === "skip") {
        daily.streak = 0;
        await daily.save();
        await interaction.update({
          content: `You have skipped **${daily.name}**. Your streak is now ${daily.streak} days.`,
          components: [],
        });
      }
    }
    if (!interaction.isChatInputCommand()) {
      return;
    }
    if (interaction.user.id !== bot.env.ownerId) {
      await interaction.reply({
        content: "Only Naomi may use this bot.",
        ephemeral: true,
      });
    }

    const command = bot.commands.find(
      (c) => c.data.name === interaction.commandName
    );

    if (!command) {
      await interaction.reply({
        content: "An error occurred.",
        ephemeral: true,
      });
      return;
    }
    await command.run(bot, interaction);
  });

  await bot.login(bot.env.token);
};
