import {
    SlashCommandBuilder,
    ChatInputCommandInteraction, AutocompleteInteraction, ContextMenuCommandBuilder, UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction, SlashCommandOptionsOnlyBuilder
} from "discord.js";
import { CustomClient } from "../core/CustomClient";

type CommandData =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | ContextMenuCommandBuilder;

type InteractionType =
    | ChatInputCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction;

/**
 * Represents a Discord command handled by the bot.
 *
 * This interface standardizes how commands are defined and executed
 * within the application. It supports:
 *
 * - Slash commands
 * - User context menu commands
 * - Message context menu commands
 * - Autocomplete interactions (optional)
 *
 * Each command must provide command metadata (`data`)
 * and an execution function (`execute`).
 *
 * @template T The interaction type associated with the command
 */
export interface Command<T extends InteractionType = InteractionType> {

    /**
     * Command definition used when registering the command
     * with the Discord API.
     *
     * This can be:
     * - SlashCommandBuilder
     * - SlashCommandOptionsOnlyBuilder
     * - ContextMenuCommandBuilder
     */
    data: CommandData;

    /**
     * Optional autocomplete handler for slash command options.
     *
     * This method is triggered when a user is typing inside
     * an autocomplete-enabled command option.
     *
     * @param client The bot client instance
     * @param interaction The autocomplete interaction
     *
     * @example
     * ```ts
     * autocomplete: async (client, interaction) => {
     *     const focused = interaction.options.getFocused();
     *     const choices = ["apple", "banana", "orange"];
     *
     *     const filtered = choices.filter(c =>
     *         c.startsWith(focused)
     *     );
     *
     *     await interaction.respond(
     *         filtered.map(choice => ({ name: choice, value: choice }))
     *     );
     * }
     * ```
     */
    autocomplete?: (client: CustomClient, interaction: AutocompleteInteraction) => Promise<void>;

    /**
     * Command execution handler.
     *
     * This method is called when a user executes the command.
     * It receives the bot client and the interaction corresponding
     * to the command type.
     *
     * @param client The bot client instance
     * @param interaction The command interaction
     *
     * @example
     * ```ts
     * execute: async (client, interaction) => {
     *     await interaction.reply("Command executed!");
     * }
     * ```
     */
    execute: (client: CustomClient, interaction: T) => Promise<void>;
}
