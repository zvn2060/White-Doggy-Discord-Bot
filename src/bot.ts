import express, { Express, Request, Response } from "express"
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { exit } from 'node:process';
import ready from './events/ready';
import interactionCreate from './events/interactionCreate';
import messageCreate from './events/messageCreate';
import debug from "./events/debug"
import rateLimit from "./events/rateLimit"
import { scheduleJob } from "node-schedule";
import { initializePageBank } from "./commands/wiki/wiki";


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

    client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
    

    await initializePageBank();
    ready(client);
    interactionCreate(client);
    messageCreate(client);
    debug(client);
    rateLimit(client);
    client.login(BOT_TOKEN).catch(console.error);

    app.get('/keepalive', (request: Request, response: Response) => console.log("beep"))

    app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
    
    // 819865905797529610 交流區頻道 ID
    scheduleJob({ hour: 13, minute: 30 },  (fireDate) => {
        rest.post(Routes.channelMessages("819865905797529610"), {
            body: {
                content: [
                    `今日聯隊戰 **BR ${currentBattleRating(fireDate)}**`,
                    "有興趣的玩家歡迎在 **21:45** 左右進到<#1009042130456543302>",
                    "裡面會有具經驗的人分組以及討論出甚麼載具以及大概怎麼打會比較好",
                    "希望大家踴躍參與，讓聯隊的排名能夠更前面",
                    "我們這季的目標是繼續保持前 100 名",
                    "另外我們未來會執行最低個人評分的標準",
                    "所以希望大家可以多來累積經驗<:text_welcome:904638663906983946>"
                ].join("\n")
            },
        }).catch(console.error)
    })
}


function listMembers(guild_id: string, limit: number) {
    try {
        const query = new URLSearchParams({ limit: `${limit}` })
        return rest.get(Routes.guildMembers(guild_id), { query: query })
    } catch (error) {
        console.error(error);
    }
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


const $11_3 = new Date(2022, 8, 5);
const $10_3 = new Date(2022, 8, 12);
const $9_7 = new Date(2022, 8, 19);
const $8_7 = new Date(2022, 8, 26);
const $7_7 = new Date(2022, 9, 3);
const $6_7 = new Date(2022, 9, 10);
const $5_7 = new Date(2022, 9, 17);
const $4_7 = new Date(2022, 9, 24);
const $3_7 = new Date(2022, 9, 31);
