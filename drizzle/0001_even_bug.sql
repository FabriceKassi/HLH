CREATE TABLE `atta_inventory` (
	`room_id` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`units` integer NOT NULL,
	`rate_xof` integer NOT NULL,
	`updated` text NOT NULL,
	PRIMARY KEY(`room_id`, `category`, `date`)
);
--> statement-breakpoint
CREATE TABLE `atta_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`room_id` text NOT NULL,
	`category` text NOT NULL,
	`arrival` text NOT NULL,
	`departure` text NOT NULL,
	`quantity` integer NOT NULL,
	`adults` integer NOT NULL,
	`children` integer DEFAULT 0 NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`currency` text DEFAULT 'XOF' NOT NULL,
	`amount` integer NOT NULL,
	`quote` text NOT NULL,
	`status` text DEFAULT 'awaiting_payment' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_reference` text,
	`payment_url` text,
	`expires` text NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_atta_reservations_reference` ON `atta_reservations` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_atta_reservations_payment_reference` ON `atta_reservations` (`payment_reference`);--> statement-breakpoint
CREATE INDEX `idx_atta_reservations_room_dates` ON `atta_reservations` (`room_id`,`category`,`arrival`,`departure`);--> statement-breakpoint
CREATE INDEX `idx_atta_reservations_status_expiry` ON `atta_reservations` (`status`,`expires`);