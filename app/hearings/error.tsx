'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function HearingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Hearings Error:', error)
  }, [error])

  return (
    <div className="min-h-screen pb-24 flex items-center justify-center p-4">
      <div className="elite-card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Duruşmalar Yüklenemedi</h2>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">
          {error.message || 'Duruşmalar sayfası yüklenirken bir hata oluştu'}
        </p>
        <div className="flex gap-3">
          <Link href="/" className="elite-btn-secondary flex-1">
            Ana Sayfa
          </Link>
          <button
            onClick={reset}
            className="elite-btn-primary flex-1"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    </div>
  )
}
