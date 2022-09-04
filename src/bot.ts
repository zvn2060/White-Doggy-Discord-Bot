import express, { Express, Request, Response } from "express"
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { exit } from 'node:process';
import ready from './events/ready';
import interactionCreate from './events/interactionCreate';
import messageCreate from './events/messageCreate';



var client: Client;
var rest: REST;
const app: Express = express();
const port = 5000;

main();

function main() {
	const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

	if (!BOT_TOKEN) {
		console.error("Discord Bot Token Missing");
		exit(-1);
	}

	console.log("Bot is starting");

	client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
	rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

	ready(client);
	interactionCreate(client);
	messageCreate(client);

	client.login(BOT_TOKEN);
}




function listMembers(guild_id: string, limit: number) {
	try {
		const query = new URLSearchParams({ limit: `${limit}` })
		return rest.get(Routes.guildMembers(guild_id), { query: query })
	} catch (error) {
		console.error(error);
	}
}




