'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Plus, 
  Trash2, 
  Wallet, 
  Coffee, 
  Gamepad2, 
  ShoppingCart, 
  BookOpen, 
  Heart, 
  Gift, 
  Music,
  Edit2,
  Check,
  AlertTriangle
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  isDefault: boolean
  transactionCount?: number
}

interface CategoryManagerProps {
  onClose: () => void
  onSuccess: () => void
}

const defaultIcons = [
  { name: 'wallet', icon: Wallet, color: 'bg-blue-500' },
  { name: 'coffee', icon: Coffee, color: 'bg-orange-500' },
  { name: 'gamepad2', icon: Gamepad2, color: 'bg-purple-500' },
  { name: 'shopping-cart', icon: ShoppingCart, color: 'bg-pink-500' },
  { name: 'book-open', icon: BookOpen, color: 'bg-green-500' },
  { name: 'heart', icon: Heart, color: 'bg-red-500' },
  { name: 'gift', icon: Gift, color: 'bg-yellow-500' },
  { name: 'music', icon: Music, color: 'bg-indigo-500' }
]

const defaultCategories = [
  { id: 'food', name: 'Makanan', icon: 'coffee', color: 'bg-orange-500', isDefault: true },
  { id: 'transport', name: 'Transportasi', icon: 'wallet', color: 'bg-blue-500', isDefault: true },
  { id: 'entertainment', name: 'Hiburan', icon: 'gamepad2', color: 'bg-purple-500', isDefault: true },
  { id: 'shopping', name: 'Belanja', icon: 'shopping-cart', color: 'bg-pink-500', isDefault: true },
  { id: 'education', name: 'Pendidikan', icon: 'book-open', color: 'bg-green-500', isDefault: true },
  { id: 'health', name: 'Kesehatan', icon: 'heart', color: 'bg-red-500', isDefault: true },
  { id: 'gift', name: 'Hadiah', icon: 'gift', color: 'bg-yellow-500', isDefault: true },
  { id: 'music', name: 'Musik', icon: 'music', color: 'bg-indigo-500', isDefault: true }
]

export function CategoryManager({ onClose, onSuccess }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(defaultIcons[0])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          icon: selectedIcon.name,
          color: selectedIcon.color
        }),
      })

      if (response.ok) {
        setNewCategoryName('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to add category:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua transaksi dengan kategori ini akan dihapus.')) {
      return
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  const handleEditCategory = async (categoryId: string) => {
    if (!editName.trim()) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim()
        }),
      })

      if (response.ok) {
        setEditingCategory(null)
        setEditName('')
        fetchCategories()
      }
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category.id)
    setEditName(category.name)
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditName('')
  }

  const getIconComponent = (iconName: string) => {
    const iconData = defaultIcons.find(i => i.name === iconName)
    return iconData ? iconData.icon : Wallet
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700 text-white max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Kelola Kategori</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Category */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Tambah Kategori Baru</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="categoryName" className="text-slate-300">Nama Kategori</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Masukkan nama kategori"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                />
              </div>
              
              <div>
                <Label className="text-slate-300">Pilih Icon</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {defaultIcons.map((icon) => {
                    const IconComponent = icon.icon
                    return (
                      <Button
                        key={icon.name}
                        variant={selectedIcon.name === icon.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedIcon(icon)}
                        className={`h-12 flex flex-col gap-1 ${selectedIcon.name === icon.name ? 'bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs capitalize">{icon.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isLoading ? 'Menambahkan...' : 'Tambah Kategori'}
              </Button>
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Daftar Kategori</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const IconComponent = getIconComponent(category.icon)
                const isEditing = editingCategory === category.id
                
                return (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${category.isDefault ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-700 border-slate-600'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${category.color} bg-opacity-20 flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-slate-600 border-slate-500 text-white h-8 w-40"
                              onKeyPress={(e) => e.key === 'Enter' && handleEditCategory(category.id)}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleEditCategory(category.id)}
                              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-sm">{category.name}</p>
                            <div className="flex items-center gap-2">
                              {category.isDefault && (
                                <Badge variant="secondary" className="text-xs bg-blue-600/20 text-blue-300 border-blue-600/30">
                                  Default
                                </Badge>
                              )}
                              {category.transactionCount !== undefined && category.transactionCount > 0 && (
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  {category.transactionCount} transaksi
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(category)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        {!category.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            disabled={category.transactionCount !== undefined && category.transactionCount > 0}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                        {category.transactionCount !== undefined && category.transactionCount > 0 && !category.isDefault && (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-yellow-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Kategori default tidak dapat dihapus</p>
            <p>• Kategori dengan transaksi tidak dapat dihapus</p>
            <p>• Icon dan warna kategori dapat disesuaikan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}