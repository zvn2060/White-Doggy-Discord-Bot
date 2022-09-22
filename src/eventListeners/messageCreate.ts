import { Message, Client } from "discord.js";
import { tackleQuestion } from "../utility/conversation";
import { EventListner } from "./eventListener";

const ALLOW_CHANNEL = ["819865905797529610", "1013282681032814637", "1019941616032677888"];

export const MessageCreate: EventListner = {
    listen: (client: Client): void => {
        client.on("messageCreate", async (message: Message) => {
            if (message.author.bot || !ALLOW_CHANNEL.includes(message.channelId))
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
