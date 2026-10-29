CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`json` text NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`day` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`token_hash` text NOT NULL,
	`kind` text NOT NULL,
	`hotel` text NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_requests_user_created` ON `requests` (`user_id`,`created`);--> statement-breakpoint
CREATE INDEX `idx_requests_created` ON `requests` (`created`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`email` text PRIMARY KEY NOT NULL,
	`created` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL
);
