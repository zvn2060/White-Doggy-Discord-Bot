import { Message, Client, GuildTextBasedChannel, ChannelType } from "discord.js";
import { ALLOWED_CATEGORY } from "../constant";
import { tackleQuestion } from "../utility/conversation";
import { EventListner } from "./eventListener";


export const MessageCreate: EventListner = {
    listen: (client: Client): void => {
        client.on("messageCreate", async (message: Message) => {
            const channel = message.channel as GuildTextBasedChannel;
            const parentId = channel.type === ChannelType.GuildText ? channel.parentId : channel.parent?.parentId;
            var isChannelMember = false;
            if (channel.isThread())
                isChannelMember = channel.members.cache.has(client.user!!.id)
            else if (channel.isTextBased())
                isChannelMember = channel.members.has(client.user!!.id)

            if (!isChannelMember || message.author.bot || !parentId || !ALLOWED_CATEGORY.includes(parentId))
                return;

            var content = message.content;

            content = removeMentions(content).trim();
            const response = tackleQuestion(content);
            if (response) {
                await sendReply(message, response);
            }
        })
    }
}

async function sendReply(message: Message, reply: string) {
    try {
        message.reply(reply);
    } catch (error) {
        console.error(error);
    }
}

function removeMentions(message: string) {
    return message.replace(/<@.*>/, "");
}
