CREATE TABLE `bonds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`partner_1` integer,
	`partner_2` integer,
	`couple_date` integer,
	`bonded` integer DEFAULT 0 NOT NULL,
	`public` integer DEFAULT 0 NOT NULL,
	`premium` integer DEFAULT 0 NOT NULL,
	`subscription_id` text,
	`next_payment` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`partner_1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`partner_2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bonds_code_unique` ON `bonds` (`code`);--> statement-breakpoint
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
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`name` text NOT NULL,
	`country` text,
	`birth_date` integer,
	`show_avatar` integer DEFAULT 0 NOT NULL,
	`auth` integer DEFAULT 0 NOT NULL,
	`confirmed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);