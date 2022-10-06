import { Client, TextChannel } from "discord.js";
import { CHANNEL_ID, ROLE_ID } from "../constant";

const Database = require("@replit/database")
const db = new Database()

export class Section {
    start: Date;
    end: Date;
    battleRating: number;
    constructor(start: Date, end: Date, battleRating: number) {
        this.start = start;
        this.end = end;
        this.battleRating = battleRating;
    }
}

const schedule: Section[] = [];
var client: Client;

export async function restoreSchedule(_client: Client) {
    client = _client;
    const section_count = await db.get("section count");
    for (var i = 0; i < section_count; i++) {
        const json_string = await db.get(`week ${i + 1}`);
        const json = JSON.parse(json_string);
        schedule.push(new Section(
            new Date(json.start),
            new Date(json.end),
            json.battleRating
        ))
    }
}


export async function squadBattleNotify(fireDate: Date) {
    const channel = client.channels.resolve(CHANNEL_ID.SQUAD_BATTLE_BULLETIN) as TextChannel;
    const previous_notify_id = await db.get("previous notify");
    channel.messages.fetch(previous_notify_id).then(message => message.delete()).catch();
    const message = await channel.send({
        content: generateMessage(fireDate)
    }).catch(console.error)
    if (message) {
        db.set("previous notify", message.id);
    }
}


function generateMessage(date: Date) {
    for (const section of schedule) {
        if (date <= section.end) {
            return [
                `<@&${ROLE_ID.TNO8_MEMBER}>`,
                `今日聯隊戰 **BR ${section.battleRating}**`,
                `有意願的玩家請 **21:45** 左右進到<#${CHANNEL_ID.SQUAD_BATTLE_VOICE_A}>待命`,
                "還沒開隊前可以先做自己的事 <a:cappo_love:1027062315817910282>",
                // "希望大家踴躍參與，讓聯隊的排名能夠更前面",
                // "我們這季的目標是繼續保持前 100 名",
                // "另外我們未來會執行最低個人評分的標準",
                // "所以希望大家可以多來累積經驗<:012:909355568387477544>"
            ].join("\n")
        }
    }

    return [
        "<@287556741808259075>",
        "**新賽季，須更新行程表**",
        "<https://forum.warthunder.com/index.php?/topic/408054-season-schedule-for-squadron-battles>"
    ].join("\n");
}