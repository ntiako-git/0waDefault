import { CustomClient } from './core/CustomClient';

// Init client
const client = new CustomClient();

// Launch the bot
client.initialize().then(r => null);
