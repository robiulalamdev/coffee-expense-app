-- CreateTable
CREATE TABLE "expense" (
    "id" SERIAL NOT NULL,
    "coffee" INTEGER NOT NULL,
    "food" INTEGER NOT NULL,
    "alcohol" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);
