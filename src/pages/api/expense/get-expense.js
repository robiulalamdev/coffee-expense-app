import { prisma } from "@/server/prisma";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
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
    const expenses = await prisma.expense.findMany({});
    const todayData = expenses.find((exp) => {
      const createdAt = new Date(exp.createdAt);
      return createdAt >= todayStart && createdAt < todayEnd;
    });

    const totals = {
      coffee: expenses.reduce((acc, curr) => acc + curr.coffee, 0),
      food: expenses.reduce((acc, curr) => acc + curr.food, 0),
      alcohol: expenses.reduce((acc, curr) => acc + curr.alcohol, 0),
    };

    res.status(200).json({
      success: true,
      message: "Expense retrieve Success",
      data: { today: todayData, expense: totals, all_expenses: expenses },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
