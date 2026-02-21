'use client'

import { useState } from 'react'
import { Plus, Search, User, Building2, Phone, Mail, FileText, TrendingUp, Users, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: string
  name: string
  client_type: 'individual' | 'corporate'
  phone?: string
  email?: string
  total_cases?: number
  active_cases?: number
  total_paid?: number
  total_debt?: number
  total_hearings?: number
  status: 'active' | 'inactive' | 'archived'
}

const mockClients: Client[] = []

export function ClientsView() {
  const clients = mockClients
  const [loading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'corporate'>('all')

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || client.client_type === filterType
    return matchesSearch && matchesType
  })

  const activeCount = clients.filter(c => c.status === 'active').length
  const totalCases = clients.reduce((sum, c) => sum + (c.total_cases || 0), 0)
  const totalPaid = clients.reduce((sum, c) => sum + (c.total_paid || 0), 0)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 mb-6"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="w-8 h-8" />
                Müvekkiller
              </h1>
              <p className="text-white/80">
                {clients.length} müvekkil • {activeCount} aktif
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-violet-600 hover:bg-white/90 shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Müvekkil
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-24 lg:pb-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{clients.length}</div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-sm text-muted-foreground">Aktif</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalCases}</div>
                <div className="text-sm text-muted-foreground">Dava</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-4 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">₺{(totalPaid / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Toplam Ödeme</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Müvekkil ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterType('all')}
                variant={filterType === 'all' ? 'default' : 'outline'}
                className={filterType === 'all' ? 'bg-violet-500 hover:bg-violet-600' : ''}
              >
                Tümü
              </Button>
              <Button
                onClick={() => setFilterType('individual')}
                variant={filterType === 'individual' ? 'default' : 'outline'}
                className={filterType === 'individual' ? 'bg-violet-500 hover:bg-violet-600' : ''}
              >
                <User className="w-4 h-4 mr-1" />
                Bireysel
              </Button>
              <Button
                onClick={() => setFilterType('corporate')}
                variant={filterType === 'corporate' ? 'default' : 'outline'}
                className={filterType === 'corporate' ? 'bg-violet-500 hover:bg-violet-600' : ''}
              >
                <Building2 className="w-4 h-4 mr-1" />
                Kurumsal
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Clients List */}
        <div className="space-y-3">
          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-5">
                  <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                </Card>
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Müvekkil bulunamadı</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                İlk Müvekkipli Oluştur
              </Button>
            </Card>
          ) : (
            filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      client.client_type === 'individual' 
                        ? 'bg-blue-500/20' 
                        : 'bg-purple-500/20'
                    }`}>
                      {client.client_type === 'individual' ? (
                        <User className="w-7 h-7 text-blue-500" />
                      ) : (
                        <Building2 className="w-7 h-7 text-purple-500" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{client.name}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            {client.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                              </div>
                            )}
                            {client.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {client.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant={client.status === 'active' ? 'success' : 'neutral'}>
                          {client.status === 'active' ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-muted/50">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">Dosyalar</span>
                          </div>
                          <div className="font-bold">{client.total_cases || 0} <span className="text-sm font-normal text-muted-foreground">({client.active_cases || 0} aktif)</span></div>
                        </div>

                        <div className="p-3 rounded-xl bg-green-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Ödenen</span>
                          </div>
                          <div className="font-bold text-green-600">₺{(client.total_paid || 0).toLocaleString('tr-TR')}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-orange-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-600">Borç</span>
                          </div>
                          <div className="font-bold text-orange-600">₺{(client.total_debt || 0).toLocaleString('tr-TR')}</div>
                        </div>

                        <div className="p-3 rounded-xl bg-blue-500/10">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-600">Duruşma</span>
                          </div>
                          <div className="font-bold text-blue-600">{client.total_hearings || 0}</div>
                        </div>
                      </div>
                    </div>
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
