import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    if (!db) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    if (!month) {
      return NextResponse.json(
        { error: 'Month parameter is required' },
        { status: 400 }
      )
    }

    const budgets = await db.budget.findMany({
      where: {
        month: month
      },
      orderBy: {
        category: 'asc'
      }
    })
    
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Failed to fetch budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
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
    const { category, allocated, month } = body

    if (!category || allocated === undefined || !month) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if budget for this category and month already exists
    const existingBudget = await db.budget.findFirst({
      where: {
        category,
        month
      }
    })

    let budget
    if (existingBudget) {
      // Update existing budget
      budget = await db.budget.update({
        where: { id: existingBudget.id },
        data: {
          allocated: parseFloat(allocated)
        }
      })
    } else {
      // Create new budget
      budget = await db.budget.create({
        data: {
          category,
          allocated: parseFloat(allocated),
          spent: 0,
          month
        }
      })
    }

    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Failed to save budget:', error)
    return NextResponse.json(
      { error: 'Failed to save budget' },
      { status: 500 }
    )
  }
}