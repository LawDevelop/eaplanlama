'use client'

import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import { useFinancial } from '@/hooks/use-supabase-data'

export function FinancialSummary() {
  const { financials, loading } = useFinancial()
  
  // Bu ayin gelir ve giderleri
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const monthlyData = financials.filter(f => {
    const date = new Date(f.transaction_date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })
  
  const monthlyIncome = monthlyData
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0)
  
  const monthlyExpense = monthlyData
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0)
  
  const pendingInvoices = financials.filter(f => 
    f.type === 'income' && f.invoice_issued === false
  ).length

  const netIncome = monthlyIncome - monthlyExpense

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="elite-card p-5">
          <h2 className="text-lg font-semibold mb-4">Aylık Finansal Özet</h2>
          <div className="text-center py-4 text-muted-foreground">Yükleniyor...</div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="elite-card p-5">
        <h2 className="text-lg font-semibold mb-4">Aylık Finansal Özet</h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Gelir</span>
              </div>
              <div className="text-lg font-bold truncate">
                {formatCurrency(monthlyIncome)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Gider</span>
              </div>
              <div className="text-lg font-bold truncate">
                {formatCurrency(monthlyExpense)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Net Gelir</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 truncate">
              {formatCurrency(netIncome)}
            </div>
          </div>

          {pendingInvoices > 0 && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Fatura Bekleyenler</div>
                  <div className="text-xs">
                    {pendingInvoices} tahsilat için fatura kesilmeli
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
