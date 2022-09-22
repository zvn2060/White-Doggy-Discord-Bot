import { EmbedBuilder } from "discord.js";
import { Page } from "./page";
import * as cheerio from "cheerio"
import * as Transliterate from "./transliterate"

const axios = require('axios').default;
const NO_IMAGE_PLACEHOLDER_URL = "https://i.imgur.com/pyHhaRx.png";

export async function generateEmbed(page: Page, now: number, total: number): Promise<EmbedBuilder> {
    try {
        var embed = await createDetailedWikiEmbed(page)
    } catch {
        embed = createSimpleWikiEmbed(page)
    }

    return embed.setColor("#FE0000").setAuthor({ name: `搜尋結果 ${now + 1} / ${total}` });
}


function createSimpleWikiEmbed(page: Page): EmbedBuilder {
    return new EmbedBuilder().setTitle(`${page.title} - War Thunder Wiki`)
        .setURL(page.url)
}

async function createDetailedWikiEmbed(page: Page): Promise<EmbedBuilder> {
    const response = await axios.get(page.url);
    const [nation, rank, vehicle_classes, battle_ratings, image_url] = parseVehicleInfo(response.data)

    const embed = new EmbedBuilder().setTitle(`${page.title} - War Thunder Wiki`)
        .setURL(page.url)
        .addFields(
            { name: '國家', value: nation, inline: true },
            { name: '階級', value: rank, inline: true },
            { name: '類別', value: vehicle_classes.join('\n'), inline: true }
        )
        .addFields(
            { name: '街機娛樂', value: battle_ratings[0], inline: true },
            { name: '歷史性能', value: battle_ratings[1], inline: true },
            { name: '全真模擬', value: battle_ratings[2], inline: true }
        )
        .setImage(image_url);

    return embed;
}


function parseVehicleInfo(htmlResponse: string): [string, string, string[], string[], string] {
    const $  = cheerio.load(htmlResponse);
    const spec_card_dom = $(".specs_card_main");
    const general_info_dom = spec_card_dom.find(".general_info");
    const general_info2_dom = spec_card_dom.find(".general_info_2");

    const image_url = spec_card_dom.find(".specs_card_main_slider>.specs_card_main_slider_system>div:nth-child(1)>img").attr("src");

    const nation = general_info_dom.find(".general_info_nation").text().trim();
    const rank = general_info_dom.find(".general_info_rank").text().split(" ")[0].trim();

    const vehicle_classes: string[] = [];
    const battle_ratings: string[] = [];
    general_info2_dom.find(".general_info_class>div").each((i, ele) =>  vehicle_classes.push($(ele).text().trim()));
    general_info2_dom.find("td").each((i, ele) =>  battle_ratings.push($(ele).text().trim()));

    return [
        Transliterate.nation(nation),
        Transliterate.rank(rank),
        Transliterate.classes(vehicle_classes),
        battle_ratings.slice(3),
        image_url ?? NO_IMAGE_PLACEHOLDER_URL
    ];
}