/*
  Warnings:

  - You are about to drop the column `sActive` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `sActive`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
