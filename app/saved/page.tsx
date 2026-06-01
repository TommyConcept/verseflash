'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Trash2, Copy, FileText, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { copyToClipboard, formatDate } from '@/lib/utils'
import type { SavedVerse } from '@/types'

export default function SavedVersesPage() {
  const [verses, setVerses] = useState<SavedVerse[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [noteValue, setNoteValue] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('saved_verses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setVerses((data as SavedVerse[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('saved_verses').delete().eq('id', id)
    setVerses(v => v.filter(x => x.id !== id))
  }

  async function handleCopy(verse: SavedVerse) {
    await copyToClipboard(`${verse.book} ${verse.chapter}:${verse.verseStart} — ${verse.verseText} (${verse.version})`)
    setCopiedId(verse.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleSaveNotes(id: string) {
    const supabase = createClient()
    await supabase.from('saved_verses').update({ notes: noteValue, updated_at: new Date().toISOString() }).eq('id', id)
    setVerses(v => v.map(x => x.id === id ? { ...x, notes: noteValue } : x))
    setEditingNotes(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-navy-900">Saved Verses</h1>
          <p className="text-gray-500 mt-1">{verses.length} verse{verses.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {verses.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bookmark size={28} className="text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No saved verses yet</h3>
          <p className="text-gray-400">Detect a verse in Live Detection and save it to your collection.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {verses.map((verse) => (
            <div key={verse.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-navy-900">
                    {verse.book} {verse.chapter}{verse.verseStart ? `:${verse.verseStart}` : ''}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(verse.createdAt)}</p>
                </div>
                <Badge variant="gold">{verse.version}</Badge>
              </div>

              {/* Verse text */}
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                {verse.verseText}
              </p>

              {/* Notes */}
              {editingNotes === verse.id ? (
                <div className="mb-4">
                  <textarea
                    className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-navy-900"
                    rows={3}
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Add a note..."
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => handleSaveNotes(verse.id)}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingNotes(null)}>Cancel</Button>
                  </div>
                </div>
              ) : verse.notes ? (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <p className="text-xs text-gray-400 font-semibold mb-1 flex items-center gap-1">
                    <FileText size={11} /> Note
                  </p>
                  <p className="text-sm text-gray-600">{verse.notes}</p>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleCopy(verse)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-navy-900 transition-colors"
                >
                  {copiedId === verse.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copiedId === verse.id ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => { setEditingNotes(verse.id); setNoteValue(verse.notes ?? '') }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-navy-900 transition-colors"
                >
                  <FileText size={12} />
                  {verse.notes ? 'Edit note' : 'Add note'}
                </button>
                <button
                  onClick={() => handleDelete(verse.id)}
                  className="ml-auto flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
