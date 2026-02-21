'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface Income {
  id: string
  amount: number
  clientName: string
  date: string
}

export function IncomeList() {
  // TODO: Fetch from Supabase
  const incomes: Income[] = []

  return (
    <div className="space-y-4">
      {incomes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz gelir kaydı yok
          </CardContent>
        </Card>
      ) : (
        incomes.map((income: any) => (
          <Card key={income.id}>
            <CardContent className="p-4">
              {/* Income details */}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
