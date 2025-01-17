import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const [monthlyAgg, byCategoryRaw, recentExpenses] = await Promise.all([
      this.prisma.expense.aggregate({
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
      }),

      this.prisma.expense.groupBy({
        by: ['categoryId'],
        where: { userId, date: { gte: from, lte: to } },
        _sum: { amount: true },
      }),

      this.prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      }),
    ]);

    const categories = await this.prisma.category.findMany({
      where: { id: { in: byCategoryRaw.map((r) => r.categoryId) } },
    });

    const byCategory = byCategoryRaw.map((r) => {
      const cat = categories.find((c) => c.id === r.categoryId);
      return {
        categoryId: r.categoryId,
        name: cat?.name,
        color: cat?.color,
        icon: cat?.icon,
        total: Number(r._sum.amount ?? 0),
      };
    });

    return {
      monthlyTotal: Number(monthlyAgg._sum.amount ?? 0),
      byCategory,
      recentExpenses,
    };
  }
}
