import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const messages = pgTable('messages', {
  id: text().primaryKey().$defaultFn(createId),
  content: text().notNull(),
  authorId: text().notNull(),
  authorName: text().notNull(),
  guildId: text(),
  guildName: text(),
  channelId: text(),
  channelName: text(),
  receivedAt: timestamp().defaultNow().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull()
});
