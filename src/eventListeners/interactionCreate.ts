import { BaseInteraction, Client } from "discord.js";
import { Commands } from "../commands/commands";
import { queryAutoComplete } from "../commands/wiki/wiki";
import { EventListner } from "./eventListener";

export const InteractionCreate: EventListner = {
    listen: (client: Client): void => {
        client.on("interactionCreate", async (interaction: BaseInteraction) => {
            if (interaction.isChatInputCommand()) {
                console.log(interaction.commandName)
                const command = Commands.find(c => c.name === interaction.commandName)
                if (!command) return;
                command.run(client, interaction);
            } else if (interaction.isAutocomplete()) {
                if (interaction.commandName === "wiki") queryAutoComplete(interaction);
            }
        })
    }
}