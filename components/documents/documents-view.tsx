'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Download, Trash2, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

const mockDocuments = [
  {
    id: '1',
    fileName: 'Dilekçe_2024_123.pdf',
    fileSize: 245000,
    uploadDate: '2024-02-15',
    relatedClient: 'Mehmet Demir',
    relatedFileNumber: '2024/123',
  },
  {
    id: '2',
    fileName: 'Belge_Toplama.pdf',
    fileSize: 1200000,
    uploadDate: '2024-02-10',
    relatedClient: 'Ayşe Kaya',
    relatedFileNumber: '2024/124',
  },
]

export function DocumentsView() {
  const [searchQuery, setSearchQuery] = useState('')

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">Belgeler</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Tüm belgelerinizi yönetin</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Belge ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="elite-input pl-12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="elite-card p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate mb-1">{doc.fileName}</h3>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                    {formatFileSize(doc.fileSize)}
                  </p>
                  {doc.relatedClient && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      {doc.relatedClient} • {doc.relatedFileNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 elite-btn-secondary text-sm py-2">
                  <Download className="w-4 h-4 inline mr-1" />
                  İndir
                </button>
                <button className="px-3 py-2 rounded-xl bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/20 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 lg:bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 gradient-primary rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white z-40"
        >
          <Upload className="w-6 h-6 md:w-8 md:h-8" />
        </motion.button>
      </div>
    </div>
  )
}
