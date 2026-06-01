'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Mic, BookOpen, Bookmark, Clock, User, Monitor, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BookOpen },
  { href: '/live', label: 'Live Detection', icon: Mic },
  { href: '/display', label: 'Display Mode', icon: Monitor },
  { href: '/saved', label: 'Saved Verses', icon: Bookmark },
  { href: '/recent', label: 'Recent', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
]

interface NavbarProps {
  user?: { email?: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center group-hover:bg-navy-800 transition-colors">
              <Mic size={16} className="text-gold-400" />
            </div>
            <span className="text-lg font-bold text-navy-900 tracking-tight">VerseFlash</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="hidden md:block text-xs text-gray-400 truncate max-w-32">{user.email}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                  <LogOut size={14} />
                  Sign out
                </Button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-navy-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign out
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
