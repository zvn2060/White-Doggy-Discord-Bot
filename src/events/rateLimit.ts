import { Client } from "discord.js";

export default (client: Client): void => { client.rest.on("rateLimited", console.error) }

