/*
  Warnings:

  - You are about to drop the column `education` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `experiences` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `personalInfo` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `resumes` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `resumes` table. All the data in the column will be lost.
  - Added the required column `data` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "resumes" DROP CONSTRAINT "resumes_userId_fkey";

-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "education",
DROP COLUMN "experiences",
DROP COLUMN "personalInfo",
DROP COLUMN "projects",
DROP COLUMN "skills",
DROP COLUMN "templateId",
ADD COLUMN     "data" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
