CREATE TABLE `bonds` (
	`id` integer PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`partner_1` integer,
	`partner_2` integer,
	`couple_date` integer,
	`bonded` integer DEFAULT 0 NOT NULL,
	`public` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`partner_1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`partner_2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`id` integer PRIMARY KEY NOT NULL,
	`lat` integer NOT NULL,
	`lng` integer NOT NULL,
	`group` integer NOT NULL,
	`user` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `bonds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` integer PRIMARY KEY NOT NULL,
	`marker` integer NOT NULL,
	`user` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`year` integer DEFAULT 0 NOT NULL,
	`month` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`marker`) REFERENCES `markers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user`) REFERENCES `bonds`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`country` text,
	`address` text,
	`birth_date` integer,
	`show_avatar` integer DEFAULT 0 NOT NULL,
	`confirm_code` text NOT NULL,
	`confirmed` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bonds_code_unique` ON `bonds` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);