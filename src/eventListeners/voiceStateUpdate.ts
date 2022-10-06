import { Client, VoiceState } from "discord.js";
import { AutoUnlock } from "../commands/modifyVoice";
import { EventListner } from "./eventListener";

export const VoiceStateUpdate: EventListner = {
    listen: (client: Client): void => { client.on("voiceStateUpdate", onVoiceStateUpdate) }
}

function onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    if (oldChannel) {
        if (!newChannel || oldChannel?.id != newChannel?.id)
            AutoUnlock(oldChannel, oldState.id);
    }
}
