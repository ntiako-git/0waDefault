import { Events } from 'discord.js';
import { Event } from '../types/Event';
import { Logger } from '../core/Logger';

const event: Event<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    execute: async (client, interaction) => {

        // Handle Autocomplete
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command?.autocomplete) return;

            try {
                await command.autocomplete(client, interaction);
            } catch (err) {
                Logger.error("Autocomplete", `Autocomplete failed for /${interaction.commandName}`);
                Logger.error("Autocomplete", `${err}`, true);
            }
            return;
        }

        // Handle command interactions
        if (interaction.isChatInputCommand() ||
            interaction.isUserContextMenuCommand() ||
            interaction.isMessageContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(client, interaction);
                Logger.info("Command", `/${interaction.commandName} executed`);
                Logger.info("Info", `by ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild ? interaction.guild : 'unknown'}`);
            } catch (err) {
                Logger.error("Interaction", `Error on /${interaction.commandName}`);
                Logger.error("Interaction", `${err}`, true);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "An error occurred while executing this command.", flags: 64 });
                } else {
                    await interaction.reply({ content: "An error occurred while executing this command.", flags: 64 });
                }
            }
        }
    }
};

export default event;
