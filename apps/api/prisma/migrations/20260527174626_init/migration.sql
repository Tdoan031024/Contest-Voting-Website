-- CreateTable
CREATE TABLE `Candidate` (
    `id` VARCHAR(191) NOT NULL,
    `sbd` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `votes` INTEGER NOT NULL DEFAULT 0,
    `imageUrl` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `biography` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Candidate_sbd_key`(`sbd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sponsor` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NOT NULL,
    `tier` ENUM('PLATINUM', 'GOLD', 'SILVER', 'PARTNER') NOT NULL DEFAULT 'PARTNER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimelineEvent` (
    `id` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteRecord` (
    `id` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,
    `voterPhone` VARCHAR(191) NOT NULL,
    `voteTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transactionId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
