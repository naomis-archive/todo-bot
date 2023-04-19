import { connect } from "mongoose";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Instantiates the database connection.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const connectDatabase = async (bot: ExtendedClient) => {
  try {
    await connect(bot.env.dbUrl);
  } catch (err) {
    await errorHandler(bot, "connect database", err);
  }
};
