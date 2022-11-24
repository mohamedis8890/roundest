/*
  Warnings:

  - You are about to drop the `_votesAgainst` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_votesFor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_votesAgainst`;

-- DropTable
DROP TABLE `_votesFor`;

-- CreateIndex
CREATE INDEX `Vote_votedForId_idx` ON `Vote`(`votedForId`);

-- CreateIndex
CREATE INDEX `Vote_votedAgainstId_idx` ON `Vote`(`votedAgainstId`);
