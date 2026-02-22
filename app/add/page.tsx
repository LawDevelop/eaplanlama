'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddTaskForm } from '@/components/forms/add-task-form'
import { AddHearingForm } from '@/components/forms/add-hearing-form'
import { AddFinancialForm } from '@/components/forms/add-financial-form'
import { AddFileForm } from '@/components/forms/add-file-form'
import { useHearings } from '@/hooks/use-supabase-data'
import { useRouter } from 'next/navigation'

export default function AddPage() {
  const { createHearing } = useHearings()
  const router = useRouter()

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Yeni Ekle</h1>
      
      <Tabs defaultValue="task" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="task">Görev</TabsTrigger>
          <TabsTrigger value="hearing">Duruşma</TabsTrigger>
          <TabsTrigger value="financial">Finans</TabsTrigger>
          <TabsTrigger value="file">Dosya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="task" className="mt-6">
          <AddTaskForm />
        </TabsContent>
        
        <TabsContent value="hearing" className="mt-6">
          <AddHearingForm 
            onSubmit={async (data) => {
              await createHearing({
                title: data.title,
                client_name: data.clientName,
                court_name: data.courtName,
                hearing_date: data.hearingDate,
                location: data.location,
                time: data.hearingTime,
                file_number: data.fileNumber,
              })
              router.push('/hearings')
            }}
            onCancel={() => router.push('/hearings')}
          />
        </TabsContent>
        
        <TabsContent value="financial" className="mt-6">
          <AddFinancialForm />
        </TabsContent>
        
        <TabsContent value="file" className="mt-6">
          <AddFileForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
