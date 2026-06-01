import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mic, Monitor, Bookmark, Clock, Search, BookOpen, ChevronRight, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id)
    .single()

  const { data: recentDetections } = await supabase
    .from('verse_detections')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: savedVerses } = await supabase
    .from('saved_verses')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-900">
            Good to see you, {firstName}
          </h1>
          <p className="text-gray-500 mt-1">
            What Bible reference will you detect today?
          </p>
        </div>
        <div className="flex items-center gap-2 bg-navy-900 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          Free Plan
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/live"
          className="group relative bg-navy-900 rounded-3xl p-6 overflow-hidden hover:bg-navy-800 transition-colors"
        >
          <div className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Mic size={18} className="text-red-300 group-hover:animate-mic-pulse" />
          </div>
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-2">Primary</p>
          <h3 className="text-xl font-black text-white mb-1">Live Detection</h3>
          <p className="text-blue-200/60 text-sm">Start voice detection</p>
          <ChevronRight size={16} className="text-blue-300/40 mt-3" />
        </Link>

        <Link
          href="/display"
          className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="absolute top-4 right-4" />
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Monitor size={18} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-1">Display Mode</h3>
          <p className="text-gray-400 text-sm">Church projection</p>
          <ChevronRight size={16} className="text-gray-300 mt-3" />
        </Link>

        <Link
          href="/saved"
          className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
            <Bookmark size={18} className="text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-1">Saved Verses</h3>
          <p className="text-gray-400 text-sm">
            {savedVerses?.length ?? 0} verse{savedVerses?.length !== 1 ? 's' : ''} saved
          </p>
          <ChevronRight size={16} className="text-gray-300 mt-3" />
        </Link>

        <Link
          href="/recent"
          className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Clock size={18} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-1">Recent</h3>
          <p className="text-gray-400 text-sm">
            {recentDetections?.length ?? 0} recent detection{recentDetections?.length !== 1 ? 's' : ''}
          </p>
          <ChevronRight size={16} className="text-gray-300 mt-3" />
        </Link>
      </div>

      {/* Recent detections + settings */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent detections */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-900 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              Recent Detections
            </h2>
            <Link href="/recent" className="text-sm text-navy-700 font-semibold hover:underline">
              View all
            </Link>
          </div>

          {(!recentDetections || recentDetections.length === 0) ? (
            <div className="text-center py-10">
              <Mic size={32} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm">No detections yet. Go to Live Detection to start.</p>
              <Link href="/live" className="inline-block mt-3 text-navy-700 text-sm font-bold hover:underline">
                Start detecting
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDetections.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-navy-900">{d.detected_reference}</p>
                    {d.raw_transcript && (
                      <p className="text-xs text-gray-400 italic mt-0.5">"{d.raw_transcript}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gold-600 bg-gold-400/10 px-2 py-0.5 rounded-full">
                      {d.version}
                    </span>
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile summary */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-5 flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Default Version</p>
              <p className="font-bold text-navy-900">{profile?.preferred_version ?? 'NKJV'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Language</p>
              <p className="font-bold text-navy-900">{profile?.preferred_language ?? 'English'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Plan</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-navy-900 capitalize">{profile?.plan ?? 'Free'}</span>
                <Zap size={12} className="text-gold-500" />
              </div>
            </div>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 mt-6 hover:underline"
          >
            Edit preferences
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
