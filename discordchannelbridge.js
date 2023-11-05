const { Client } = require('discord.js-selfbot-v13');
const { Client: BotClient, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const guildsChannelsMappings = [
    {
        sourceGuildId: 'source_server_id_here',
        sourceChannelId: 'source_channel_id_here',
        targetGuildId: 'target_server_id_here',
        targetChannelId: 'target_channel_id_here'
    }, 

    // add multiple if needed
];

const roleWhitelist = ['role_id_1','role_id_2','role_id_3']; // which role ids should be shown

const selfbot = new Client({ checkUpdate: false });
const botClient = new BotClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

selfbot.on('ready', () => {
    console.log(`Selfbot logged in as ${selfbot.user.tag}!`);
});

selfbot.on('messageCreate', async message => {
    const config = guildsChannelsMappings.find(c => c.sourceGuildId === message.guild.id && c.sourceChannelId === message.channel.id);
    if (config) {
        const displayName = message.member ? message.member.displayName : message.author.username;
        const avatarURL = message.author.displayAvatarURL();

        const embed = new EmbedBuilder()
            .setAuthor({ name: `(${displayName}) [${message.author.tag}]`, iconURL: avatarURL })
            .setFooter({ text: `Server: ${message.guild.name} | Channel: ${message.channel.name}` });

        const roles = message.member.roles.cache
            .filter(role => roleWhitelist.includes(role.id))
            .map(role => `\`${role.name}\``)
            .join(' | ');

        embed.addFields({ name: '*Roles*', value: roles.length > 0 ? roles : '*No Roles*' });

        if (message.content) {
            embed.setDescription(`> **${message.content}**`);
        }
        

        const attachments = message.attachments.filter(attachment => attachment.contentType && attachment.contentType.startsWith('image/'));
        if (attachments.size > 0) {
            embed.setImage(attachments.first().url);
        } else {
            const imageUrls = message.content.match(/\bhttps?:\/\/\S+(?:png|jpg|jpeg|gif)\b/gi);
            if (imageUrls && imageUrls.length > 0) {
                embed.setImage(imageUrls[0]);
            }
        }
        const targetGuild = botClient.guilds.cache.get(config.targetGuildId);
        if (targetGuild) {
            const targetChannel = targetGuild.channels.cache.get(config.targetChannelId);
            if (targetChannel) {
                await targetChannel.send({ embeds: [embed] });
            }
        }
    }
});

botClient.on('ready', () => {
    console.log(`Bot logged in as ${botClient.user.tag}!`);
});

selfbot.login('SELFBOT_TOKEN_HERE');
botClient.login('BOT_TOKEN_HERE');
