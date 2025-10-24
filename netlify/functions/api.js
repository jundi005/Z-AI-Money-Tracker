const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.handler = async (event, context) => {
  try {
    const { httpMethod, path, body } = event
    const route = path.replace('/.netlify/functions/api', '')
    
    console.log(`Method: ${httpMethod}, Route: ${route}`)
    
    switch (route) {
      case '/stats':
        if (httpMethod === 'GET') return await handleGetStats()
        break
      case '/transactions':
        if (httpMethod === 'GET') return await handleGetTransactions()
        if (httpMethod === 'POST') return await handleCreateTransaction(JSON.parse(body))
        break
      case '/init':
        if (httpMethod === 'POST') return await handleInit()
        break
      case '/budgets':
        if (httpMethod === 'GET') return await handleGetBudgets()
        break
      case '/export':
        if (httpMethod === 'GET') return await handleExport()
        break
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Route not found' })
        }
    }
    
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
    
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function handleGetStats() {
  try {
    const transactions = await prisma.transaction.findMany()
    const savingsGoal = await prisma.savingsGoal.findFirst()
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = totalIncome - totalExpense
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        totalIncome,
        totalExpense,
        balance,
        savingsGoal: savingsGoal?.target || 500000,
        currentSavings: savingsGoal?.current || 0
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch stats' })
    }
  }
}

async function handleGetTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    })
    
    return {
      statusCode: 200,
      body: JSON.stringify(transactions)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch transactions' })
    }
  }
}

async function handleCreateTransaction(data) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date(data.date)
      }
    })
    
    return {
      statusCode: 201,
      body: JSON.stringify(transaction)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create transaction' })
    }
  }
}

async function handleInit() {
  try {
    const existingGoal = await prisma.savingsGoal.findFirst()
    if (!existingGoal) {
      await prisma.savingsGoal.create({
        data: {
          title: 'Target Tabungan Utama',
          target: 500000,
          current: 0,
          deadline: new Date(new Date().setMonth(new Date().getMonth() + 6))
        }
      })
    }

    const currentMonth = new Date().toISOString().slice(0, 7)
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
      const existing = await prisma.budget.findFirst({
        where: { category: budget.category, month: currentMonth }
      })

      if (!existing) {
        await prisma.budget.create({
          data: {
            category: budget.category,
            allocated: budget.allocated,
            spent: 0,
            month: currentMonth
          }
        })
      }
    }

    const existingTransactions = await prisma.transaction.findFirst()
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
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]

      for (const transaction of sampleTransactions) {
        await prisma.transaction.create({ data: transaction })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data initialized successfully' })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to initialize data' })
    }
  }
}

async function handleGetBudgets() {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const budgets = await prisma.budget.findMany({
      where: { month: currentMonth }
    })
    
    return {
      statusCode: 200,
      body: JSON.stringify(budgets)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch budgets' })
    }
  }
}

async function handleExport() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' }
    })
    
    const exportData = {
      exportDate: new Date().toISOString(),
      transactions,
      summary: {
        total: transactions.length,
        income: transactions.filter(t => t.type === 'income').length,
        expense: transactions.filter(t => t.type === 'expense').length
      }
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(exportData)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to export data' })
    }
  }
}