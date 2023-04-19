import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

import { ExtendedClient } from "./ExtendedClient";

export interface Command {
  data: SlashCommandSubcommandsOnlyBuilder;
  run: (
    bot: ExtendedClient,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}
