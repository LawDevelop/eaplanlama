'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export function TodayHearings() {
  // TODO: Fetch from Supabase
  const hearings = [
    {
      id: '1',
      title: 'Boşanma Davası',
      clientName: 'Ahmet Yılmaz',
      courtName: 'Ankara 5. Aile Mahkemesi',
      time: '10:00',
      location: 'Salon 3',
    },
  ]

  if (hearings.length === 0) {
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
          {hearings.map((hearing) => (
            <div
              key={hearing.id}
              className="p-4 rounded-2xl bg-background border border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">{hearing.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {hearing.clientName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hearing.courtName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" />
                    {hearing.location}
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {hearing.time}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
