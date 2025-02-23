import { boolean, pgTable, primaryKey, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { guilds } from './guilds.schema';

export const users = pgTable('users', {
  id: text().primaryKey().$defaultFn(createId),
  userId: text().notNull(),
  name: text().notNull(),
  isBot: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
  unique('userId_unique').on(t.userId),
]);

export const usersRelations = relations(users, ({ many }) => ({
  guilds: many(usersToGuilds),
}));

export const usersToGuilds = pgTable('users_to_guilds', {
  userId: text().notNull().references(() => users.id),
  guildId: text().notNull().references(() => guilds.id),
  createdAt: timestamp().defaultNow().notNull(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.guildId] }),
]);

export const usersToGuildsRelations = relations(usersToGuilds, ({ one }) => ({
  user: one(users, {
    fields: [usersToGuilds.userId],
    references: [users.id],
  }),
  guild: one(guilds, {
    fields: [usersToGuilds.guildId],
    references: [guilds.id],
  }),
}));
