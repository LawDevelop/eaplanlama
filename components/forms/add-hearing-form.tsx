'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function AddHearingForm() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hearingTitle">Dava Başlığı</Label>
          <Input id="hearingTitle" placeholder="Dava başlığı girin" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingClient">Müvekkil Adı</Label>
          <Input id="hearingClient" placeholder="Müvekkil adı" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingFileNumber">Dosya/Esas No</Label>
          <Input id="hearingFileNumber" placeholder="Dosya numarası" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="courtName">Mahkeme</Label>
          <Input id="courtName" placeholder="Mahkeme adı (örn: Ankara 5. Aile Mahkemesi)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingDate">Duruşma Tarihi</Label>
          <Input id="hearingDate" type="date" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingTime">Duruşma Saati</Label>
          <Input id="hearingTime" type="time" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingLocation">Salon</Label>
          <Input id="hearingLocation" placeholder="Salon no (opsiyonel)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingType">Duruşma Türü</Label>
          <select
            id="hearingType"
            className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="first">İlk Duruşma</option>
            <option value="continuation">Ara Duruşma</option>
            <option value="expert">Bilirkişi</option>
            <option value="witness">Tanık Dinleme</option>
            <option value="final">Karar Duruşması</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingNotes">Notlar</Label>
          <textarea
            id="hearingNotes"
            placeholder="Duruşma ile ilgili notlar (opsiyonel)"
            className="flex min-h-[80px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button className="w-full">Duruşma Ekle</Button>
      </CardContent>
    </Card>
  )
}
