'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Wallet, ShoppingCart, Gamepad2, Coffee, BookOpen, Heart, Gift, Music } from 'lucide-react'

interface TransactionFormProps {
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
  { id: 'music', name: 'Musik', icon: Music, color: 'bg-indigo-500' },
  { id: 'salary', name: 'Gaji', icon: Wallet, color: 'bg-green-500' },
  { id: 'allowance', name: 'Uang Saku', icon: Wallet, color: 'bg-blue-500' },
  { id: 'freelance', name: 'Freelance', icon: Wallet, color: 'bg-purple-500' },
  { id: 'other', name: 'Lainnya', icon: Wallet, color: 'bg-gray-500' }
]

const incomeCategories = categories.filter(cat => ['salary', 'allowance', 'freelance', 'other'].includes(cat.id))
const expenseCategories = categories.filter(cat => !['salary', 'allowance', 'freelance'].includes(cat.id))

export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        }),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to create transaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tambah Transaksi</CardTitle>
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
            {/* Type Selection */}
            <div className="space-y-2">
              <Label className="text-slate-300">Tipe Transaksi</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, category: '' }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" className="text-green-500" />
                  <Label htmlFor="income" className="text-green-400 font-medium">Pemasukan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" className="text-red-500" />
                  <Label htmlFor="expense" className="text-red-400 font-medium">Pengeluaran</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-slate-300">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
                className="text-lg bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-slate-300">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300">Deskripsi</Label>
              <Input
                id="description"
                placeholder="Tambah catatan..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-300">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
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
                disabled={isLoading || !formData.amount || !formData.category}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}