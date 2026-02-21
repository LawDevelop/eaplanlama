'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export function AddFileForm() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Dosya Seç</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Dosya yüklemek için tıklayın
                </p>
              </div>
              <input id="file" type="file" className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileName">Dosya Adı</Label>
          <Input id="fileName" placeholder="Dosya adı" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileDescription">Açıklama</Label>
          <Input id="fileDescription" placeholder="Dosya açıklaması (opsiyonel)" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relatedClient">İlgili Müvekkil</Label>
          <Input id="relatedClient" placeholder="Müvekkil adı (opsiyonel)" />
        </div>

        <Button className="w-full">Dosya Yükle</Button>
      </CardContent>
    </Card>
  )
}
