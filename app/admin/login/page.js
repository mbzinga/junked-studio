'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary-container rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-surface rounded-full blur-3xl opacity-30" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="font-mono font-black italic tracking-tighter uppercase text-4xl drop-shadow-[4px_4px_0px_#ffb6d9]">JUNKED STUDIO</h1>
          <p className="text-xs uppercase tracking-widest text-outline mt-2">Admin Access</p>
        </div>
        <div className="bg-surface border-4 border-black rounded-lg p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.05)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-lg" />
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase block ml-1">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@junked.studio" className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:border-secondary-container focus:ring-secondary-container/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase block ml-1">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:border-secondary-container focus:ring-secondary-container/20" />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" disabled={loading} className="squishy-btn w-full bg-secondary-container text-white border-4 border-black py-3 rounded-full font-bold uppercase tracking-tighter disabled:opacity-50">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 font-mono text-[10px] tracking-widest uppercase text-outline">© 2025 JUNKED STUDIO</p>
      </div>
    </div>
  )
}
