import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { generateEmbed } from "./embedGenerator";
import { Page } from "./page";

export class PageSelector {
    pages: Page[];
    current_index = 0;
    action_row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('wiki_previous')
            .setLabel('上一個')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
        new ButtonBuilder()
            .setCustomId('wiki_next')
            .setLabel('下一個')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('wiki_confirm')
            .setLabel('確認')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('wiki_quit')
            .setLabel('放棄')
            .setStyle(ButtonStyle.Danger)
    );
    buttons = {
        previous: new ButtonBuilder,
        next: new ButtonBuilder,
        confirm: new ButtonBuilder,
        quit: new ButtonBuilder
    };

    constructor(pages: Page[]) {
        this.pages = pages;
        this.buttons.previous = this.action_row.components[0];
        this.buttons.next = this.action_row.components[1];
        this.buttons.confirm = this.action_row.components[2];
        this.buttons.quit = this.action_row.components[3];
        this.buttons.next.setDisabled(pages.length <= 1);
    };

    nextPage() {
        this.current_index++;
        this.checkDisableStatus();
    };

    previousPage() {
        this.current_index--;
        this.checkDisableStatus();
    };

    checkDisableStatus() {
        this.buttons.previous.setDisabled(this.current_index == 0);
        this.buttons.next.setDisabled(this.current_index == this.pages.length - 1);
    }

    async getCurrentPageEmbed() {
        if (!this.pages[this.current_index].embed)
            this.pages[this.current_index].embed = await generateEmbed(this.pages[this.current_index], this.current_index, this.pages.length);

        return [this.pages[this.current_index].embed!!];
    };

    getActionRow() {
        return (this.pages.length == 1) ? [] : [this.action_row];
    };
}