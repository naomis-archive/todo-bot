import { SlashCommandBuilder } from "discord.js";

import { TaskModel } from "../database/models/Task";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const tasks: Command = {
  data: new SlashCommandBuilder()
    .setName("tasks")
    .setDescription("Manages the tasks.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a new task.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The description of the task.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("due-date")
            .setDescription(
              "The cron schedule to send the reminder on. YYYY-MM-DD format."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("A description of the task.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a task.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the task to remove.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("Lists all tasks.")
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "add") {
        const name = interaction.options.getString("name", true);
        const dueDate = new Date(
          interaction.options.getString("due-date", true)
        );
        const description = interaction.options.getString("description");

        const exists = await TaskModel.findOne({ name });
        if (exists) {
          await interaction.editReply({
            content: `A task with the name \`${name}\` already exists.`,
          });
          return;
        }

        await TaskModel.create({
          name,
          dueDate,
          description,
        });

        await interaction.editReply({
          content: `Successfully created a daily with the name \`${name}\`. Due at ${dueDate.toLocaleDateString()}.`,
        });
      }

      if (subcommand === "remove") {
        const name = interaction.options.getString("name", true);

        await TaskModel.deleteOne({ name });

        await interaction.editReply({
          content: `Successfully deleted the daily with the name \`${name}\`.`,
        });
      }

      if (subcommand === "list") {
        const models = await TaskModel.find();

        if (models.length === 0) {
          await interaction.editReply({
            content: "There are no dailies.",
          });
          return;
        }

        const tasks = models.map(
          (model) =>
            `\`${model.name}\` - Due ${model.dueDate.toLocaleDateString()}\n${
              model.description
            }\n`
        );

        await interaction.editReply({
          content: tasks.join("\n"),
        });
      }
    } catch (err) {
      await errorHandler(bot, "tasks command", err);
    }
  },
};
