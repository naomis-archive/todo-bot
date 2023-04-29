import { readdir } from "fs/promises";
import { join } from "path";

import { Command } from "../interfaces/Command";
import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * returning a success status upon mounting to bot instance.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} If commands were successfully mounted and loaded.
 */
export const loadCommands = async (bot: ExtendedClient): Promise<boolean> => {
  try {
    const result: Command[] = [];
    const files = await readdir(join(process.cwd(), "prod", "commands"));
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "prod", "commands", file));
      result.push(mod[name] as Command);
    }
    bot.commands = result;
    return true;
  } catch (err) {
    await errorHandler(bot, "load commands", err);
    return false;
  }
};
