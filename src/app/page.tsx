'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, TrendingUp, TrendingDown, Wallet, Target, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { TransactionForm } from '@/components/transaction-form'
import { TransactionList } from '@/components/transaction-list'
import { CashFlowChart } from '@/components/cash-flow-chart'
import { BudgetOverview } from '@/components/budget-overview'
import { StatsCards } from '@/components/stats-cards'

export default function Home() {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    savingsGoal: 500000,
    currentSavings: 0
  })

  useEffect(() => {
    // Initialize data and load initial data
    initializeData()
    fetchTransactions()
    fetchStats()
  }, [])

  const initializeData = async () => {
    try {
      await fetch('/api/init', { method: 'POST' })
    } catch (error) {
      console.error('Failed to initialize data:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleTransactionAdded = () => {
    fetchTransactions()
    fetchStats()
    setShowTransactionForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Money Tracker
              </h1>
              <p className="text-sm text-slate-400">Kelola keuanganmu dengan gaya</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700">
                Teen Mode
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-800 to-purple-800 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span className="text-sm opacity-90">Total Balance</span>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                {new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-4">
              Rp {stats.balance.toLocaleString('id-ID')}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-xs opacity-75">Income</p>
                  <p className="font-semibold">Rp {stats.totalIncome.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-xs opacity-75">Expense</p>
                  <p className="font-semibold">Rp {stats.totalExpense.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <PieChart className="w-4 h-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              Transaksi
            </TabsTrigger>
            <TabsTrigger value="budget" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-1" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingDown className="w-4 h-4 mr-1" />
              Statistik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            <StatsCards stats={stats} />
            <div className="mt-4">
              <TransactionList 
                transactions={transactions.slice(0, 5)} 
                showHeader={true}
                onViewAll={() => setActiveTab('transactions')}
              />
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <TransactionList 
              transactions={transactions} 
              showHeader={true}
              showViewAll={false}
            />
          </TabsContent>

          <TabsContent value="budget" className="mt-4">
            <BudgetOverview stats={stats} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <CashFlowChart transactions={transactions} />
            <div className="mt-4">
              <StatsCards stats={stats} detailed={true} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Button
          onClick={() => setShowTransactionForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <TransactionForm
            onClose={() => setShowTransactionForm(false)}
            onSuccess={handleTransactionAdded}
          />
        )}
      </div>
    </div>
  )
}