import {EmbedBuilder} from "discord.js"

export class Page {
    title: string;
    url: string;
    embed: EmbedBuilder | null = null;
    constructor(title: string, url: string) {
        this.title = title;
        this.url = url;
    }
}