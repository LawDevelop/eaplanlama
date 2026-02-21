'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useHearings } from '@/hooks/use-supabase-data'

export function TodayHearings() {
  const { hearings, loading } = useHearings()
  
  // Bugünün duruşmaları
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  
  const todayHearings = hearings.filter(h =>
    h.hearing_date.startsWith(todayStr) && h.status === 'scheduled'
  )

  if (loading) {
    return null
  }

  if (todayHearings.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            Bugünkü Duruşmalar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayHearings.map((hearing) => {
            const time = hearing.time ? new Date(hearing.time).toLocaleTimeString('tr-TR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''
            return (
              <div
                key={hearing.id}
                className="p-4 rounded-2xl bg-background border border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold">{hearing.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {hearing.client_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {hearing.court_name}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-3 h-3" />
                      {hearing.location || 'Belirtilmemiş'}
                    </div>
                  </div>
                  {time && (
                    <div className="text-2xl font-bold text-primary">
                      {time}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}
