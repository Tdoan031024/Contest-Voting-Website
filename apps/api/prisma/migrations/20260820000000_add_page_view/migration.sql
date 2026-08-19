CREATE TABLE `pageview` (
  `id` VARCHAR(191) NOT NULL,
  `visitorId` VARCHAR(191) NOT NULL,
  `path` VARCHAR(191) NOT NULL,
  `referrer` TEXT NULL,
  `userAgent` TEXT NULL,
  `ipHash` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `pageview_visitorId_idx` ON `pageview`(`visitorId`);
CREATE INDEX `pageview_path_idx` ON `pageview`(`path`);
CREATE INDEX `pageview_createdAt_idx` ON `pageview`(`createdAt`);
