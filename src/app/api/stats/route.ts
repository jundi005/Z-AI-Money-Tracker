import { NextResponse } from 'next/server'
import { db, withDatabase } from '@/lib/db'

export async function GET() {
  return withDatabase({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    savingsGoal: 500000,
    currentSavings: 0
  })(async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      
      // Get all transactions
      const transactions = await db!.transaction.findMany()
      
      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const balance = totalIncome - totalExpense
      
      // Get current savings goal
      const savingsGoal = await db!.savingsGoal.findFirst({
        orderBy: { createdAt: 'desc' }
      })
      
      const currentSavings = savingsGoal?.current || 0
      const targetSavings = savingsGoal?.target || 500000

      return NextResponse.json({
        totalIncome,
        totalExpense,
        balance,
        savingsGoal: targetSavings,
        currentSavings
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      )
    }
  })
}