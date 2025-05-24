CREATE TABLE `bonds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`partner_1` integer,
	`partner_2` integer,
	`couple_date` integer,
	`bonded` integer DEFAULT false NOT NULL,
	`public` integer DEFAULT false NOT NULL,
	`premium` integer DEFAULT false NOT NULL,
	`subscription_id` text,
	`next_payment` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`partner_1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`partner_2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bonds_code_unique` ON `bonds` (`code`);--> statement-breakpoint
CREATE INDEX `bonds_partner_1_idx` ON `bonds` (`partner_1`);--> statement-breakpoint
CREATE INDEX `bonds_partner_2_idx` ON `bonds` (`partner_2`);--> statement-breakpoint
CREATE TABLE `logins` (
	`user` integer PRIMARY KEY NOT NULL,
	`attempts` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lat` integer NOT NULL,
	`lng` integer NOT NULL,
	`group` integer NOT NULL,
	`bond` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`bond`) REFERENCES `bonds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `markers_bond_idx` ON `markers` (`bond`);--> statement-breakpoint
CREATE INDEX `markers_bond_order_idx` ON `markers` (`bond`,`order`);--> statement-breakpoint
CREATE TABLE `stories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`marker` integer NOT NULL,
	`bond` integer NOT NULL,
	`user` integer NOT NULL,
	`description` text,
	`year` integer DEFAULT 0 NOT NULL,
	`month` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`marker`) REFERENCES `markers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bond`) REFERENCES `bonds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stories_bond_idx` ON `stories` (`bond`);--> statement-breakpoint
CREATE INDEX `stories_marker_idx` ON `stories` (`marker`);--> statement-breakpoint
CREATE INDEX `stories_bond_year_month_idx` ON `stories` (`bond`,"year" desc,"month" desc);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`name` text NOT NULL,
	`country` text,
	`birth_date` integer,
	`show_avatar` integer DEFAULT false NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`confirmed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);