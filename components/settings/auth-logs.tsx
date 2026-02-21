'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

interface AuthLog {
  id: string
  action: string
  created_at: string
}

export function AuthLogs() {
  // TODO: Fetch from Supabase
  const logs: AuthLog[] = []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giriş Logları</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Henüz log kaydı yok
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border text-sm"
              >
                <div className="font-medium">{log.action}</div>
                <div className="text-muted-foreground">
                  {formatDateTime(log.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
