import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Validates that the environment variables are set.
 *
 * @returns {ExtendedClient["env"]} The environment variable object.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (!process.env.BOT_TOKEN) {
    logHandler.log("error", "BOT_TOKEN is not set in the environment.");
    process.exit(1);
  }

  if (!process.env.DEBUG_HOOK) {
    logHandler.log("error", "DEBUG_HOOK is not set in the environment.");
    process.exit(1);
  }

  if (!process.env.OWNER_ID) {
    logHandler.log("error", "OWNER_ID is not set in the environment.");
    process.exit(1);
  }

  if (!process.env.HOME_GUILD) {
    logHandler.log("error", "HOME_GUILD is not set in the environment.");
    process.exit(1);
  }

  if (!process.env.MONGO_URL) {
    logHandler.log("error", "MONGO_URL is not set in the environment.");
    process.exit(1);
  }

  return {
    token: process.env.BOT_TOKEN,
    debugHook: new WebhookClient({ url: process.env.DEBUG_HOOK }),
    ownerId: process.env.OWNER_ID,
    homeGuild: process.env.HOME_GUILD,
    dbUrl: process.env.MONGO_URL,
  };
};
