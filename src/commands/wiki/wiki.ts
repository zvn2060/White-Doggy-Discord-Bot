import { ChatInputCommandInteraction, Client, ApplicationCommandOptionType, AutocompleteInteraction } from 'discord.js';
import { Command } from '../command';
import { Page } from "./page"
import { PageSelector } from './pageSelector';
import {default as axios} from "axios"

const WAR_THUNDER_API_BASE_URL = "https://wiki.warthunder.com/api.php";
const PAGE_BANK = new Map<string, string[]>();

export const Wiki: Command = {
    name: "wiki",
    description: "搜尋 War Thunder Wiki 上標題以 query 開頭的頁面",
    options: [
        {
            name: "query",
            required: true,
            description: "須包含的詞",
            type: ApplicationCommandOptionType.String,
            autocomplete: true
        },
        {
            name: "limit",
            required: false,
            description: "最大返回的頁面數",
            type: ApplicationCommandOptionType.Integer,
        },
    ],
    run: handleWikiCommand
}

async function handleWikiCommand(client: Client, interaction: ChatInputCommandInteraction) {

    await interaction.deferReply();

    const query = interaction.options.getString("query")!!;
    const limit = interaction.options.getInteger("limit") ?? 3;
    var query_result = await opensearchWiki(query, limit)

    const data = query_result.data;
    if (data[1].length > 0) {
        const pageSelector = new PageSelector(data[1].map((title: string, index: number) => new Page(title, data[3][index])))

        interaction.followUp({
            embeds: await pageSelector.getCurrentPageEmbed(),
            components: pageSelector.getActionRow()
        })

        if (data[1].length == 1) return;

        const reply = await interaction.fetchReply();

        const collector = reply.createMessageComponentCollector({
            filter: collected => collected.customId.startsWith("wiki_") && collected.user.id === interaction.user.id,
            idle: 20000
        })    

        collector?.on("end", async _ => {
            if (interaction.replied) interaction.editReply({ components: [] })
        })

        collector?.on("collect", async buttonInteraction => {
            if (buttonInteraction.customId == "wiki_previous" || buttonInteraction.customId == "wiki_next") {
                if (buttonInteraction.customId == "wiki_previous") { pageSelector.previousPage(); }
                else { pageSelector.nextPage(); }

                await buttonInteraction.update({
                    embeds: await pageSelector.getCurrentPageEmbed(),
                    components: pageSelector.getActionRow()
                })
            } else {
                if (buttonInteraction.customId == "wiki_confirm") { await buttonInteraction.update({ components: [] }) }
                else { await buttonInteraction.message.delete(); }
                collector.stop();
            }
        })

    } else {
        interaction.followUp({
            content: `沒有搜尋到與 ${query} 相關的條目`
        })
    }
}



function opensearchWiki(query: string, limit: number) {
    return axios.get(WAR_THUNDER_API_BASE_URL, {
        params: {
            action: "opensearch",
            search: query,
            limit: limit,
            format: "json",
            utf8: "1",
        }
    })
}

export async function queryAutoComplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();
    try {
        const choices = PAGE_BANK.get(focusedValue.charAt(0))!!;
        const filtered_first_5 = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
        await interaction.respond(
            filtered_first_5.map(choice => ({ name: choice, value: choice })),
        );
    } catch {
        interaction.respond([]);
    }
}

export async function initializePageBank() {
    for (var i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i);
        const titles: string[] = (await opensearchWiki(char, 650)).data[1];
        PAGE_BANK.set(char, titles);
    }
}