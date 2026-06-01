import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ConfidenceBar } from '@/components/ui/ConfidenceBar'

export default async function RecentPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: detections } = await supabase
    .from('verse_detections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-navy-900">Recent Detections</h1>
          <p className="text-gray-500 mt-1">{detections?.length ?? 0} detections total</p>
        </div>
      </div>

      {(!detections || detections.length === 0) ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No detections yet</h3>
          <p className="text-gray-400">Go to Live Detection and speak some Bible references.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {detections.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy-900 text-lg">{d.detected_reference}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {d.raw_transcript ? `"${d.raw_transcript}"` : 'Manual search'}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant="default">{d.version}</Badge>
                <div className="w-20 hidden sm:block">
                  <ConfidenceBar confidence={d.confidence ?? 0} showLabel={false} />
                </div>
                <span className="text-xs text-gray-400 hidden md:block">
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
