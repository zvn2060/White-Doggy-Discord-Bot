import { Client, ChatInputCommandInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction } from "discord.js";
import { Section } from "../utility/squadBattleNotify";
import { Command } from "./command";
const Database = require("@replit/database")

const scheduleTextInput = new TextInputBuilder()
    .setCustomId("schedule_text")
    .setLabel("聯隊戰行程")
    .setPlaceholder("請至戰雷論壇複製最新的聯隊戰行程")
    .setStyle(TextInputStyle.Paragraph);

const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(scheduleTextInput);

const db = new Database();

export const SetSchedule: Command = {
    name: "set-schedule",
    description: "輸入行程，發布行程表",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const modal = new ModalBuilder()
            .setCustomId(`set_schedule_modal`)
            .setTitle(`聯隊戰行程設置表單`)
            .setComponents(row);

        await interaction.showModal(modal);
        const filter = (interaction: ModalSubmitInteraction) => interaction.customId === `set_schedule_modal`;

        interaction.awaitModalSubmit({ filter, time: 60000 }).then(handleModalSubmittion).catch(console.error)
    }
}

async function handleModalSubmittion(interaction: ModalSubmitInteraction) {
    await interaction.deferReply();
    const raw_schedule = interaction.fields.getTextInputValue("schedule_text");
    const year = new Date().getFullYear();
    const sections = raw_schedule.split(/\r?\n/).map(line => {
        const match = line.match(/.*BR\s*(\d*.\d)\s\((\d*)\.(\d*).*?(\d*)\.(\d*)\)/);
        if (match) {
            const result = match.slice(1).map(str => parseFloat(str));
            return new Section(
                new Date(year, result[2] - 1, result[1]),
                new Date(year, result[4] - 1, result[3]),
                result[0]
            )
        }
        return new Section(new Date(year, 0, 1), new Date(year, 0, 1), 1.0)
    })

    const start_month = sections[0].start.getMonth() + 1;
    var schedule_message = `**${start_month} ~ ${start_month + 1} 月**聯合等待戰鬥行程表`

    schedule_message += "\n"

    schedule_message += [
        "```",
        "╔════════╤═══════╤════════╗",
        "║  Start │  End  │ Max BR ║",
        "╠════════╪═══════╪════════╣",
    ].join("\n")

    schedule_message += "\n"

    schedule_message += sections.map(section => {
        const start = section.start;
        const end = section.end;
        const start_string = `${numberPadding(start.getMonth() + 1, 2, " ")}/${numberPadding(start.getDate(), 2, "0")}`;
        const end_string = `${numberPadding(end.getMonth() + 1, 2, " ")}/${numberPadding(end.getDate(), 2, "0")}`;
        const battle_rating_string = numberPadding(section.battleRating, 4, " ");
        return `║ ${start_string}  │ ${end_string} │  ${battle_rating_string}  ║\n`
    }).join("╟────────┼───────┼────────╢\n");

    schedule_message += "╚════════╧═══════╧════════╝\n";
    schedule_message += "```";

    await db.set("section count", sections.length);

    sections.forEach((section, index) => {
        db.set(`week ${index + 1}`, JSON.stringify(section));
    })

    interaction.followUp({
        content: schedule_message
    })

}

function numberPadding(value: number, maxLength: number, fillString: string) {
    return value.toString().padStart(maxLength, fillString);
}
