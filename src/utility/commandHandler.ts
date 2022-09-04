import fs from 'node:fs';
import path from 'node:path';
import { Collection, REST, Routes } from 'discord.js';

export const commands = new Collection();

export function readCommandFiles(rest: REST) {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
    console.log(filePath);

        const command = require(filePath).command;
        commands.set(command.data.name, command);
    }

}



