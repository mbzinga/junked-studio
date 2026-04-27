'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const STATUS_STYLE = {
  new: 'bg-primary-container text-on-surface',
  contacted: 'bg-yellow-300 text-black',
  shipped: 'bg-green-400 text-white',
  done: 'bg-zinc-200 text-zinc-500',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [images, setImages] = useState([])
  const [orders, setOrders] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return router.push('/admin/login')
      setUser(user)
    })
    loadImages()
    loadOrders()
  }, [router])

  async function loadImages() {
    const { data } = await supabase.storage.from('gallery').list()
    if (data) setImages(data.filter(f => !f.name.startsWith('.')))
  }

  async function loadOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await supabase.storage.from('gallery').upload(`${Date.now()}-${file.name}`, file)
    setUploading(false)
    loadImages()
  }

  async function handleDelete(name) {
    await supabase.storage.from('gallery').remove([name])
    loadImages()
  }

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    loadOrders()
  }

  if (!user) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] px-6 py-4 flex justify-between items-center">
        <span className="text-2xl font-black drop-shadow-[2px_2px_0px_#ffb6d9] font-mono italic tracking-tighter uppercase">JUNKED STUDIO</span>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-sm font-bold hover:text-pink-400 transition-colors">← Site</a>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/admin/login'))} className="text-sm font-bold text-secondary-container hover:underline">Log out</button>
        </div>
      </header>

      <main className="pt-24 px-6 pb-16 max-w-7xl mx-auto">
        {/* Gallery management */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-container mb-1">
              <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Manage Your Chaos
            </p>
            <h1 className="text-4xl font-extrabold uppercase italic">Gallery <span className="text-secondary-container">Vault</span></h1>
          </div>
          <label className="squishy-btn bg-secondary-container text-white px-6 py-3 rounded-full border-4 border-black font-bold uppercase cursor-pointer inline-flex items-center gap-2">
            <span className="material-symbols-outlined">add_photo_alternate</span>
            {uploading ? 'Uploading...' : 'Upload New'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {images.map(img => {
            const url = supabase.storage.from('gallery').getPublicUrl(img.name).data.publicUrl
            return (
              <div key={img.name} className="group relative bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <img src={url} alt="" className="w-full h-48 object-cover" />
                <button onClick={() => handleDelete(img.name)} className="absolute top-2 right-2 bg-white p-1.5 rounded-lg border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-100">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            )
          })}
          {!images.length && <p className="col-span-full text-center text-zinc-400 italic py-8">No images yet — upload your first one above.</p>}
        </div>

        {/* Orders table */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-extrabold uppercase italic">Incoming <span className="text-secondary-container">Orders</span></h2>
          <div className="h-1 flex-grow bg-black/10 rounded-full" />
        </div>

        <div className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[12px_12px_0_0_rgba(255,182,217,1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black text-white font-mono uppercase tracking-widest text-[10px]">
                  {['Name', 'Contact', 'Phone', 'Tier', 'Ship', 'Notes', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-pink-50 transition-colors">
                    <td className="px-4 py-4 font-bold">{o.name}</td>
                    <td className="px-4 py-4">{o.contact}</td>
                    <td className="px-4 py-4">{o.phone_model}</td>
                    <td className="px-4 py-4">{o.tier}</td>
                    <td className="px-4 py-4">{o.shipping}</td>
                    <td className="px-4 py-4 text-sm text-zinc-500 max-w-[200px] truncate">{o.colors}</td>
                    <td className="px-4 py-4">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className={`${STATUS_STYLE[o.status] || ''} px-3 py-1 rounded-full border-2 border-black text-[10px] font-black uppercase cursor-pointer`}>
                        {['new', 'contacted', 'shipped', 'done'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-zinc-400 italic">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
