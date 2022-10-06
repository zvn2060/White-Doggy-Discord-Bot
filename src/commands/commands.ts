import { Command } from "./command";
import { Learn } from "./learn";
import { VoiceLock, VoiceUnlock } from "./modifyVoice";
import { SetNickname } from "./setNickname";
import { SetSchedule } from "./setSchedule";
import { Wiki } from "./wiki/wiki";


export const Commands: Command[] = [
    Wiki,
    Learn,
    VoiceLock,
    VoiceUnlock,
    SetNickname,
    SetSchedule
]