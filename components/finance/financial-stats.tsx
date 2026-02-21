'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useFinancials } from '@/hooks/use-supabase-data'

export function FinancialStats() {
  const { financials, loading } = useFinancials()
  
  const totalIncome = financials
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0)
  
  const totalExpense = financials
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0)
  
  const balance = totalIncome - totalExpense

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-4 text-muted-foreground">Yükleniyor...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-green-500/10">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Toplam Gelir</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/10">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Toplam Gider</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpense)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Bakiye</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
