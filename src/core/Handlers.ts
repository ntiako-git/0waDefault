import fs from 'fs';
import path from 'path';
import { CustomClient } from './CustomClient';
import { Command } from '../types/Command';
import { Event } from '../types/Event';
import { ClientEvents } from "discord.js";
import { Logger } from "./Logger";

export class Handler {
    private readonly baseDir: string;

    constructor(private client: CustomClient) {
        this.baseDir = process.env.NODE_ENV === 'dev' ? 'src' : 'dist';
    }

    private async getFiles(dir: string): Promise<string[]> {
        let files: string[] = [];
        if (!fs.existsSync(dir)) return [];

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files = files.concat(await this.getFiles(fullPath));
            } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
                files.push(fullPath);
            }
        }

        return files;
    }

    public async loadCommands() {
        const commandsDir = path.resolve(this.baseDir, 'commands');
        let commandFiles = await this.getFiles(commandsDir);

        if (process.env.NODE_ENV === 'prod')
            commandFiles = commandFiles.filter(f => f.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const module = await import(file);
                const command = module.default as Command;

                // Vérification de sécurité
                if (!command.data || !command.execute) {
                    Logger.warn("Handler", `The command in ${file} is incomplete.`);
                    continue;
                }

                this.client.commands.set(command.data.name, command);
                Logger.info("Handler", `Command loaded: ${command.data.name}`);
            } catch (err) {
                Logger.error("Handler", `Error loading command ${file}`);
                Logger.error("Handler", `${err}`, true);
            }
        }
    }

    public async loadEvents() {
        const eventsDir = path.resolve(this.baseDir, 'events');
        let eventFiles = await this.getFiles(eventsDir);

        if (process.env.NODE_ENV === 'production')
            eventFiles = eventFiles.filter(f => f.endsWith('.js'));

        for (const file of eventFiles) {
            try {
                const module = await import(file);
                const event = module.default as Event<keyof ClientEvents>;

                if (!event.name || !event.execute) {
                    Logger.warn("Handler", `The event in ${file} is incomplete.`);
                    continue;
                }

                if (event.once) {
                    this.client.once(event.name, (...args) => event.execute(this.client, ...args));
                } else {
                    this.client.on(event.name, (...args) => event.execute(this.client, ...args));
                }

                Logger.info("Handler", `Event loaded: ${event.name}`);
            } catch (err) {
                Logger.error("Handler", `Error loading event ${file}`);
                Logger.error("Handler", `${err}`, true);
            }
        }
    }
}
