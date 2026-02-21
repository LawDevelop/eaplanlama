'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bildirim Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notificationTime">Günlük Bildirim Saati</Label>
          <Input id="notificationTime" type="time" defaultValue="10:00" />
          <p className="text-sm text-muted-foreground">
            Her gün bu saatte günlük görevler ve duruşmalar bildirilir
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hearingReminder">Duruşma Hatırlatma (Saat Önce)</Label>
          <Input id="hearingReminder" type="number" defaultValue="24" />
          <p className="text-sm text-muted-foreground">
            Duruşmadan kaç saat önce hatırlatma gönderilsin
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoiceReminder">Fatura Hatırlatma (Gün Önce)</Label>
          <Input id="invoiceReminder" type="number" defaultValue="3" />
          <p className="text-sm text-muted-foreground">
            Ay sonundan kaç gün önce fatura hatırlatması gönderilsin
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="telegramEnabled"
            defaultChecked
            className="rounded"
          />
          <Label htmlFor="telegramEnabled">Telegram bildirimleri aktif</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="emailEnabled"
            defaultChecked
            className="rounded"
          />
          <Label htmlFor="emailEnabled">E-posta bildirimleri aktif</Label>
        </div>

        <Button className="w-full">Ayarları Kaydet</Button>
      </CardContent>
    </Card>
  )
}
