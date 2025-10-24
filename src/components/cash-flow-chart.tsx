'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar, BarChart3, LineChart as LineChartIcon } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

interface CashFlowChartProps {
  transactions: Transaction[]
}

interface ChartData {
  date: string
  income: number
  expense: number
  net: number
}

export function CashFlowChart({ transactions }: CashFlowChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    processData()
  }, [transactions, timeRange])

  const processData = () => {
    const now = new Date()
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Group transactions by date
    const groupedData: Record<string, { income: number; expense: number }> = {}
    
    // Initialize all dates in range with 0 values
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      groupedData[dateStr] = { income: 0, expense: 0 }
    }

    // Sum transactions by date
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date)
      if (transactionDate >= startDate && transactionDate <= now) {
        const dateStr = transaction.date.split('T')[0]
        if (groupedData[dateStr]) {
          if (transaction.type === 'income') {
            groupedData[dateStr].income += transaction.amount
          } else {
            groupedData[dateStr].expense += transaction.amount
          }
        }
      }
    })

    // Convert to chart data format
    const data: ChartData[] = Object.entries(groupedData).map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: timeRange === '7d' ? 'short' : 'numeric' 
      }),
      income: values.income,
      expense: values.expense,
      net: values.income - values.expense
    }))

    setChartData(data)
  }

  const totalIncome = chartData.reduce((sum, item) => sum + item.income, 0)
  const totalExpense = chartData.reduce((sum, item) => sum + item.expense, 0)
  const netCashFlow = totalIncome - totalExpense

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: Rp {entry.value.toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400">Total Pemasukan</span>
            </div>
            <p className="text-lg font-bold text-green-300">
              Rp {totalIncome.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">Total Pengeluaran</span>
            </div>
            <p className="text-lg font-bold text-red-300">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400">Arus Kas Netto</span>
            </div>
            <p className={`text-lg font-bold ${netCashFlow >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
              {netCashFlow >= 0 ? '+' : ''}Rp {netCashFlow.toLocaleString('id-ID')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Arus Kas
            </CardTitle>
            <div className="flex gap-2">
              <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
                <Button
                  variant={timeRange === '7d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                  className="text-xs h-7 px-2 data-[state=active]:bg-blue-600"
                >
                  7H
                </Button>
                <Button
                  variant={timeRange === '30d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                  className="text-xs h-7 px-2 data-[state=active]:bg-blue-600"
                >
                  30H
                </Button>
                <Button
                  variant={timeRange === '90d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                  className="text-xs h-7 px-2 data-[state=active]:bg-blue-600"
                >
                  90H
                </Button>
              </div>
              <div className="flex gap-1 bg-slate-700 rounded-lg p-1">
                <Button
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="text-xs h-7 px-2 data-[state=active]:bg-blue-600"
                >
                  <LineChartIcon className="w-3 h-3" />
                </Button>
                <Button
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="text-xs h-7 px-2 data-[state=active]:bg-blue-600"
                >
                  <BarChart3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Pemasukan"
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Pengeluaran"
                    dot={{ fill: '#ef4444', r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Arus Kas Netto"
                    dot={{ fill: '#3b82f6', r: 3 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Pemasukan" />
                  <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Insights Arus Kas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
              <p className="text-sm text-slate-300">
                {netCashFlow >= 0 
                  ? `✨ Arus kas positif sebesar Rp ${netCashFlow.toLocaleString('id-ID')} dalam ${timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} hari terakhir`
                  : `⚠️ Arus kas negatif sebesar Rp ${Math.abs(netCashFlow).toLocaleString('id-ID')} dalam ${timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} hari terakhir`
                }
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5" />
              <p className="text-sm text-slate-300">
                📈 Rata-rata pemasukan harian: Rp {Math.round(totalIncome / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5" />
              <p className="text-sm text-slate-300">
                📉 Rata-rata pengeluaran harian: Rp {Math.round(totalExpense / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90)).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}