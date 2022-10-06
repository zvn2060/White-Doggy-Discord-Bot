import { BaseInteraction, ChatInputCommandInteraction, Client, GuildTextBasedChannel } from "discord.js";
import { Commands } from "../commands/commands";
import { queryAutoComplete } from "../commands/wiki/wiki";
import { EventListner } from "./eventListener";


export const InteractionCreate: EventListner = {
    listen: (client: Client): void => {
        client.on("interactionCreate", async (interaction: BaseInteraction) => {
            if (interaction.isChatInputCommand()) {

                const command = Commands.find(c => c.name === interaction.commandName)
                if (!command) {
                    errorReply(interaction, "該命令已不存在")
                    return;
                };
                command.run(client, interaction);

            } else if (interaction.isAutocomplete()) {
                if (interaction.commandName === "wiki") queryAutoComplete(interaction);
            }
        })
    }
}

function errorReply(interaction: ChatInputCommandInteraction, content: string) {
    interaction.reply({
        content: content,
        ephemeral: true
    })
}