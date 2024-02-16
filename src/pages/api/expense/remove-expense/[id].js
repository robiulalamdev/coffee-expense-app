import { prisma } from "@/server/prisma";

export default async function handler(req, res) {
  try {
    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const { id } = req.query;
    const isExist = await prisma.expense.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (isExist) {
      const result = await prisma.expense.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(200).json({
        success: true,
        message: "Expense Delete Success",
        data: result,
      });
    } else {
      res.status(404).json({
        success: true,
        message: "Expense Not Found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
}
