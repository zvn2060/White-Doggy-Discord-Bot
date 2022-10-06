import { Client, ThreadChannel } from "discord.js";
import { CHANNEL_ID } from "../constant";
import { EventListner } from "./eventListener";


export const ThreadCreate: EventListner = {
    listen: (client: Client): void => {
        client.on("threadCreate", async (thread: ThreadChannel, newlyCreated: boolean) => {
            if (newlyCreated && thread.parentId === CHANNEL_ID.FORUM) {
                thread.join();
            }
        })
    }
}
