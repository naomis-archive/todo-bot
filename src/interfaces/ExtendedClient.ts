import { Client, WebhookClient } from "discord.js";
import { Job } from "node-schedule";

import { Command } from "./Command";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    debugHook: WebhookClient;
    ownerId: string;
    homeGuild: string;
    dbUrl: string;
  };
  commands: Command[];
  cronCache: {
    [dailyId: string]: Job;
  };
}
