'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AddFinancialForm() {
  const [type, setType] = useState<'income' | 'expense'>('income')

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="income" className="flex-1">Gelir</TabsTrigger>
            <TabsTrigger value="expense" className="flex-1">Gider</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="incomeAmount">Tutar (TL)</Label>
              <Input id="incomeAmount" type="number" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeClient">Müvekkil Adı</Label>
              <Input id="incomeClient" placeholder="Müvekkil adı" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeFileNumber">Dosya No</Label>
              <Input id="incomeFileNumber" placeholder="Dosya numarası" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAgreed">Toplam Anlaşılan (Opsiyonel)</Label>
              <Input id="totalAgreed" type="number" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeDate">Tarih</Label>
              <Input id="incomeDate" type="date" />
            </div>

            <Button className="w-full">Gelir Ekle</Button>
          </TabsContent>

          <TabsContent value="expense" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Tutar (TL)</Label>
              <Input id="expenseAmount" type="number" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseCategory">Kategori</Label>
              <select
                id="expenseCategory"
                className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="rent">Kira</option>
                <option value="tax">Vergi</option>
                <option value="transport">Ulaşım</option>
                <option value="stationery">Kırtasiye</option>
                <option value="fees">Harçlar</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDescription">Açıklama</Label>
              <Input id="expenseDescription" placeholder="Gider açıklaması" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDate">Tarih</Label>
              <Input id="expenseDate" type="date" />
            </div>

            <Button className="w-full">Gider Ekle</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
