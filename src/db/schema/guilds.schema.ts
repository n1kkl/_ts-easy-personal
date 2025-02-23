import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { messages } from './messages.schema';
import { channels } from './channels.schema';
import { usersToGuilds } from './users.schema';

export const guilds = pgTable('guilds', {
  id: text().primaryKey().$defaultFn(createId),
  guildId: text().notNull(),
  name: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
  unique('guildId_unique').on(t.guildId),
]);

export const guildsRelations = relations(guilds, ({ many }) => ({
  channels: many(channels),
  users: many(usersToGuilds),
}));

