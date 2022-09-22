import { Client } from "discord.js";
import { EventListner } from "./eventListener";

export const RateLimited: EventListner = {
    listen: (client: Client): void => { client.rest.on("rateLimited", console.error) }
}

