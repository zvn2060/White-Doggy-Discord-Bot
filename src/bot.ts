import express, { Express, Request, Response } from "express"
import { Client, GatewayIntentBits, ChannelType } from "discord.js";
import { exit } from 'node:process';
import { scheduleJob } from "node-schedule";
import { initializePageBank } from "./commands/wiki/wiki";
import { addEventListeners } from "./eventListeners/eventListeners";
import { pushNews } from "./utility/gaijinNews";
import { restoreSchedule, squadBattleNotify } from "./utility/squadBattleNotify";
import { fetchAnswers } from "./utility/conversation";

var client: Client;
const app: Express = express();
const port = 5000;

main();

async function main() {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    if (!BOT_TOKEN) {
        console.error("Discord Bot Token Missing");
        exit(-1);
    }

    console.log("Bot is starting");

    client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


    await initializePageBank();
    await restoreSchedule(client);
    await fetchAnswers();

    addEventListeners(client);

    client.login(BOT_TOKEN).catch(console.error);

    app.get('/keepalive', (req, res) => console.log("beep"));
    app.get('/guilds/:guildId/members', listMembers);
    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

    scheduleJob({ hour: 13, minute: 30 }, squadBattleNotify);

    scheduleJob("*/20 * * * *", checkNews)

}

function checkNews() {
    const forumChannel = client.channels.resolve("1019925188709716018")

    if (forumChannel?.type == ChannelType.GuildForum)
        pushNews(forumChannel);
}


async function listMembers(request: Request, response: Response) {
    const guild_id = request.params.guildId;
    const role_id = request.query.role_id as string;
    const guild = client.guilds.resolve(guild_id);
    const result = await guild?.members.fetch()
    const wanted = result?.filter(member => member.roles.cache.has(role_id))
        .map(member => ({
            id: member.user.id,
            nickname: member.nickname,
            username: member.user.username,
            discriminator: member.user.discriminator
        }));

    response.json(wanted);
}