'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'

export function HearingsList() {
  // TODO: Fetch from Supabase
  const hearings = []

  return (
    <div className="space-y-4">
      {hearings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Henüz duruşma kaydı yok
          </CardContent>
        </Card>
      ) : (
        hearings.map((hearing: any) => (
          <Card key={hearing.id}>
            <CardContent className="p-4">
              {/* Hearing details */}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
