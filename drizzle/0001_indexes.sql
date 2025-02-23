ALTER TABLE "messages" ADD COLUMN "messageId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "receivedAt";--> statement-breakpoint
ALTER TABLE "channels" ADD CONSTRAINT "channelId_unique" UNIQUE("channelId");--> statement-breakpoint
ALTER TABLE "guilds" ADD CONSTRAINT "guildId_unique" UNIQUE("guildId");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messageId_unique" UNIQUE("messageId");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "userId_unique" UNIQUE("userId");