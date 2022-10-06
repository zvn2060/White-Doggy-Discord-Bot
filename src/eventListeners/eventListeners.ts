import { Client } from "discord.js";
import { Debug } from "./debug";
import { EventListner } from "./eventListener";
import { InteractionCreate } from "./interactionCreate";
import { MessageCreate } from "./messageCreate";
import { RateLimited } from "./rateLimit";
import { Ready } from "./ready";
import { ThreadCreate } from "./threadCreate";
import { ThreadMembersUpdate } from "./threadMembersUpdate";
import { VoiceStateUpdate } from "./voiceStateUpdate";

const EventListners: EventListner[] = [
    Debug,
    InteractionCreate,
    MessageCreate,
    RateLimited,
    Ready,
    VoiceStateUpdate,
    ThreadCreate,
    ThreadMembersUpdate
]


export function addEventListeners(client: Client) {
    for (const listener of EventListners) {
        listener.listen(client);
    }
}