'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, AlertCircle, Receipt } from 'lucide-react'
import { motion } from 'framer-motion'
import { AddFinanceModal } from '@/components/modals/add-finance-modal'

const mockIncomes = [
  {
    id: '1',
    clientName: 'Ahmet Yılmaz',
    fileNumber: '2024/100',
    amount: 50000,
    totalAgreed: 100000,
    totalReceived: 50000,
    invoiceIssued: false,
    transactionDate: '2024-02-15',
  },
  {
    id: '2',
    clientName: 'Zeynep Kara',
    fileNumber: '2024/101',
    amount: 30000,
    totalAgreed: 30000,
    totalReceived: 30000,
    invoiceIssued: false,
    transactionDate: '2024-02-10',
  },
]

const mockExpenses = [
  {
    id: '1',
    category: 'Kira',
    amount: 15000,
    description: 'Ofis kirası',
    transactionDate: '2024-02-01',
  },
  {
    id: '2',
    category: 'Harçlar',
    amount: 2500,
    description: 'Mahkeme harçları',
    transactionDate: '2024-02-12',
  },
]

export function FinanceView() {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income')
  const [showAddModal, setShowAddModal] = useState(false)

  const totalIncome = mockIncomes.reduce((sum, item) => sum + item.amount, 0)
  const totalExpense = mockExpenses.reduce((sum, item) => sum + item.amount, 0)
  const pendingInvoices = mockIncomes.filter(i => !i.invoiceIssued).length

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Finans</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Gelir ve giderlerinizi yönetin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="elite-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Gelir</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ₺{totalIncome.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </div>

          <div className="elite-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Gider</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ₺{totalExpense.toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </div>

          <div className="elite-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">Net</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ₺{(totalIncome - totalExpense).toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Warning */}
        {pendingInvoices > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="elite-card p-4 mb-6 bg-orange-500/10 border-orange-500/20"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-orange-600 dark:text-orange-400 mb-1">
                  Fatura Hatırlatması
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {pendingInvoices} adet tahsilat için fatura kesilmesi gerekiyor
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'income'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            Gelirler
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              activeTab === 'expense'
                ? 'gradient-primary text-white shadow-lg'
                : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            Giderler
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {activeTab === 'income' ? (
            mockIncomes.map((income, index) => (
              <motion.div
                key={income.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="elite-card p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{income.clientName}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Dosya: {income.fileNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₺{income.amount.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                      {new Date(income.transactionDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>

                {income.totalAgreed && (
                  <div className="pt-3 border-t border-[hsl(var(--card-border))]">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[hsl(var(--muted-foreground))]">Anlaşılan</span>
                      <span className="font-medium">₺{income.totalAgreed.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[hsl(var(--muted-foreground))]">Alınan</span>
                      <span className="font-medium text-green-600">₺{income.totalReceived.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[hsl(var(--muted-foreground))]">Kalan</span>
                      <span className="font-medium text-orange-600">
                        ₺{(income.totalAgreed - income.totalReceived).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                )}

                {!income.invoiceIssued && (
                  <div className="mt-3 px-3 py-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Fatura kesilmedi
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            mockExpenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="elite-card p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{expense.category}</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {expense.description}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                      {new Date(expense.transactionDate).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₺{expense.amount.toLocaleString('tr-TR')}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Add Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-24 lg:bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 gradient-primary rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white z-40"
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>

        {/* Add Finance Modal */}
        <AddFinanceModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)}
          defaultType={activeTab}
        />
      </div>
    </div>
  )
}
