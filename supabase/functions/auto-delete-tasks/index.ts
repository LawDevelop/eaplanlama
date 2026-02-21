// Çöp kutusundaki görevleri otomatik sil (7 gün sonra)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 7 gün geçmiş silinen görevleri bul ve kalıcı sil
    const { data: tasksToDelete, error: fetchError } = await supabaseClient
      .from('tasks')
      .select('id, title')
      .eq('deleted', true)
      .lte('permanent_delete_at', new Date().toISOString())

    if (fetchError) {
      throw fetchError
    }

    if (tasksToDelete && tasksToDelete.length > 0) {
      // Görevleri kalıcı sil
      const { error: deleteError } = await supabaseClient
        .from('tasks')
        .delete()
        .in('id', tasksToDelete.map(t => t.id))

      if (deleteError) {
        throw deleteError
      }

      console.log(`${tasksToDelete.length} görev kalıcı olarak silindi`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: tasksToDelete?.length || 0,
        message: `${tasksToDelete?.length || 0} görev kalıcı olarak silindi`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
