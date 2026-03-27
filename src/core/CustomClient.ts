import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { Command } from "../types/Command";
import { Handler } from "./Handlers";
import configFile from '../config/config.json';
import { Logger } from "./Logger";
import prisma from "../services/PrismaService";

export class CustomClient extends Client {
    public commands = new Collection<string, Command>();
    public commandIds = new Map<string, string>();
    public config = configFile;
    private handler: Handler;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction]
        });

        this.handler = new Handler(this);
    }

    public async initialize(): Promise<void> {
        try {
            await prisma.$connect();
            Logger.success("Database", "Connected to PostgreSQL");

            Logger.info("System", "Loading commands...");
            await this.handler.loadCommands();

            Logger.info("System", "Loading events...");
            await this.handler.loadEvents();

            await this.login(process.env.TOKEN);
            Logger.success("Discord", `Logged in as ${this.user?.tag}`);

        } catch (err) {
            Logger.error("System", "Failed to start");
            Logger.error("System", `${err}`);
            process.exit(1);
        }
    }

    public getCommandMention(name: string, subCommand?: string): string {
        const id = this.commandIds.get(name);

        if (!id) return `\`/${name}${subCommand ? ' ' + subCommand : ''}\``;

        if (subCommand) return `</${name} ${subCommand}:${id}>`;

        return `</${name}:${id}>`;
    }
}
