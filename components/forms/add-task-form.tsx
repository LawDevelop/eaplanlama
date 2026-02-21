'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function AddTaskForm() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Görev Başlığı</Label>
          <Input id="title" placeholder="Görev başlığı girin" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client">Müvekkil Adı</Label>
          <Input id="client" placeholder="Müvekkil adı (opsiyonel)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileNumber">Dosya/Esas No</Label>
          <Input id="fileNumber" placeholder="Dosya numarası (opsiyonel)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Son Tarih</Label>
          <Input id="dueDate" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Öncelik</Label>
          <select
            id="priority"
            className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
            <option value="critical">Kritik</option>
          </select>
        </div>

        <Button className="w-full">Görev Ekle</Button>
      </CardContent>
    </Card>
  )
}
