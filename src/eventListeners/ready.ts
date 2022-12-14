import { Client} from "discord.js";
import { Commands } from "../commands/commands";
import { EventListner } from "./eventListener";


export const Ready: EventListner = {
    listen: (client: Client): void => {
        client.once("ready", async () => {
            if (!client.user || !client.application)
                return;

            await client.application.commands.set(Commands);

            console.log(`Ready! Logged in as ${client.user?.tag}`);
        })
    }
}

