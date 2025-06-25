/*
  Warnings:

  - Added the required column `city` to the `dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinCode` to the `dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `dealer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `distributor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dealer` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `note` VARCHAR(191) NOT NULL,
    ADD COLUMN `pinCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `distributor` ADD COLUMN `note` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `paymentMode` VARCHAR(191) NOT NULL DEFAULT 'RAZORPAY',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING';
