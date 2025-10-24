import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default categories that should always be included
const defaultCategories = [
  { id: 'food', name: 'Makanan', icon: 'coffee', color: 'bg-orange-500', isDefault: true },
  { id: 'transport', name: 'Transportasi', icon: 'wallet', color: 'bg-blue-500', isDefault: true },
  { id: 'entertainment', name: 'Hiburan', icon: 'gamepad2', color: 'bg-purple-500', isDefault: true },
  { id: 'shopping', name: 'Belanja', icon: 'shopping-cart', color: 'bg-pink-500', isDefault: true },
  { id: 'education', name: 'Pendidikan', icon: 'book-open', color: 'bg-green-500', isDefault: true },
  { id: 'health', name: 'Kesehatan', icon: 'heart', color: 'bg-red-500', isDefault: true },
  { id: 'gift', name: 'Hadiah', icon: 'gift', color: 'bg-yellow-500', isDefault: true },
  { id: 'music', name: 'Musik', icon: 'music', color: 'bg-indigo-500', isDefault: true },
  { id: 'salary', name: 'Gaji', icon: 'wallet', color: 'bg-green-500', isDefault: true },
  { id: 'allowance', name: 'Uang Saku', icon: 'wallet', color: 'bg-blue-500', isDefault: true },
  { id: 'freelance', name: 'Freelance', icon: 'wallet', color: 'bg-purple-500', isDefault: true },
  { id: 'other', name: 'Lainnya', icon: 'wallet', color: 'bg-gray-500', isDefault: true }
]

export async function GET() {
  try {
    // Check if database is available
    if (!db) {
      // Return default categories only
      return NextResponse.json(defaultCategories.map(category => ({
        ...category,
        transactionCount: 0
      })))
    }

    // Get custom categories from database
    const customCategories = await db.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    // Transform custom categories and get transaction counts
    const transformedCustomCategories = await Promise.all(
      customCategories.map(async (cat) => {
        const count = await db!.transaction.count({
          where: { category: cat.id }
        })
        return {
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          isDefault: false,
          transactionCount: count
        }
      })
    )

    // Get transaction counts for default categories
    const defaultCategoriesWithCounts = await Promise.all(
      defaultCategories.map(async (category) => {
        const count = await db!.transaction.count({
          where: { category: category.id }
        })
        return {
          ...category,
          transactionCount: count
        }
      })
    )

    // Combine default and custom categories
    const allCategories = [...defaultCategoriesWithCounts, ...transformedCustomCategories]

    return NextResponse.json(allCategories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
    const { name, icon, color } = body

    if (!name || !icon || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique ID for the category
    const categoryId = name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now()

    // Create custom category in database
    const category = await db.category.create({
      data: {
        id: categoryId,
        name,
        icon,
        color
      }
    })

    return NextResponse.json({ 
      ...category, 
      isDefault: false, 
      transactionCount: 0 
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}