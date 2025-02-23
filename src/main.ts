import 'dotenv/config';
import { Client } from 'discord.js-selfbot-v13';
import { db } from './db';
import { channels, guilds, messages } from './db/schema';
import { users } from './db/schema/users.schema';
import { eq, InferSelectModel } from 'drizzle-orm';
import { logger } from './logger';

const client = new Client();

client.on('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}`, {});
});

client.on('messageCreate', async (message) => {
  if (!message.content) return;

  const [user] = await db.insert(users).values({
    userId: message.author.id,
    name: message.author.username,
    isBot: message.author.bot,
  }).onConflictDoUpdate({
    target: [users.userId],
    set: {
      name: message.author.username,
    },
  }).returning();

  let guild: InferSelectModel<typeof guilds> | null = null;
  if (message.guild) {
    [guild] = await db.insert(guilds).values({
      guildId: message.guild.id,
      name: message.guild.name,
    }).onConflictDoUpdate({
      target: [guilds.guildId],
      set: {
        name: message.guild.name,
      },
    }).returning();
  }

  const [channel] = await db.insert(channels).values({
    channelId: message.channel.id,
    guildId: guild?.id,
    name: 'name' in message.channel ? message.channel.name : '',
    type: message.channel.type,
  }).onConflictDoUpdate({
    target: [channels.channelId],
    set: {
      name: 'name' in message.channel ? message.channel.name : '',
      type: message.channel.type,
    },
  }).returning();

  await db.insert(messages).values({
    content: message.content,
    messageId: message.id,
    authorId: user.id,
    channelId: channel.id,
    isBot: message.author.bot,
  });
});

client.on('messageDelete', async (message) => {
  await db.update(messages).set({
    isDeleted: true,
  }).where(eq(messages.messageId, message.id));
});

client.login(process.env.DISCORD_TOKEN);
