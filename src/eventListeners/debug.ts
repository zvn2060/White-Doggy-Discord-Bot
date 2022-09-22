import { Client } from "discord.js";
import { EventListner } from "./eventListener";

export const Debug: EventListner = {
    listen: (client: Client): void => { client.on("debug", console.log) }
}
