'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import type { Financial } from '@/hooks/use-supabase-data'

interface IncomeListProps {
  limit?: number
}

export function IncomeList({ limit }: IncomeListProps) {
  // Bu component henüz tam implementasyon gerektiriyor
  // useFinancials hook'u kullanilabilir
  const incomes: Financial[] = []

  const displayIncomes = limit ? incomes.slice(0, limit) : incomes

  return (
    <div className="space-y-4">
      {displayIncomes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz gelir kaydı yok
          </CardContent>
        </Card>
      ) : (
        displayIncomes.map((income) => (
          <Card key={income.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{income.description || income.category}</span>
                    {income.invoice_issued === false && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {income.client_name || '-'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(income.transaction_date)}
                  </div>
                </div>
                <div className="text-green-600 font-semibold text-lg">
                  +{formatCurrency(income.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
