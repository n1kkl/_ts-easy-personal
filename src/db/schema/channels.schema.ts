import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { messages } from './messages.schema';
import { guilds } from './guilds.schema';

export const channels = pgTable('channels', {
  id: text().primaryKey().$defaultFn(createId),
  channelId: text().notNull(),
  guildId: text().references(() => guilds.id),
  type: text().notNull(),
  name: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
  unique('channelId_unique').on(t.channelId),
]);

export const channelsRelations = relations(channels, ({ many, one }) => ({
  messages: many(messages),
  guild: one(guilds, {
    fields: [channels.guildId],
    references: [guilds.guildId],
  })
}));
