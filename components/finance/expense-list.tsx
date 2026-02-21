'use client'

import { Card, CardContent } from '@/components/ui/card'

export function ExpenseList() {
  // TODO: Fetch from Supabase
  const expenses = []

  return (
    <div className="space-y-4">
      {expenses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz gider kaydı yok
          </CardContent>
        </Card>
      ) : (
        expenses.map((expense: any) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              {/* Expense details */}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
