/*
  Warnings:

  - You are about to alter the column `pincode` on the `IndiaLocation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `IndiaLocation` MODIFY `pincode` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `PolicyPricing` ADD COLUMN `brokerDetials` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `insurance` ADD COLUMN `warrenty` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `PlanCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `minAmount` INTEGER NULL,
    `maxAmount` INTEGER NULL,
    `priceAmount` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMeta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('DEALER', 'DISTRIBUTOR', 'NBFC', 'BANK', 'SUPERADMIN', 'CUSTOMER') NOT NULL,
    `roleId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `pincode` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
