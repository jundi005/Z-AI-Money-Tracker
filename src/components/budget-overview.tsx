'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Wallet, Coffee, Gamepad2, ShoppingCart, Plus, BookOpen, Heart, Gift, Music } from 'lucide-react'
import { CategoryManager } from '@/components/category-manager'
import { BudgetForm } from '@/components/budget-form'

interface BudgetOverviewProps {
  stats: {
    totalIncome: number
    totalExpense: number
    balance: number
    savingsGoal: number
    currentSavings: number
  }
}

const categoryIcons: Record<string, any> = {
  food: Coffee,
  transport: Wallet,
  entertainment: Gamepad2,
  shopping: ShoppingCart,
  education: BookOpen,
  health: Heart,
  gift: Gift,
  music: Music
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-500',
  transport: 'bg-blue-500',
  entertainment: 'bg-purple-500',
  shopping: 'bg-pink-500',
  education: 'bg-green-500',
  health: 'bg-red-500',
  gift: 'bg-yellow-500',
  music: 'bg-indigo-500'
}

const categoryNames: Record<string, string> = {
  food: 'Makanan',
  transport: 'Transportasi',
  entertainment: 'Hiburan',
  shopping: 'Belanja',
  education: 'Pendidikan',
  health: 'Kesehatan',
  gift: 'Hadiah',
  music: 'Musik'
}

interface BudgetData {
  id: string
  category: string
  allocated: number
  spent: number
  month: string
}

export function BudgetOverview({ stats }: BudgetOverviewProps) {
  const [budgets, setBudgets] = useState<BudgetData[]>([])
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      if (response.ok) {
        const data = await response.json()
        setBudgets(data)
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBudgetSaved = () => {
    fetchBudgets()
    setShowBudgetForm(false)
  }

  const handleCategoryManaged = () => {
    fetchBudgets()
    setShowCategoryManager(false)
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.allocated, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remainingBudget = totalBudget - totalSpent

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-slate-700 rounded-lg mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Monthly Budget Summary */}
      <Card className="bg-gradient-to-r from-blue-800 to-purple-800 text-white border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            Budget Bulanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75">Total Budget</p>
              <p className="text-xl font-bold">Rp {totalBudget.toLocaleString('id-ID')}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Tersisa</p>
              <p className="text-xl font-bold">Rp {remainingBudget.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Terpakai: Rp {totalSpent.toLocaleString('id-ID')}</span>
              <span>{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%</span>
            </div>
            <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">Budget per Kategori</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setShowCategoryManager(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Kategori
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => setShowBudgetForm(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Atur Budget
            </Button>
          </div>
        </div>

        {budgets.length === 0 ? (
          <Card className="p-6 bg-slate-800 border-slate-700 text-center">
            <p className="text-slate-400 mb-3">Belum ada budget yang diatur</p>
            <Button 
              onClick={() => setShowBudgetForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Atur Budget Sekarang
            </Button>
          </Card>
        ) : (
          budgets.map((budget) => {
            const Icon = categoryIcons[budget.category] || Wallet
            const percentage = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0
            const isOverBudget = percentage > 100
            const isNearLimit = percentage > 80

            return (
              <Card key={budget.id} className="p-4 bg-slate-800 border-slate-700 text-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${categoryColors[budget.category]} bg-opacity-20 flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{categoryNames[budget.category] || budget.category}</p>
                        <p className="text-xs text-slate-400">
                          Rp {budget.spent.toLocaleString('id-ID')} / Rp {budget.allocated.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={isOverBudget ? 'destructive' : isNearLimit ? 'secondary' : 'default'}
                      className={`text-xs ${isOverBudget ? 'bg-red-600/20 text-red-300 border-red-600/30' : 
                                     isNearLimit ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30' :
                                     'bg-green-600/20 text-green-300 border-green-600/30'}`}
                    >
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : ''}`}
                  />
                  {isOverBudget && (
                    <p className="text-xs text-red-400 font-medium">
                      ⚠️ Melebihi budget sebesar Rp {(budget.spent - budget.allocated).toLocaleString('id-ID')}
                    </p>
                  )}
                  {isNearLimit && !isOverBudget && (
                    <p className="text-xs text-yellow-400">
                      📊 Hanya tersisa Rp {(budget.allocated - budget.spent).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Savings Goal */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            Target Tabungan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Progress</span>
            <Badge variant="outline" className="bg-green-600/20 text-green-300 border-green-600/30">
              {((stats.currentSavings / stats.savingsGoal) * 100).toFixed(1)}%
            </Badge>
          </div>
          <Progress value={(stats.currentSavings / stats.savingsGoal) * 100} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-white">Rp {stats.currentSavings.toLocaleString('id-ID')}</span>
            <span className="text-slate-400">Target: Rp {stats.savingsGoal.toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              💡 Saran tabungan: Rp {(stats.totalIncome * 0.2).toLocaleString('id-ID')}/bulan (20% dari pemasukan)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Form Modal */}
      {showBudgetForm && (
        <BudgetForm
          onClose={() => setShowBudgetForm(false)}
          onSuccess={handleBudgetSaved}
        />
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          onClose={() => setShowCategoryManager(false)}
          onSuccess={handleCategoryManaged}
        />
      )}
    </div>
  )
}