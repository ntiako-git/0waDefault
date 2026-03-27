import { Events, REST, Routes } from "discord.js";
import { Event } from '../types/Event';
import { Logger } from '../core/Logger';

const event: Event<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        if (!client.user) return;

        Logger.success("System", `App ready: ${client.user.tag}`);
        client.user.setActivity("0waBot v2");

        const commandsData = client.commands.map(c => c.data.toJSON());
        const rest = new REST({ version: '10'}).setToken(process.env.TOKEN!);

        try {
            Logger.info("REST", `Deploying ${commandsData.length} commands...`);

            const route = process.env.NODE_ENV === 'dev'
                ? Routes.applicationGuildCommands(client.user.id, client.config.guildId)
                : Routes.applicationCommands(client.user.id);

            await rest.put(route, { body: commandsData });
            Logger.success("REST", "Saved commands");

            const registeredCommands = await (process.env.NODE_ENV === 'dev'
                ? client.guilds.cache.get(client.config.guildId)?.commands.fetch()
                : client.application?.commands.fetch());

            registeredCommands?.forEach(cmd => client.commandIds.set(cmd.name, cmd.id));
        } catch (err) {
            Logger.error("Ready", "Error during deployment");
            Logger.error("Ready", `${err}`);
        }

        console.log('\n\n')
        console.log('  /$$$$$$  /$$      /$$  /$$$$$$  /$$$$$$$   /$$$$$$  /$$$$$$$$\n' +
            ' /$$$_  $$| $$  /$ | $$ /$$__  $$| $$__  $$ /$$__  $$|__  $$__/\n' +
            '| $$$$\\ $$| $$ /$$$| $$| $$  \\ $$| $$  \\ $$| $$  \\ $$   | $$   \n' +
            '| $$ $$ $$| $$/$$ $$ $$| $$$$$$$$| $$$$$$$ | $$  | $$   | $$   \n' +
            '| $$\\ $$$$| $$$$_  $$$$| $$__  $$| $$__  $$| $$  | $$   | $$   \n' +
            '| $$ \\ $$$| $$$/ \\  $$$| $$  | $$| $$  \\ $$| $$  | $$   | $$   \n' +
            '|  $$$$$$/| $$/   \\  $$| $$  | $$| $$$$$$$/|  $$$$$$/   | $$   \n' +
            ' \\______/ |__/     \\__/|__/  |__/|_______/  \\______/    |__/   \n' +
            '                                                               \n' +
            '                                                               \n' +
            '                                                               ')
    }
};

export default event;
