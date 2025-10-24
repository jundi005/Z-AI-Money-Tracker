'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  Coffee, 
  Wallet, 
  ShoppingCart, 
  Gamepad2, 
  BookOpen, 
  Heart, 
  Gift, 
  Music,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
  showHeader?: boolean
  showViewAll?: boolean
  onViewAll?: () => void
}

const categoryIcons: Record<string, any> = {
  food: Coffee,
  transport: Wallet,
  entertainment: Gamepad2,
  shopping: ShoppingCart,
  education: BookOpen,
  health: Heart,
  gift: Gift,
  music: Music,
  salary: Wallet,
  allowance: Wallet,
  freelance: Wallet,
  other: Wallet
}

const categoryColors: Record<string, string> = {
  food: 'bg-orange-500',
  transport: 'bg-blue-500',
  entertainment: 'bg-purple-500',
  shopping: 'bg-pink-500',
  education: 'bg-green-500',
  health: 'bg-red-500',
  gift: 'bg-yellow-500',
  music: 'bg-indigo-500',
  salary: 'bg-green-500',
  allowance: 'bg-blue-500',
  freelance: 'bg-purple-500',
  other: 'bg-gray-500'
}

const categoryNames: Record<string, string> = {
  food: 'Makanan',
  transport: 'Transportasi',
  entertainment: 'Hiburan',
  shopping: 'Belanja',
  education: 'Pendidikan',
  health: 'Kesehatan',
  gift: 'Hadiah',
  music: 'Musik',
  salary: 'Gaji',
  allowance: 'Uang Saku',
  freelance: 'Freelance',
  other: 'Lainnya'
}

export function TransactionList({ 
  transactions, 
  showHeader = true, 
  showViewAll = true,
  onViewAll 
}: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = transactions.filter(transaction => 
    filter === 'all' || transaction.type === filter
  )

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
            {showViewAll && onViewAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewAll}
                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700"
              >
                Lihat semua
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 mt-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white border-slate-600 text-slate-300"
            >
              Semua
            </Button>
            <Button
              variant={filter === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('income')}
              className="text-xs text-green-400 hover:text-green-300 border-slate-600 hover:bg-slate-700"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Pemasukan
            </Button>
            <Button
              variant={filter === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('expense')}
              className="text-xs text-red-400 hover:text-red-300 border-slate-600 hover:bg-slate-700"
            >
              <TrendingDown className="w-3 h-3 mr-1" />
              Pengeluaran
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada transaksi</p>
            <p className="text-sm">Tambahkan transaksi pertamamu!</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {sortedDates.map(date => (
              <div key={date} className="border-b last:border-b-0">
                <div className="px-4 py-2 bg-slate-700/50">
                  <p className="text-xs font-medium text-slate-300">
                    {format(new Date(date), 'EEEE, d MMMM yyyy', { locale: id })}
                  </p>
                </div>
                {groupedTransactions[date].map(transaction => {
                  const Icon = categoryIcons[transaction.category] || Wallet
                  const isIncome = transaction.type === 'income'
                  
                  return (
                    <div
                      key={transaction.id}
                      className="px-4 py-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${categoryColors[transaction.category]} bg-opacity-20 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${transaction.category === 'food' ? 'orange' : transaction.category === 'transport' ? 'blue' : 'purple'}-400`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">
                            {categoryNames[transaction.category] || transaction.category}
                          </p>
                          {transaction.description && (
                            <p className="text-xs text-slate-400">
                              {transaction.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                          {isIncome ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}