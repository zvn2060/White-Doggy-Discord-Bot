const axios = require('axios').default;
const Database = require("@replit/database")
const db = new Database()
import { ForumChannel } from "discord.js";
import * as cheerio from "cheerio"

export async function init() {
    await db.set("latest_news_date", new Date(2022, 8, 19));
}

export async function pushNews(forumChannel: ForumChannel) {
    const newsArray = await scrapeNewsPage();
    const latest_news_date = new Date(await db.get("latest_news_date"));

    const unpushedNewsArray = newsArray.filter(news => news.pubDate > latest_news_date);

    if (unpushedNewsArray.length == 0)
        return;

    const tag = forumChannel.availableTags.find(forumTag => forumTag.name === "情報");

    for (const news of unpushedNewsArray) {
        forumChannel.threads.create({
            name: news.title,
            message: {
                files: [{
                    name: news.image.substring(news.image.indexOf('/') + 1),
                    attachment: news.image
                }],
                content: `:link: <${news.link}>\n\n${news.description}\n `
            },
            appliedTags: tag ? [tag.id] : []
        })
    }

    await db.set("latest_news_date", unpushedNewsArray.slice(-1)[0].pubDate.toString());
}



async function scrapeNewsPage() {
    const response = await axios.get("https://warthunder.com/en/news/");
    const $ = cheerio.load(response.data);
    const newsArray: News[] = $('div.showcase__item.widget').slice(0, 5).map((_, ele) => {
        const item = $(ele);
        const href = item.find('a.widget__link').attr('href') ?? "";
        return new News(
            parseDate(item.find('div.widget__content > ul > .widget-meta__item--right').text().trim()),
            item.find('div.widget__content > div.widget__title').text().trim(),
            item.find('div.widget__content > div.widget__comment').text().trim(),
            encodeURI(`https:${item.find('div.widget__poster > img.widget__poster-media').attr('data-src')}`),
            encodeURI(`https://warthunder.com${href}`)
        )
    }).get()

    newsArray.sort((news_a, news_b) => news_a.pubDate.getTime() - news_b.pubDate.getTime())

    return newsArray;
}


function parseDate(dateString: string) {
    const dateParts = dateString.split(" ");
    return new Date(parseInt(dateParts[2]), literalMonthToIndex(dateParts[1]), parseInt(dateParts[0]))
}

const MONTHS = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
];

function literalMonthToIndex(monthString: string) {
    return MONTHS.findIndex(value => value == monthString);
}

class News {
    pubDate: Date;
    title: string;
    description: string;
    image: string;
    link: string;

    constructor(pubDate: Date, title: string, description: string, image: string, link: string) {
        this.title = title;
        this.description = description;
        this.pubDate = pubDate;
        this.link = link;
        this.image = image;
    }
}