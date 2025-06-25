/*
  Warnings:

  - You are about to alter the column `membershipFees` on the `insurance` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - Added the required column `kycNumber` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `kycNumber` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `insurance` ADD COLUMN `SalesAmount` DOUBLE NULL,
    MODIFY `membershipFees` DOUBLE NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `invoiceNumber` VARCHAR(191) NOT NULL,
    MODIFY `paymentMode` VARCHAR(191) NOT NULL DEFAULT 'RAZORPAY',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `CompanyBranding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NOT NULL,
    `planName` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `colorCode` VARCHAR(191) NOT NULL,
    `kitName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IndiaLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
