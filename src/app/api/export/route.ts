import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate stats
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = totalIncome - totalExpense

    // Group transactions by category
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)

    const report = {
      generatedAt: new Date().toISOString(),
      period: {
        start: transactions.length > 0 ? transactions[transactions.length - 1].date : null,
        end: transactions.length > 0 ? transactions[0].date : null
      },
      summary: {
        totalTransactions: transactions.length,
        totalIncome,
        totalExpense,
        balance,
        averageTransaction: transactions.length > 0 ? (totalIncome + totalExpense) / transactions.length : 0
      },
      expensesByCategory,
      incomeByCategory,
      transactions: transactions.map(t => ({
        date: t.date.toISOString().split('T')[0],
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description
      }))
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error('Failed to export data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}