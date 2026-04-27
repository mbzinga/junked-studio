'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') return
    })
  }, [])

  async function handleReset(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Passwords don\'t match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setError(error.message)
    setDone(true)
    setTimeout(() => router.push('/admin'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-container rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl opacity-30" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="font-mono font-black italic tracking-tighter uppercase text-4xl drop-shadow-[4px_4px_0px_#ffb6d9]">JUNKED STUDIO</h1>
          <p className="text-xs uppercase tracking-widest text-outline mt-2">Set New Password</p>
        </div>
        <div className="bg-surface border-4 border-black rounded-lg p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.05)]">
          {done ? (
            <div className="text-center py-4">
              <p className="text-lg font-black text-secondary-container">Password updated!</p>
              <p className="text-sm text-outline mt-2">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase block ml-1">New Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:border-secondary-container focus:ring-secondary-container/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase block ml-1">Confirm Password</label>
                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:border-secondary-container focus:ring-secondary-container/20" />
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button type="submit" disabled={loading} className="squishy-btn w-full bg-secondary-container text-white border-4 border-black py-3 rounded-full font-bold uppercase tracking-tighter disabled:opacity-50">
                {loading ? 'Updating...' : 'Set new password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
