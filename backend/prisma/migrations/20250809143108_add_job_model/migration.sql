-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "jobType" TEXT NOT NULL DEFAULT 'Full-time',
    "workType" TEXT NOT NULL DEFAULT 'On-site',
    "notes" TEXT,
    "jobUrl" TEXT,
    "contactEmail" TEXT,
    "applicationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
