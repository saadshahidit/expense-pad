import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Load .env manually (no dotenv dep needed)
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0) {
      const key = line.slice(0, eqIndex).trim();
      const val = line.slice(eqIndex + 1).trim();
      if (key && !process.env[key]) process.env[key] = val;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const CATEGORIES = [
  { name: 'Food', color: '#f59e0b', icon: '🍔' },
  { name: 'Transport', color: '#3b82f6', icon: '🚌' },
  { name: 'Utilities', color: '#8b5cf6', icon: '💡' },
  { name: 'Entertainment', color: '#ec4899', icon: '🎬' },
  { name: 'Health', color: '#10b981', icon: '💊' },
  { name: 'Shopping', color: '#f97316', icon: '🛍️' },
  { name: 'Other', color: '#6b7280', icon: '📦' },
];

async function main() {
  console.log('Seeding database...');

  // Seed categories if empty
  const catCount = await prisma.category.count();
  if (catCount === 0) {
    await prisma.category.createMany({ data: CATEGORIES });
  }
  console.log('Categories seeded.');

  const categories = await prisma.category.findMany();
  const byName = (name: string) => categories.find((c) => c.name === name)!;

  // Create demo user
  const email = 'demo@expensepad.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Demo user already exists, skipping expenses.');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: { name: 'Demo User', email, password: hashedPassword },
  });
  console.log(`Demo user created: ${email}`);

  // date helper: current month, given day
  const date = (day: number) => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-${String(day).padStart(2, '0')}`;
  };

  // Current month expenses
  const expenses = [
    { amount: 50.0,  description: 'Grocery shopping',     date: date(1),  categoryId: byName('Food').id },
    { amount: 9.99,  description: 'Bus monthly pass',     date: date(3),  categoryId: byName('Transport').id },
    { amount: 85.0,  description: 'Electricity bill',     date: date(5),  categoryId: byName('Utilities').id },
    { amount: 30.0,  description: 'Concert ticket',       date: date(7),  categoryId: byName('Entertainment').id },
    { amount: 25.0,  description: 'Lunch',                date: date(9),  categoryId: byName('Food').id },
    { amount: 55.0,  description: 'Gym membership',       date: date(10), categoryId: byName('Health').id },
    { amount: 90.0,  description: 'Clothing',             date: date(12), categoryId: byName('Shopping').id },
    { amount: 20.0,  description: 'Fuel',                 date: date(14), categoryId: byName('Transport').id },
    { amount: 40.0,  description: 'Water & gas bill',     date: date(16), categoryId: byName('Utilities').id },
    { amount: 14.99, description: 'Spotify subscription', date: date(18), categoryId: byName('Entertainment').id },
    { amount: 35.0,  description: 'Groceries',            date: date(20), categoryId: byName('Food').id },
    { amount: 18.0,  description: 'Miscellaneous',        date: date(22), categoryId: byName('Other').id },
  ];

  await prisma.expense.createMany({
    data: expenses.map((e) => ({ ...e, userId: user.id })),
  });

  console.log(`${expenses.length} expenses seeded.`);
  console.log('\nDemo credentials:');
  console.log('  Email:    demo@expensepad.com');
  console.log('  Password: password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
