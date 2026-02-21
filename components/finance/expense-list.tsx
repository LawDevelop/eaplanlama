'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Financial } from '@/hooks/use-supabase-data'

interface ExpenseListProps {
  limit?: number
}

export function ExpenseList({ limit }: ExpenseListProps) {
  // Bu component henüz tam implementasyon gerektiriyor
  // useFinancials hook'u kullanilabilir
  const expenses: Financial[] = []

  const displayExpenses = limit ? expenses.slice(0, limit) : expenses

  return (
    <div className="space-y-4">
      {displayExpenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz gider kaydı yok
          </CardContent>
        </Card>
      ) : (
        displayExpenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{expense.description || expense.category}</div>
                  <div className="text-sm text-muted-foreground">{expense.category}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(expense.transaction_date)}
                  </div>
                </div>
                <div className="text-red-600 font-semibold">
                  -{formatCurrency(expense.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
