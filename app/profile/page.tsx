'use client'

import { useEffect, useState } from 'react'
import { User, Mail, BookOpen, Globe, Zap, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SUPPORTED_VERSIONS, SUPPORTED_LANGUAGES } from '@/constants/bible'
import type { BibleVersion } from '@/types'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [preferredVersion, setPreferredVersion] = useState<BibleVersion>('NKJV')
  const [preferredLanguage, setPreferredLanguage] = useState('English')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (data) {
        setProfile(data)
        setFullName(data.full_name ?? '')
        setPreferredVersion(data.preferred_version ?? 'NKJV')
        setPreferredLanguage(data.preferred_language ?? 'English')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        preferred_version: preferredVersion,
        preferred_language: preferredLanguage,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      setError('Failed to save. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-navy-900">Profile &amp; Settings</h1>
        <p className="text-gray-500 mt-1">Manage your preferences and account information.</p>
      </div>

      <div className="space-y-6">
        {/* Account info */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-5 flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            Account Information
          </h2>

          <div className="space-y-4">
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              icon={<User size={15} />}
            />
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">Email address</label>
              <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-gray-100 bg-gray-50">
                <Mail size={15} className="text-gray-400" />
                <span className="text-sm text-gray-500">{profile?.email}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-5 flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            Bible Preferences
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5">
                Preferred Bible Version
              </label>
              <select
                value={preferredVersion}
                onChange={(e) => setPreferredVersion(e.target.value as BibleVersion)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
              >
                {SUPPORTED_VERSIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Default is NKJV. Actual verse text depends on connected Bible API licensing.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1.5 flex items-center gap-1.5">
                <Globe size={14} />
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Zap size={16} className="text-gray-400" />
            Plan
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-navy-900 capitalize">{profile?.plan ?? 'Free'} Plan</p>
              <p className="text-sm text-gray-400 mt-0.5">All features included. Premium plans coming soon.</p>
            </div>
            <span className="bg-gold-400/10 text-yellow-700 border border-gold-400/30 text-xs font-bold px-3 py-1 rounded-full">
              Free Forever
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
        )}

        <Button
          onClick={handleSave}
          loading={saving}
          size="lg"
          variant={saved ? 'secondary' : 'primary'}
          className="w-full"
        >
          {saved ? (
            <>Saved successfully</>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
