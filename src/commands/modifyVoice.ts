import { Client, ChatInputCommandInteraction, GuildMember, ApplicationCommandOptionType, VoiceBasedChannel } from "discord.js";
import { ALLOWED_CATEGORY } from "../constant";
import { Command } from "./command";

const modifiableChannel = new Map<string, string>();


export const VoiceLock: Command = {
    name: "voice-lock",
    description: "限制命令使用者所在的語音頻道最大人數",
    options: [
        {
            name: "limit",
            required: true,
            description: "想限制的人數",
            type: ApplicationCommandOptionType.Integer,
            min_value: 1,
            max_value: 99
        }
    ],

    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const channel = (interaction.member as GuildMember).voice.channel;
        const limit = interaction.options.getInteger("limit")!!;
        var replyContent = `該命令需要使用者位於一個未限制人數的語音頻道`;
        if (channel) {
            if (channel.parentId && ALLOWED_CATEGORY.includes(channel.parentId)) {
                if (channel.userLimit > 0) {
                    const userId = modifiableChannel.get(channel.id);
                    if (userId) {
                        if (userId == interaction.user.id) {
                            modifiableChannel.set(channel.id, interaction.user.id);
                            channel.edit({ userLimit: limit })
                            replyContent = `<#${channel.id}> 已限制為 ${limit} 人頻道`;
                        } else {
                            replyContent = `<#${channel.id}> 目前由 <@${userId}> 控制`;
                        }
                    } else {
                        replyContent = `<#${channel.id}> 已設有非該指令造成的限制，命令無效`;
                    }
                } else {
                    modifiableChannel.set(channel.id, interaction.user.id);
                    channel.edit({ userLimit: limit })
                    replyContent = `<#${channel.id}> 已限制為 ${limit} 人頻道`;
                }
            } else {
                replyContent = `<#${channel.id}> 並未在戰雷相關類別中`;
            }
        }

        interaction.reply({
            content: replyContent,
            ephemeral: true
        })
    }
}


export const VoiceUnlock: Command = {
    name: "voice-unlock",
    description: "解除由 voice-lock 命令的語音頻道限制",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const channel = (interaction.member as GuildMember).voice.channel;
        var replyContent = `該命令需要使用者位於一個由機器人限制人數的語音頻道`;
        if (channel) {
            const userId = modifiableChannel.get(channel.id);
            if (userId == interaction.user.id) {
                channel.edit({ userLimit: 0 });
                replyContent = `<#${channel.id}> 人數限制已解除`;
                modifiableChannel.delete(channel.id);
            } else {
                replyContent = `<#${channel.id}> 目前由 <@${userId}> 控制`;
            }
        }

        interaction.reply({
            content: replyContent,
            ephemeral: true
        })
    }
}


export function AutoUnlock(channel: VoiceBasedChannel, userId: string) {
    const controllingUserId = modifiableChannel.get(channel.id);
    if (controllingUserId && controllingUserId === userId) {
        channel.edit({ userLimit: 0 });
        modifiableChannel.delete(channel.id);
    }
}