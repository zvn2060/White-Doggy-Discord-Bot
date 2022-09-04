import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { fetchAnswers } from '../utility/conversation';
import { Command } from './command';

export const Learn: Command = {
    name: "learn",
    description: "從學習單學習新回應",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        fetchAnswers().then(() => interaction.followUp({
            ephemeral: true,
            content: "已學習新內容"
        }));
    }
}
