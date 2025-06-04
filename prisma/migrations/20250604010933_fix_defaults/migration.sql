-- CreateTable
CREATE TABLE `superadmin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pinCode` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `contactMobile` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `passwordUpdatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `superadmin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `address1` VARCHAR(191) NOT NULL,
    `address2` VARCHAR(191) NULL,
    `address3` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `postCode` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `kyc` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `customer_mobile_key`(`mobile`),
    UNIQUE INDEX `customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salesChannel` VARCHAR(191) NOT NULL,
    `dealerName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `dealerLocation` VARCHAR(191) NOT NULL,
    `dealerCode` VARCHAR(191) NOT NULL,
    `vas` VARCHAR(191) NOT NULL,
    `businessPartnerName` VARCHAR(191) NOT NULL,
    `businessPartnerCategory` VARCHAR(191) NOT NULL,
    `lanNumber` VARCHAR(191) NOT NULL,
    `policyBookingDate` DATETIME(3) NOT NULL,
    `membershipFees` VARCHAR(191) NOT NULL,
    `brokerDetails` VARCHAR(191) NOT NULL,
    `locationCode` VARCHAR(191) NOT NULL,
    `loanApiIntegration` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `plan` INTEGER NOT NULL,
    `passwordUpdatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tier` VARCHAR(191) NULL,

    UNIQUE INDEX `dealer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dealerpayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealerId` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `insuranceCount` INTEGER NOT NULL,
    `discount` DOUBLE NOT NULL,
    `baseAmount` DOUBLE NOT NULL,
    `finalAmount` DOUBLE NOT NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `paymentDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distributor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `pinCode` VARCHAR(191) NOT NULL,
    `gstNumber` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NOT NULL,
    `contactMobile` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `plan` INTEGER NOT NULL,
    `passwordUpdatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `distributor_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insurance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mobile` VARCHAR(191) NOT NULL,
    `kitNumber` VARCHAR(191) NOT NULL,
    `policyType` VARCHAR(191) NOT NULL,
    `policyHolder` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `tier` VARCHAR(191) NOT NULL,
    `certificateNo` VARCHAR(191) NOT NULL,
    `policyNumber` VARCHAR(191) NOT NULL,
    `policyStartDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `policyStatus` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `modelNo` VARCHAR(191) NOT NULL,
    `invoiceDate` DATETIME(3) NOT NULL,
    `invoiceAmount` DOUBLE NULL,
    `invoiceNo` VARCHAR(191) NOT NULL,
    `imeiNumber` VARCHAR(191) NOT NULL,
    `salesChannel` VARCHAR(191) NOT NULL,
    `dealerName` VARCHAR(191) NOT NULL,
    `dealerLocation` VARCHAR(191) NOT NULL,
    `dealerCode` VARCHAR(191) NOT NULL,
    `vas` VARCHAR(191) NOT NULL,
    `businessPartnerName` VARCHAR(191) NOT NULL,
    `businessPartnerCategory` VARCHAR(191) NOT NULL,
    `lanNumber` VARCHAR(191) NOT NULL,
    `policyBookingDate` DATETIME(3) NOT NULL,
    `membershipFees` VARCHAR(191) NOT NULL,
    `brokerDetails` VARCHAR(191) NOT NULL,
    `locationCode` VARCHAR(191) NOT NULL,
    `loanApiIntegration` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `dueamount` DOUBLE NULL,
    `paidstatus` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dealerId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `discount` DOUBLE NOT NULL,
    `baseAmount` DOUBLE NOT NULL,
    `paymentMode` VARCHAR(191) NOT NULL DEFAULT 'RAZORPAY',
    `referenceNumber` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `razorpayOrderId` VARCHAR(191) NULL,
    `razorpayPaymentId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('DEALER', 'DISTRIBUTOR', 'NBFC', 'BANK', 'SUPERADMIN', 'CUSTOMER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanTier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `discountPercent` DOUBLE NOT NULL,
    `insuranceCount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `invoiceAmount` INTEGER NOT NULL,
    `ew1Year` INTEGER NULL,
    `ew2Year` INTEGER NULL,
    `ew3Year` INTEGER NULL,
    `adld` INTEGER NULL,
    `combo1Year` INTEGER NULL,
    `slabMin` INTEGER NOT NULL,
    `slabMax` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PolicyPricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `minAmount` INTEGER NOT NULL,
    `maxAmount` INTEGER NOT NULL,
    `ew1Year` INTEGER NULL,
    `ew2Year` INTEGER NULL,
    `ew3Year` INTEGER NULL,
    `adld` INTEGER NULL,
    `combo1Year` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `role` ENUM('DEALER', 'DISTRIBUTOR', 'NBFC', 'BANK', 'SUPERADMIN', 'CUSTOMER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `roleid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanTier` ADD CONSTRAINT `PlanTier_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
