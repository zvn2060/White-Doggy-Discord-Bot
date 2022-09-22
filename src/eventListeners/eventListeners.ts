import { Client } from "discord.js";
import { Debug } from "./debug";
import { EventListner } from "./eventListener";
import { InteractionCreate } from "./interactionCreate";
import { MessageCreate } from "./messageCreate";
import { RateLimited } from "./rateLimit";
import { Ready } from "./ready";

const EventListners: EventListner[] = [
    Debug,
    InteractionCreate,
    MessageCreate,
    RateLimited,
    Ready
]


export function addEventListeners(client: Client) {
    for (const listener of EventListners) {
        listener.listen(client);
    }
}