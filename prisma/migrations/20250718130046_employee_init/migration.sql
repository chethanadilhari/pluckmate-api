-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `nic` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phoneNo` VARCHAR(191) NOT NULL,
    `joinedDate` DATETIME(3) NOT NULL,
    `role` ENUM('PLUCKER', 'WORKER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_nic_key`(`nic`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
