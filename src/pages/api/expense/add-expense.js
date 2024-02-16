import { prisma } from "@/server/prisma";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayExpense = await prisma.expense.findFirst({
      where: {
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    if (todayExpense) {
      res.status(200).json({
        success: false,
        message: "Expense added today",
        data: todayExpense,
      });
    } else {
      const result = await prisma.expense.create({
        data: req.body,
      });

      res.status(200).json({
        success: true,
        message: "Expense created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
}
