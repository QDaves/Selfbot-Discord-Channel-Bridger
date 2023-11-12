const fs = require('fs');
const { Client } = require('discord.js-selfbot-v13');
const { Client: BotClient, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const guildsChannelsMappings = [
  
    {
        sourceGuildId: '',
        sourceChannelId: '',
        targetGuildId: '',
        targetChannelId: ''
    },
    
// add multiple if needed
                
];
const sentMessagesPath = './sentMessages.txt';
const sentMessages = new Set();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const log = (message) => {
    console.log(`${new Date().toISOString()} - ${message}`);
};
const loadSentMessages = () => {
    if (fs.existsSync(sentMessagesPath)) {
        const fileContent = fs.readFileSync(sentMessagesPath, 'utf-8');
        fileContent.split('\n').forEach(id => {
            if (id) sentMessages.add(id);
        });
    }
};
const saveMessageId = (messageId) => {
    fs.appendFileSync(sentMessagesPath, `${messageId}\n`, 'utf-8');
    sentMessages.add(messageId);
};
const selfbot = new Client({ checkUpdate: false });
const botClient = new BotClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
botClient.login('Bot_token_here');
selfbot.login('Selfbot_token_here');
selfbot.on('error', (error) => {
    log(`Error from selfbot client: ${error}`);
});

let messageCheckInterval;

selfbot.on('ready', () => {
    log(`Selfbot client logged in as ${selfbot.user.tag}!`);
    loadSentMessages();
    checkForNewMessages();
});

botClient.on('ready', () => {
    log(`Bot client logged in as ${botClient.user.tag}!`);
});

const logError = (error) => {

  if (error instanceof Error) {
      log(`Error message: ${error.message}`);
      if ('code' in error) log(`Error code: ${error.code}`);
      if ('httpStatus' in error) log(`HTTP status: ${error.httpStatus}`);
      if ('requestData' in error) log(`Request data: ${JSON.stringify(error.requestData, null, 2)}`);
  } else {
      log(`Unknown error type: ${JSON.stringify(error, null, 2)}`);
  }
};

let isCheckingMessages = false;

const checkForNewMessages = async () => {
    if (isCheckingMessages) {
        return;
    }

    isCheckingMessages = true;
    await sleep(3000);

    for (const [index, config] of guildsChannelsMappings.entries()) {

        try {
            const sourceGuild = await selfbot.guilds.fetch(config.sourceGuildId);
            const sourceChannel = await sourceGuild.channels.fetch(config.sourceChannelId);
            const messages = await sourceChannel.messages.fetch({ limit: 20 });

            const newMessages = messages.filter(message => !sentMessages.has(message.id) && !message.author.bot);
            for (const [messageId, message] of newMessages) {
                const displayName = message.member ? message.member.displayName : message.author.username;
                
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${displayName} [${message.author.tag}]`, iconURL: message.author.displayAvatarURL() })
                    .setDescription(message.content)
                    .setTimestamp(message.createdTimestamp);

                if (message.attachments.size > 0) {
                    const imageAttachment = message.attachments.find(attachment => attachment.contentType?.startsWith('image/'));
                    if (imageAttachment) {
                        embed.setImage(imageAttachment.proxyURL);
                    }
                }

                const targetGuild = botClient.guilds.cache.get(config.targetGuildId);
                const targetChannel = targetGuild.channels.cache.get(config.targetChannelId);
                await targetChannel.send({ embeds: [embed] });
                saveMessageId(messageId);
                await sleep(3000);
            }
        } catch (error) {
            logError(error);
        }
        await sleep(30000);
    }
    isCheckingMessages = false;
    setTimeout(checkForNewMessages, 600000);
};
