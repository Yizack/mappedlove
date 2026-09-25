CREATE TABLE `connections` (
	`id` integer PRIMARY KEY NOT NULL,
	`user` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `connections_provider_unique_idx` ON `connections` (`provider`,`provider_id`);