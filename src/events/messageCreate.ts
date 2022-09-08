import { Message, Client } from "discord.js";
import { tackleQuestion } from "../utility/conversation";


export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        if (message.author.bot)
            return;

        var content = message.content;
        
        content = removeMentions(content).trim();
        const response = tackleQuestion(content);
        if (response) {
            await sendReply(message, response);
        }
    })
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
