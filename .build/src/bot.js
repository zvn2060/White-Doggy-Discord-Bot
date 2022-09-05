var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_express = __toModule(require("express"));
var import_discord = __toModule(require("discord.js"));
var import_node_process = __toModule(require("node:process"));
var import_ready = __toModule(require("./events/ready"));
var import_interactionCreate = __toModule(require("./events/interactionCreate"));
var import_messageCreate = __toModule(require("./events/messageCreate"));
var client;
var rest;
const app = (0, import_express.default)();
const port = 5e3;
main();
function main() {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.error("Discord Bot Token Missing");
    (0, import_node_process.exit)(-1);
  }
  console.log("Bot is starting");
  client = new import_discord.Client({ intents: [import_discord.GatewayIntentBits.Guilds, import_discord.GatewayIntentBits.GuildMessages, import_discord.GatewayIntentBits.MessageContent] });
  rest = new import_discord.REST({ version: "10" }).setToken(BOT_TOKEN);
  (0, import_ready.default)(client);
  (0, import_interactionCreate.default)(client);
  (0, import_messageCreate.default)(client);
  client.login(BOT_TOKEN);
}
function listMembers(guild_id, limit) {
  try {
    const query = new URLSearchParams({ limit: `${limit}` });
    return rest.get(import_discord.Routes.guildMembers(guild_id), { query });
  } catch (error) {
    console.error(error);
  }
}
//# sourceMappingURL=bot.js.map
