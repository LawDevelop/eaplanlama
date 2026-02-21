'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import { useHearings } from '@/hooks/use-supabase-data'

export function HearingsList() {
  const { hearings, loading } = useHearings()

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Yükleniyor...
          </CardContent>
        </Card>
      </div>
    )
  }

  const upcomingHearings = hearings
    .filter(h => h.status === 'scheduled')
    .sort((a, b) => new Date(a.hearing_date).getTime() - new Date(b.hearing_date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {upcomingHearings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz duruşma kaydı yok
          </CardContent>
        </Card>
      ) : (
        upcomingHearings.map((hearing) => {
          const time = hearing.time ? new Date(hearing.time).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : ''
          return (
            <Card key={hearing.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold">{hearing.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {hearing.client_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {hearing.court_name}
                    </div>
                    {hearing.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" />
                        {hearing.location}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {time && (
                      <div className="text-2xl font-bold text-primary">
                        {time}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(hearing.hearing_date).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
