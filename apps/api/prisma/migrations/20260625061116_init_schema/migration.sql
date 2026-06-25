-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'editor', 'viewer');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('parent', 'spouse');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "familyId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("familyId","userId")
);

-- CreateTable
CREATE TABLE "Persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "picUrl" TEXT,
    "bio" TEXT,
    "dob" DATE,
    "dod" DATE,
    "familyId" TEXT NOT NULL,

    CONSTRAINT "Persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "personAId" TEXT NOT NULL,
    "personBId" TEXT NOT NULL,
    "type" "Type" NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("personAId","personBId","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persons" ADD CONSTRAINT "Persons_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_personAId_fkey" FOREIGN KEY ("personAId") REFERENCES "Persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_personBId_fkey" FOREIGN KEY ("personBId") REFERENCES "Persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
