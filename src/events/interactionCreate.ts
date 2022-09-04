import { Client, Interaction } from "discord.js";
import { cp } from "fs";
import { Commands } from "../commands/commands";
import { commands } from "../utility/commandHandler";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = Commands.find(c => c.name === interaction.commandName)

        if (!command) return;

        await interaction.deferReply();

        command.run(client, interaction);
    })
}