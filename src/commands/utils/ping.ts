import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlagsBitField } from "discord.js";
import { Command } from "../../types/Command";
import { CustomClient } from "../../core/CustomClient";

const pingCommand: Command<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responds with app latency')
        .setDescriptionLocalizations({
            'fr': 'Répond avec la latence du app',
            'en-US': 'Responds with app latency'
        }),

    execute: async (client: CustomClient, interaction: ChatInputCommandInteraction) => {
        await interaction.reply({
            content: `\uD83C\uDFD3 Pong! My latency is **${client.ws.ping}ms**.`,
            flags: MessageFlagsBitField.Flags.Ephemeral
        });
    }
};

export default pingCommand;
