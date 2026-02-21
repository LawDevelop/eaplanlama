'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Download, Trash2, Upload, File, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Document {
  id: string
  file_name: string
  file_size: number
  upload_date: string
  client_name?: string
  file_number?: string
  file_type: string
}

const mockDocuments: Document[] = []

export function DocumentsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const documents = mockDocuments

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return '📄'
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return '🖼️'
    if (['doc', 'docx'].includes(ext || '')) return '📝'
    return '📁'
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600 mb-6"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <FolderOpen className="w-8 h-8" />
                Belgeler
              </h1>
              <p className="text-white/80">
                Tüm belgelerinizi tek yerden yönetin
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-rose-600 hover:bg-white/90 shadow-xl"
            >
              <Upload className="w-5 h-5 mr-2" />
              Belge Yükle
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-24 lg:pb-6 max-w-7xl">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{documents.length}</div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <File className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {documents.filter(d => d.file_name.endsWith('.pdf')).length}
                </div>
                <div className="text-sm text-muted-foreground">PDF</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {documents.filter(d => d.file_name.match(/\.(doc|docx)$/i)).length}
                </div>
                <div className="text-sm text-muted-foreground">Word</div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(documents.reduce((sum, d) => sum + d.file_size, 0) / (1024 * 1024)).toFixed(1)} MB
                </div>
                <div className="text-sm text-muted-foreground">Boyut</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Belge ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-background"
            />
          </div>
        </motion.div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Henüz belge yüklenmemiş</p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                İlk Belgeyi Yükle
              </Button>
            </Card>
          ) : (
            documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-3xl">
                      {getFileIcon(doc.file_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate mb-1">{doc.file_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(doc.file_size)}
                      </p>
                    </div>
                  </div>
                  
                  {doc.client_name && (
                    <div className="mb-4 p-3 rounded-xl bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">İlişkili</div>
                      <div className="font-medium">{doc.client_name}</div>
                      {doc.file_number && (
                        <div className="text-sm text-muted-foreground">{doc.file_number}</div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      İndir
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
