/*
  Warnings:

  - You are about to drop the column `path` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "path",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");
