import { Client, ChatInputCommandInteraction, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ModalActionRowComponentBuilder, ModalSubmitInteraction, GuildMember } from "discord.js";
import { ROLE_ID } from "../constant";
import { Command } from "./command";

const titleTextInput = new TextInputBuilder()
    .setCustomId("title_text")
    .setLabel("頭銜")
    .setValue('隊員')
    .setPlaceholder("例：隊員、中士、裝甲兵")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const callsignTextInput = new TextInputBuilder()
    .setCustomId("callsign_text")
    .setLabel("呼號　默認為 ID")
    .setPlaceholder("其他人怎麼稱呼你")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

const idTextInput = new TextInputBuilder()
    .setCustomId("id_text")
    .setLabel("遊戲內 ID")
    .setPlaceholder("大小寫請符合")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

const rows = [titleTextInput, callsignTextInput, idTextInput]
    .map(component => new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(component))

export const SetNickname: Command = {
    name: "set-nickname",
    description: "設置符合格式的暱稱",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {

        const member = interaction.member as GuildMember;

        if (!member) {
            interaction.reply({ ephemeral: true, content: "此命令僅能於伺服器中使用" })
            return;
        }

        const roles = member.roles.cache;
        const squad = roles.has(ROLE_ID.TNOGM_MEMBER) ? "TNOGM" : "TNO8";

        const modal = new ModalBuilder()
            .setCustomId(`set_nickname_modal`)
            .setTitle(`${squad} 暱稱設置表單`)
            .setComponents(rows);


        await interaction.showModal(modal);
        const filter = (interaction: ModalSubmitInteraction) => interaction.customId === `set_nickname_modal`;

        interaction.awaitModalSubmit({ filter, time: 60000 }).then(handleModalSubmittion).catch(console.error)
    }
}

async function handleModalSubmittion(interaction: ModalSubmitInteraction) {
    await interaction.deferReply({ephemeral:true});
    const member = interaction.member as GuildMember;
    const fields = interaction.fields;
    const squad = member.roles.cache.has(ROLE_ID.TNOGM_MEMBER) ? "TG" : "T8"
    const title = fields.getTextInputValue("title_text").trim();
    var callsign = fields.getTextInputValue("callsign_text").trim();
    const id = fields.getTextInputValue("id_text").trim();
    if (!callsign) callsign = id;

    const nickname = `【${squad}${title}】${callsign}丨${id}`;
    var reply_content = `您的暱稱已更改為 **${nickname}**`;
    try {
        await member.setNickname(nickname)
    } catch {
        reply_content = "機器人權限不足";
    }


    interaction.followUp({
        ephemeral:true,
        content: reply_content
    })
}