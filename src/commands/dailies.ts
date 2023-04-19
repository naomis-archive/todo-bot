import { toString } from "cronstrue";
import { SlashCommandBuilder } from "discord.js";

import { DailyModel } from "../database/models/Daily";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const dailies: Command = {
  data: new SlashCommandBuilder()
    .setName("dailies")
    .setDescription("Manages the dailies.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a new daily.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The description of the daily.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("schedule")
            .setDescription("The cron schedule to send the reminder on.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("A description of the daily.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a daily.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the daily to remove.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Lists all dailies.")
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "add") {
        const name = interaction.options.getString("name", true);
        const schedule = interaction.options.getString("schedule", true);
        const description = interaction.options.getString("description");

        const exists = await DailyModel.findOne({ name });
        if (exists) {
          await interaction.editReply({
            content: `A daily with the name \`${name}\` already exists.`,
          });
          return;
        }

        await DailyModel.create({
          name,
          schedule,
          description,
        });

        await interaction.editReply({
          content: `Successfully created a daily with the name \`${name}\`. Will run ${toString(
            schedule
          )}.`,
        });
      }

      if (subcommand === "remove") {
        const name = interaction.options.getString("name", true);

        await DailyModel.deleteOne({ name });

        await interaction.editReply({
          content: `Successfully deleted the daily with the name \`${name}\`.`,
        });
      }

      if (subcommand === "list") {
        const models = await DailyModel.find();

        if (models.length === 0) {
          await interaction.editReply({
            content: "There are no dailies.",
          });
          return;
        }

        const dailies = models.map(
          (model) =>
            `\`${model.name}\` - ${toString(model.cron)}\n${
              model.description
            }\n`
        );

        await interaction.editReply({
          content: dailies.join("\n"),
        });
      }
    } catch (err) {
      await errorHandler(bot, "dailies command", err);
    }
  },
};
