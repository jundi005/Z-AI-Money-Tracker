import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json({ 
        message: 'Demo mode - No database available',
        demo: true
      })
    }

    // Create default savings goal
    const existingGoal = await db.savingsGoal.findFirst()
    if (!existingGoal) {
      await db.savingsGoal.create({
        data: {
          title: 'Target Tabungan Utama',
          target: 500000,
          current: 0,
          deadline: new Date(new Date().setMonth(new Date().getMonth() + 6))
        }
      })
    }

    // Create default budgets for current month
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const defaultBudgets = [
      { category: 'food', allocated: 500000 },
      { category: 'transport', allocated: 200000 },
      { category: 'entertainment', allocated: 300000 },
      { category: 'shopping', allocated: 400000 },
      { category: 'education', allocated: 150000 },
      { category: 'health', allocated: 100000 },
      { category: 'gift', allocated: 100000 },
      { category: 'music', allocated: 100000 }
    ]

    for (const budget of defaultBudgets) {
      const existing = await db.budget.findFirst({
        where: {
          category: budget.category,
          month: currentMonth
        }
      })

      if (!existing) {
        await db.budget.create({
          data: {
            category: budget.category,
            allocated: budget.allocated,
            spent: 0,
            month: currentMonth
          }
        })
      }
    }

    // Add sample transactions for demo
    const existingTransactions = await db.transaction.findFirst()
    if (!existingTransactions) {
      const sampleTransactions = [
        {
          type: 'income',
          amount: 1000000,
          category: 'allowance',
          description: 'Uang saku bulanan',
          date: new Date()
        },
        {
          type: 'expense',
          amount: 50000,
          category: 'food',
          description: 'Makan siang',
          date: new Date()
        },
        {
          type: 'expense',
          amount: 25000,
          category: 'transport',
          description: 'Ojek online',
          date: new Date()
        },
        {
          type: 'expense',
          amount: 75000,
          category: 'entertainment',
          description: 'Nonton film',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
        }
      ]

      for (const transaction of sampleTransactions) {
        await db.transaction.create({
          data: transaction
        })
      }
    }

    return NextResponse.json({ message: 'Data initialized successfully' })
  } catch (error) {
    console.error('Failed to initialize data:', error)
    return NextResponse.json(
      { error: 'Failed to initialize data' },
      { status: 500 }
    )
  }
}