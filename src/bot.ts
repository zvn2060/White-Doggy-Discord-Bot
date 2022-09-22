import express, { Express, Request, Response } from "express"
import { Client, GatewayIntentBits, ChannelType, REST, Routes } from "discord.js";
import { exit } from 'node:process';
import { scheduleJob } from "node-schedule";
import { initializePageBank } from "./commands/wiki/wiki";
import { addEventListeners } from "./eventListeners/eventListeners";
import { pushNews } from "./utility/gaijinNews";

var client: Client;
var rest: REST;
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

    client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    rest = new REST({ version: '10' }).setToken(BOT_TOKEN);


    await initializePageBank();
    addEventListeners(client);

    client.login(BOT_TOKEN).catch(console.error);

    app.get('/keepalive', (req, res) => console.log("beep"));
    app.get('/guilds/:guildId/members', listMembers);
    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

    scheduleJob({ hour: 13, minute: 30 }, squadBattleNotify);

    scheduleJob("*/5 * * * *", checkNews)

}

function checkNews() {
    const forumChannel = client.channels.resolve("1019925188709716018")

    if (forumChannel?.type == ChannelType.GuildForum)
        pushNews(forumChannel);
}

function squadBattleNotify(fireDate: Date) {
    // 1019941616032677888 交流區頻道 ID
    rest.post(Routes.channelMessages("1019941616032677888"), {
        body: {
            content: [
                `<@&896506243496161340> 今日聯隊戰 **BR ${currentBattleRating(fireDate)}**`,
                "有興趣的玩家歡迎在 **21:45** 左右進到<#1009042130456543302>",
                "裡面會有具經驗的人分組以及討論出甚麼載具以及大概怎麼打會比較好",
                "希望大家踴躍參與，讓聯隊的排名能夠更前面",
                "我們這季的目標是繼續保持前 100 名",
                "另外我們未來會執行最低個人評分的標準",
                "所以希望大家可以多來累積經驗<:text_welcome:904638663906983946>"
            ].join("\n")
        },
    }).catch(console.error)
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


function currentBattleRating(date: Date) {
    if (date <= $11_3) return "11.3";
    if (date <= $10_3) return "10.3";
    if (date <= $9_7) return "9.7";
    if (date <= $8_7) return "8.7";
    if (date <= $7_7) return "7.7";
    if (date <= $6_7) return "6.7";
    if (date <= $5_7) return "5.7";
    if (date <= $4_7) return "4.7";
    if (date <= $3_7) return "3.7";

    return "新賽季，聯絡表情";
}


const $11_3 = new Date(2022, 8, 6);
const $10_3 = new Date(2022, 8, 13);
const $9_7 = new Date(2022, 8, 20);
const $8_7 = new Date(2022, 8, 27);
const $7_7 = new Date(2022, 9, 4);
const $6_7 = new Date(2022, 9, 11);
const $5_7 = new Date(2022, 9, 18);
const $4_7 = new Date(2022, 9, 25);
const $3_7 = new Date(2022, 10, 1);
