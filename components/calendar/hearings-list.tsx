'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'

interface Hearing {
  id: string
  title: string
  clientName: string
  courtName: string
  date: string
  time: string
  location?: string
}

export function HearingsList() {
  // TODO: Fetch from Supabase
  const hearings: Hearing[] = []

  return (
    <div className="space-y-4">
      {hearings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz duruşma kaydı yok
          </CardContent>
        </Card>
      ) : (
        hearings.map((hearing) => (
          <Card key={hearing.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">{hearing.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {hearing.clientName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hearing.courtName}
                  </div>
                  {hearing.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3" />
                      {hearing.location}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {hearing.time}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(hearing.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
