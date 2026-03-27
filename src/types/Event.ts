import { ClientEvents } from 'discord.js';
import { CustomClient } from '../core/CustomClient';

/**
 * Represents a Discord event handled by the bot.
 *
 * This interface standardizes how events are declared and
 * registered in the client event handler system.
 *
 * Each event must define:
 * - The event name
 * - Whether it should run once or multiple times
 * - The execution handler
 *
 * The event arguments are automatically inferred from
 * Discord.js `ClientEvents` types using generics.
 *
 * @template K The Discord event name (key of ClientEvents)
 */
export interface Event<K extends keyof ClientEvents> {

    /**
     * Name of the Discord event.
     *
     * Must be a valid key from Discord.js ClientEvents.
     */
    name: K;

    /**
     * Determines if the event should be executed only once.
     *
     * - true  -> client.once()
     * - false -> client.on()
     *
     * Useful for events like "ready".
     *
     * @default false
     */
    once?: boolean;

    /**
     * Event execution handler.
     *
     * This function is called when the event is triggered.
     * The arguments are automatically typed based on the
     * event name using Discord.js ClientEvents mapping.
     *
     * @param client The bot client instance
     * @param args Event-specific arguments from Discord.js
     *
     * @example
     * ```ts
     * execute: (client, interaction) => {
     *     if (!interaction.isChatInputCommand()) return;
     *     console.log(interaction.commandName);
     * }
     * ```
     */
    execute: (client: CustomClient, ...args: ClientEvents[K]) => Promise<void> | void;
}
