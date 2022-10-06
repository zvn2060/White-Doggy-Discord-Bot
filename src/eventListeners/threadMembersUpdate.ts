import { Client, TextChannel, ThreadChannel } from "discord.js";
import { CHANNEL_ID } from "../constant";
import { EventListner } from "./eventListener";


export const ThreadMembersUpdate: EventListner = {
    listen: (client: Client): void => {
        client.on("threadMembersUpdate", async (_1, _2, thread: ThreadChannel) => {
            const size = thread.members.cache.size;
            if (thread.parentId === CHANNEL_ID.FORUM && size >= 5 && thread.members.me) {
                const channel = client.channels.resolve(CHANNEL_ID.FREE_TALK) as TextChannel;
                channel.send({
                    content: `已經有 ${size} 人在討論 <#${thread.id}> 了，趕緊加入討論吧`
                })
                thread.leave();
            }
        })
    }
}
