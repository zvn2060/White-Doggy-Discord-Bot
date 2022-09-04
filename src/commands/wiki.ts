import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { Command } from './command';

const axios = require('axios').default;


export const Wiki: Command = {
	name: "wiki",
	description: "搜尋 War Thunder Wiki 上標題包含 query 頁面",
	// data: new SlashCommandBuilder().setName('wiki')
	// 	.setDescription('')
	// 	.addStringOption(
	// 		option => option.setName("query")
	// 			.setRequired(true)
	// 			.setDescription("須包含的詞")
	// 	)
	// 	.addIntegerOption(
	// 		option => option.setName("limit")
	// 			.setDescription("最大返回的頁面數")
	// 	),

	run: async (client: Client, interaction: ChatInputCommandInteraction) => {
		const query = interaction.options.getString("query")!!;
		const limit = interaction.options.getInteger("limit") ?? 3;
		const query_result = await axios.get("https://wiki.warthunder.com/api.php", {
			params: {
				action: "query",
				prop: "info",
				generator: "search",
				format: "json",
				utf8: "1",
				inprop: "url",
				gsrsearch: query,
				gsrlimit: limit
			}
		})


		const pages: Page[] = Object.values(query_result.data.query.pages)
		const urls = pages.sort(Page.compare).map(page => page.fullurl)
		interaction.reply(urls[0]);
	}

}



class Page {
	pageid: number;
	ns: number;
	title: string;
	index: number;
	contentmodel: string;
	pagelanguage: string;
	pagelanguagehtmlcode: string;
	pagelanguagedir: string;
	touched: string;
	lastrevid: number;
	length: number;
	fullurl: string;
	editurl: string;
	canonicalurl: string;

	constructor(pageid: number, ns: number, title: string, index: number, contentmodel: string,
		pagelanguage: string, pagelanguagehtmlcode: string, pagelanguagedir: string, touched: string, lastrevid: number,
		length: number, fullurl: string, editurl: string, canonicalurl: string) {
		this.pageid = pageid;
		this.ns = ns;
		this.title = title;
		this.index = index;
		this.contentmodel = contentmodel;
		this.pagelanguage = pagelanguage;
		this.pagelanguagehtmlcode = pagelanguagehtmlcode;
		this.pagelanguagedir = pagelanguagedir;
		this.touched = touched;
		this.lastrevid = lastrevid;
		this.length = length;
		this.fullurl = fullurl;
		this.editurl = editurl;
		this.canonicalurl = canonicalurl;
	}

	static compare(a: Page, b: Page) {
		return a.index - b.index;
	}
}