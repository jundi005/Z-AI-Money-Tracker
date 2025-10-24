'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Target, PiggyBank, CreditCard, Zap, Download } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalIncome: number
    totalExpense: number
    balance: number
    savingsGoal: number
    currentSavings: number
  }
  detailed?: boolean
}

export function StatsCards({ stats, detailed = false }: StatsCardsProps) {
  const savingsPercentage = Math.min((stats.currentSavings / stats.savingsGoal) * 100, 100)
  const expensePercentage = stats.totalIncome > 0 ? (stats.totalExpense / stats.totalIncome) * 100 : 0

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export')
      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `money-tracker-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Pemasukan</span>
            </div>
            <p className="text-lg font-bold text-green-300">
              Rp {stats.totalIncome.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">Pengeluaran</span>
            </div>
            <p className="text-lg font-bold text-red-300">
              Rp {stats.totalExpense.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      {detailed && (
        <>
          {/* Export Button */}
          <Card>
            <CardContent className="p-4">
              <Button
                onClick={handleExport}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                variant="default"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data Laporan
              </Button>
            </CardContent>
          </Card>

          {/* Savings Goal */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Target Tabungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Tercapai</span>
                <Badge variant={savingsPercentage >= 100 ? 'default' : 'secondary'} className="bg-purple-600/20 text-purple-300 border-purple-600/30">
                  {savingsPercentage.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={savingsPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-white">Rp {stats.currentSavings.toLocaleString('id-ID')}</span>
                <span className="text-slate-400">Rp {stats.savingsGoal.toLocaleString('id-ID')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Spending Analysis */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Analisis Pengeluaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Rasio Pengeluaran</span>
                <Badge variant={expensePercentage > 80 ? 'destructive' : expensePercentage > 60 ? 'secondary' : 'default'} 
                       className={expensePercentage > 80 ? 'bg-red-600/20 text-red-300 border-red-600/30' : 
                                  expensePercentage > 60 ? 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30' :
                                  'bg-green-600/20 text-green-300 border-green-600/30'}>
                  {expensePercentage.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={Math.min(expensePercentage, 100)} className="h-2" />
              <p className="text-xs text-slate-400">
                {expensePercentage > 80 
                  ? '⚠️ Pengeluaran kamu terlalu tinggi!' 
                  : expensePercentage > 60 
                  ? '📊 Pengeluaran kamu cukup tinggi' 
                  : '✨ Pengeluaran kamu terkendali'
                }
              </p>
            </CardContent>
          </Card>

          {/* Financial Tips */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Tips Keuangan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5" />
                  <p className="text-sm text-slate-300">
                    {stats.balance < 100000 
                      ? '💡 Mulai menabung kecil-kecilan setiap hari'
                      : stats.balance < 500000
                      ? '🎯 Tetapkan target tabungan bulanan'
                      : '🚀 Pertimbangkan investasi untuk masa depan'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                  <p className="text-sm text-slate-300">
                    {expensePercentage > 80 
                      ? '📝 Catat setiap pengeluaran untuk kontrol lebih baik'
                      : '📈 Lanjutkan pola pengeluaran yang sehat'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
                  <p className="text-sm text-slate-300">
                    💰 Simpan 20% dari pemasukan untuk tabungan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}