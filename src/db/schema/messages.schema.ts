import { boolean, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { channels } from './channels.schema';
import { users } from './users.schema';

export const messages = pgTable('messages', {
  id: text().primaryKey().$defaultFn(createId),
  content: text().notNull(),
  messageId: text().notNull(),
  authorId: text().notNull().references(() => users.id),
  channelId: text().notNull().references(() => channels.id),
  isBot: boolean().default(false).notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
  unique('messageId_unique').on(t.messageId),
]);

export const messagesRelations = relations(messages, ({ one }) => ({
  channel: one(channels, {
    fields: [messages.channelId],
    references: [channels.id],
  }),
  author: one(users, {
    fields: [messages.authorId],
    references: [users.id],
  }),
}));
