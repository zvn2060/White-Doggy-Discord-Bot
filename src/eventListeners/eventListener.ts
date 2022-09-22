import { Client } from "discord.js";

export interface EventListner {
    listen: (client: Client) => void;
}