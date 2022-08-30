import { Client, GatewayIntentBits, Message, REST, Routes } from "discord.js";


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

const rest: REST = new REST({ version: '10' }).setToken(BOT_TOKEN);

const guild_id = "1013282681032814634"
const channel_id = "1013282681032814637"
// When the client is ready, run this code (only once)
client.once('ready', onReady);

client.on("messageCreate", onMessageCreate);

// Login to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);

async function sendMessage(channel_id: string, message: string) {
	try {
		await rest.post(Routes.channelMessages(channel_id), { body: { content: message }, });
	} catch (error) {
		console.error(error);
	}
}

function listMembers(guild_id: string, limit: number) {
	try {
		const query = new URLSearchParams({ limit: `${limit}` })
		return rest.get(Routes.guildMembers(guild_id), { query: query })
	} catch (error) {
		console.error(error);
	}
}

function onMessageCreate(message: Message<boolean>) {

	if (message.author.bot || message.channelId != channel_id)
		return;

	const content = message.content;

	const response = responseMessage(content);

	sendMessage(channel_id, response)
}

function onReady() {

}

function responseMessage(message: string): string {
	const array = ["哈哈~屁眼派對!!~", "屁眼屁眼大屁眼!"]

	switch (message) {
		case "部長好":
			return "同志們好!!";
		case "屁眼":
			return array[Math.floor(Math.random() * array.length)];;
		case "誰是最可愛的小狗狗?":
			return "旺~";
		case "誰是你的マスター？":
			return "HI_OuO 様"
		case "誰是你的master?":
			return "HI_OuO"
		default:
			return "";
	}
}