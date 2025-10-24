import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json([])
    }

    const transactions = await db.transaction.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { type, amount, category, description, date } = body

    if (!type || !amount || !category || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transaction = await db.transaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: new Date(date)
      }
    })

    // Update budget if expense
    if (type === 'expense') {
      const currentMonth = new Date(date).toISOString().slice(0, 7) // YYYY-MM
      
      let budget = await db.budget.findFirst({
        where: {
          category,
          month: currentMonth
        }
      })

      // If no budget exists for this category, create one with default allocation
      if (!budget) {
        const defaultAllocations: Record<string, number> = {
          food: 500000,
          transport: 200000,
          entertainment: 300000,
          shopping: 400000,
          education: 150000,
          health: 100000,
          gift: 100000,
          music: 100000
        }

        budget = await db.budget.create({
          data: {
            category,
            allocated: defaultAllocations[category] || 200000,
            spent: 0,
            month: currentMonth
          }
        })
      }

      // Update spent amount
      await db.budget.update({
        where: { id: budget.id },
        data: {
          spent: budget.spent + parseFloat(amount)
        }
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}