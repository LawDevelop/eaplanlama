'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, AlertCircle, Receipt, DollarSign, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddFinanceModal } from '@/components/modals/add-finance-modal'
import { useFinancials } from '@/hooks/use-supabase-data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function FinanceView() {
  const { financials, loading, createFinancial } = useFinancials()
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')
  const [showAddModal, setShowAddModal] = useState(false)

  const incomes = financials.filter(f => f.type === 'income')
  const expenses = financials.filter(f => f.type === 'expense')
  const totalIncome = incomes.reduce((sum, item) => sum + (item.amount || 0), 0)
  const totalExpense = expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
  const netBalance = totalIncome - totalExpense

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 mb-6"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                Finans Yönetimi
              </h1>
              <p className="text-white/80">
                Gelir ve giderlerinizi takip edin
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              size="lg"
              className="bg-white text-emerald-600 hover:bg-white/90 shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni İşlem
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-24 lg:pb-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Toplam Gelir</div>
                <div className="text-2xl font-bold text-green-500">
                  ₺{totalIncome.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Toplam Gider</div>
                <div className="text-2xl font-bold text-red-500">
                  ₺{totalExpense.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Net Bakiye</div>
                <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₺{netBalance.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-2 mb-6 flex gap-2"
        >
          <Button
            onClick={() => setActiveTab('income')}
            variant={activeTab === 'income' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'income' ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Gelirler ({incomes.length})
          </Button>
          <Button
            onClick={() => setActiveTab('expense')}
            variant={activeTab === 'expense' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'expense' ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Giderler ({expenses.length})
          </Button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {loading ? (
              <div className="grid gap-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-5">
                    <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
                  </Card>
                ))}
              </div>
            ) : (activeTab === 'income' ? incomes : expenses).length === 0 ? (
              <Card className="p-12 text-center">
                <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'income' ? 'Gelir kaydı bulunamadı' : 'Gider kaydı bulunamadı'}
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk İşlemi Ekle
                </Button>
              </Card>
            ) : (
              (activeTab === 'income' ? incomes : expenses).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {item.client_name || item.category || 'İşlem'}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.file_number && (
                          <p className="text-sm text-muted-foreground">Dosya: {item.file_number}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          activeTab === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {activeTab === 'income' ? '+' : '-'}₺{(item.amount || 0).toLocaleString('tr-TR')}
                        </div>
                        {item.transaction_date && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(item.transaction_date).toLocaleDateString('tr-TR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Finance Modal */}
      <AddFinanceModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        defaultType={activeTab}
      />
    </div>
  )
}
