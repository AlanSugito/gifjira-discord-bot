import {Client, GatewayIntentBits} from 'discord.js';
import CommandService from './CommandService';
import configs from './configs';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('Client is online....');
});

client.on('messageCreate', async (message) => {
  const commands = new CommandService(message);

  if (message.author.bot) return;

  const msg = message.content.split(' ');

  if (msg[0] === '!jiraguide') {
    await commands.showGuide();
    return;
  }

  try {
    if (msg[0] === '!jira') {
      await commands.generateText(msg);
      return;
    }

    if (msg[0] === '!jiraimg') {
      const attachment = message.attachments.first()!;
      await commands.imageIdentification(msg, attachment);
      return;
    }

    if (msg[0] === '!gif') {
      await commands.sendGif(msg);
      return;
    }
  } catch (error) {
    (await message.reply('Something went wrong...')).react('😔');
  }
});

client.on('interactionCreate', async (interaction) => {
  console.log(interaction);
});

client.login(configs.DISCORD_TOKEN);
