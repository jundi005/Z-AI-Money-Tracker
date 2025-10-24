'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Wallet, Coffee, Gamepad2, ShoppingCart, BookOpen, Heart, Gift, Music } from 'lucide-react'

interface BudgetFormProps {
  onClose: () => void
  onSuccess: () => void
}

const categories = [
  { id: 'food', name: 'Makanan', icon: Coffee, color: 'bg-orange-500' },
  { id: 'transport', name: 'Transportasi', icon: Wallet, color: 'bg-blue-500' },
  { id: 'entertainment', name: 'Hiburan', icon: Gamepad2, color: 'bg-purple-500' },
  { id: 'shopping', name: 'Belanja', icon: ShoppingCart, color: 'bg-pink-500' },
  { id: 'education', name: 'Pendidikan', icon: BookOpen, color: 'bg-green-500' },
  { id: 'health', name: 'Kesehatan', icon: Heart, color: 'bg-red-500' },
  { id: 'gift', name: 'Hadiah', icon: Gift, color: 'bg-yellow-500' },
  { id: 'music', name: 'Musik', icon: Music, color: 'bg-indigo-500' }
]

interface BudgetData {
  category: string
  allocated: number
}

export function BudgetForm({ onClose, onSuccess }: BudgetFormProps) {
  const [budgets, setBudgets] = useState<BudgetData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCurrentBudgets()
  }, [])

  const fetchCurrentBudgets = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      const response = await fetch(`/api/budgets?month=${currentMonth}`)
      if (response.ok) {
        const data = await response.json()
        setBudgets(categories.map(cat => ({
          category: cat.id,
          allocated: data.find((b: any) => b.category === cat.id)?.allocated || 0
        })))
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      
      for (const budget of budgets) {
        const response = await fetch('/api/budgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: budget.category,
            allocated: budget.allocated,
            month: currentMonth
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save budget')
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Failed to save budgets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBudgetChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setBudgets(prev => 
      prev.map(b => 
        b.category === category ? { ...b, allocated: numValue } : b
      )
    )
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.allocated, 0)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Atur Budget Bulanan</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon
                const currentBudget = budgets.find(b => b.category === category.id)
                
                return (
                  <div key={category.id} className="space-y-2">
                    <Label className="text-slate-300 flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${category.color} bg-opacity-20 flex items-center justify-center`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      {category.name}
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={currentBudget?.allocated || ''}
                      onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                )
              })}
            </div>

            {/* Total Budget Summary */}
            <div className="pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Total Budget</span>
                <span className="text-lg font-bold text-blue-400">
                  Rp {totalBudget.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Budget'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}