CREATE TABLE `bonds` (
	`id` integer PRIMARY KEY NOT NULL,
	`user` integer NOT NULL,
	`partner` integer NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`partner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `markers` (
	`id` integer PRIMARY KEY NOT NULL,
	`user` integer NOT NULL,
	`lat` integer NOT NULL,
	`lng` integer NOT NULL,
	`group` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `bonds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`marker` integer NOT NULL,
	FOREIGN KEY (`marker`) REFERENCES `markers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL,
	`country` text,
	`address` text,
	`joined` integer NOT NULL,
	`confirmed` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_index` ON `users` (`email`);