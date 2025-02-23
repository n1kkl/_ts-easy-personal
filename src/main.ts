import 'dotenv/config';
import { Client, Message } from 'discord.js-selfbot-v13';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import FastifySSEPlugin from 'fastify-sse-v2';
import EventEmitter from 'eventemitter3';
import Redis from 'ioredis';
import { db } from './db';
import { messages } from './db/schema';

const fastify = Fastify({
  logger: true,
});

const client = new Client();
const events = new EventEmitter();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content) return;

  events.emit('message', message);
  await db.insert(messages).values({
    content: message.content,
    authorId: message.author.id,
    authorName: message.author.username,
    guildId: message.guild?.id,
    guildName: message.guild?.name,
    channelId: message.channel.id,
    channelName: 'name' in message.channel ? message.channel.name : '',
  })
});

client.login(process.env.DISCORD_TOKEN);

fastify.register(cors, {
  // put your options here
});
fastify.register(FastifySSEPlugin);
