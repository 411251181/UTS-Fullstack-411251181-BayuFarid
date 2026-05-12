-- Eco-Share database export
-- Database: ecoshare_db
-- Generated at: 2026-05-12T15:37:11.343Z

CREATE DATABASE IF NOT EXISTS `ecoshare_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecoshare_db`;

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `daily_price` decimal(12,2) NOT NULL,
  `stock` int NOT NULL,
  `status` enum('AVAILABLE','UNAVAILABLE','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `items_owner_id_idx` (`owner_id`),
  CONSTRAINT `items_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `rental_histories`;
CREATE TABLE `rental_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rental_id` int NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `rental_histories_rental_id_idx` (`rental_id`),
  CONSTRAINT `rental_histories_rental_id_fkey` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `rentals`;
CREATE TABLE `rentals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `renter_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` enum('PENDING','ACTIVE','RETURNED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `rentals_renter_id_idx` (`renter_id`),
  KEY `rentals_item_id_idx` (`item_id`),
  CONSTRAINT `rentals_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `rentals_renter_id_fkey` FOREIGN KEY (`renter_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('RENTER','OWNER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('06d74b77-5fd9-4fca-b8c4-033678df2b4b', '6223faea2ddebf2e4b78a09aaad1793fae0bd94564abd61ddcae58dd6d48e62d', '2026-05-12 08:16:37', '20260512151636_init', NULL, NULL, '2026-05-12 08:16:36', 1);

INSERT INTO `items` (`id`, `owner_id`, `name`, `description`, `category`, `daily_price`, `stock`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Laptop Test 1778599230651', 'Laptop testing layak pakai', 'Laptop', '50000.00', 1, 'AVAILABLE', '2026-05-12 08:20:34', '2026-05-12 08:20:36');

INSERT INTO `rental_histories` (`id`, `rental_id`, `action`, `note`, `created_at`) VALUES
(1, 1, 'CREATED', 'Rental dibuat dan stok barang dikurangi', '2026-05-12 08:20:37');

INSERT INTO `rentals` (`id`, `renter_id`, `item_id`, `quantity`, `start_date`, `end_date`, `total_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 1, '2025-12-31 17:00:00', '2026-01-02 17:00:00', '100000.00', 'ACTIVE', '2026-05-12 08:20:37', '2026-05-12 08:20:37');

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Owner Test', 'owner1778599230651@example.com', '$2b$10$cfbLR64a9E5sADEqwdoDOOOZJO.hzMJ58VMp/E2M7/34UvfsCxFG2', 'OWNER', '2026-05-12 08:20:31', '2026-05-12 08:20:31'),
(2, 'Other Owner Test', 'other-owner1778599230651@example.com', '$2b$10$tJWl6VIZbp.5FDQUUy9U2OF.4CMiyKNe401xG9TV4l77.UpR1vSZ.', 'OWNER', '2026-05-12 08:20:32', '2026-05-12 08:20:32'),
(3, 'Renter Test', 'renter1778599230651@example.com', '$2b$10$YoFzFHcXmVyaS9bRUfOfI.A/hoXaN3IR/S9JfozCUhKxzcx.9Yvl6', 'RENTER', '2026-05-12 08:20:33', '2026-05-12 08:20:33');

SET FOREIGN_KEY_CHECKS=1;
