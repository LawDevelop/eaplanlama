'use client'

import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

export function FinancialSummary() {
  // TODO: Fetch from Supabase
  const summary = {
    monthlyIncome: 150000,
    monthlyExpense: 45000,
    pendingInvoices: 3,
  }

  const netIncome = summary.monthlyIncome - summary.monthlyExpense

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
                {formatCurrency(summary.monthlyIncome)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Gider</span>
              </div>
              <div className="text-lg font-bold truncate">
                {formatCurrency(summary.monthlyExpense)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Net Gelir</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 truncate">
              {formatCurrency(netIncome)}
            </div>
          </div>

          {summary.pendingInvoices > 0 && (
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Fatura Bekleyenler</div>
                  <div className="text-xs">
                    {summary.pendingInvoices} tahsilat için fatura kesilmeli
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
