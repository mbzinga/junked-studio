'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const TIERS = [
  { name: 'Minimal', price: '£7', gems: 1, desc: 'Just a few sprinkles of magic.' },
  { name: 'Medium', price: '£17', gems: 2, desc: 'Balanced chaos. Perfect daily.' },
  { name: 'Very', price: '£25', gems: 3, desc: 'Heavily textured. A vibe.', popular: true },
  { name: 'Extremely', price: '£45', gems: 4, desc: 'Maximum junk. No empty space.' },
  { name: 'Mosaic', price: '£34', gems: 1, desc: 'Patterned perfection. Artistic.' },
]

export default function Home() {
  const [images, setImages] = useState([])
  const [form, setForm] = useState({ name: '', contact: '', phone_model: '', tier: 'Very (£25)', colors: '', shipping: 'UK' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.storage.from('gallery').list().then(({ data }) => {
      if (!data) return
      setImages(data.filter(f => !f.name.startsWith('.')).map(f =>
        supabase.storage.from('gallery').getPublicUrl(f.name).data.publicUrl
      ))
    })
  }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value ?? e.target.textContent })

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSending(false)
    setSent(true)
  }

  return (
    <>
      {/* Sticky header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-black drop-shadow-[2px_2px_0px_#ffb6d9] font-mono italic tracking-tighter uppercase">JUNKED STUDIO</div>
        <nav className="hidden md:flex gap-8 items-center">
          {['Gallery', 'Pricing', 'Order'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} className="text-black hover:text-pink-400 font-mono font-black italic tracking-tighter uppercase hover:scale-105 transition-transform active:translate-y-0.5">{s}</a>
          ))}
          <a href="/admin/login" className="text-pink-400 hover:scale-110 transition-transform">
            <span className="material-symbols-outlined">lock</span>
          </a>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero */}
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-5 py-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/20 to-transparent pointer-events-none" />
          <span className="material-symbols-outlined absolute top-20 left-10 text-secondary-container animate-pulse text-4xl">auto_awesome</span>
          <span className="material-symbols-outlined absolute bottom-40 right-10 text-secondary-container animate-pulse text-5xl">star</span>
          <div className="z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold uppercase drop-shadow-[4px_4px_0px_#ffb6d9] mb-2">JUNKĖD studio</h1>
            <p className="text-lg text-primary italic mb-10">handmade junk phone cases. one of one.</p>
            <a href="#order" className="squishy-btn inline-flex px-12 py-4 bg-secondary-container text-white text-xl font-bold rounded-full border-4 border-black uppercase tracking-wider">
              Order yours
            </a>
          </div>
        </section>

        {/* Gallery */}
        <section id="gallery" className="py-16 px-5 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold uppercase mb-1">The Collection</h2>
            <p className="text-primary italic mb-8">Handcrafted with chaos by Ayomide, age 13.</p>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {images.map((url, i) => (
                <div key={i} className="break-inside-avoid rounded-lg border-2 border-black overflow-hidden shadow-md group relative">
                  <img src={url} alt="" className="w-full" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  </div>
                </div>
              ))}
              {!images.length && <p className="text-zinc-400 italic py-12">Upload images in the admin panel to fill the gallery.</p>}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 px-5 bg-primary-container/10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold uppercase mb-10">How junked do you want it?</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {TIERS.map(t => (
                <div key={t.name} className={`bg-white p-6 rounded-lg flex flex-col items-center shadow-lg hover:-translate-y-2 transition-transform relative border-4 ${t.popular ? 'border-secondary-container ring-4 ring-secondary-container/20 scale-105 z-10' : 'border-outline-variant'}`}>
                  {t.popular && <div className="absolute -top-3 bg-secondary-container text-white text-[10px] px-2 py-0.5 rounded-full font-black">MOST LOVED</div>}
                  <span className="text-secondary font-black text-sm uppercase mb-1 tracking-widest">{t.name}</span>
                  <div className="text-2xl font-black mb-2">{t.price}</div>
                  <div className="flex gap-1 mb-3">{Array.from({ length: t.gems }, (_, i) => <span key={i} className="text-secondary-container">◆</span>)}</div>
                  <p className="text-xs text-outline font-medium">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Form */}
        <section id="order" className="py-16 px-5">
          <div className="max-w-4xl mx-auto bg-white rounded-lg border-4 border-black p-8 md:p-10 shadow-[12px_12px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-extrabold uppercase mb-6">Let&apos;s make yours</h2>
            {sent ? (
              <div className="text-center py-12">
                <p className="text-2xl font-black text-secondary-container">Order sent! ✨</p>
                <p className="text-primary mt-2">Falola will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[['name','Name','Your name...'], ['contact','Email / Handle','@handle or email'], ['phone_model','Phone Model','iPhone 15, S23, etc.']].map(([key, label, ph]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-black uppercase">{label}</label>
                      <input required value={form[key]} onChange={set(key)} placeholder={ph} className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:ring-secondary-container focus:border-secondary-container" />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase">Tier</label>
                    <select value={form.tier} onChange={set('tier')} className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:ring-secondary-container focus:border-secondary-container">
                      {TIERS.map(t => <option key={t.name}>{t.name} ({t.price})</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase">Colors / Theme / Notes</label>
                  <input value={form.colors} onChange={set('colors')} placeholder="Pink + Hello Kitty, add my name, etc." className="w-full bg-surface-low border-2 border-black rounded-full px-6 py-3 focus:ring-secondary-container focus:border-secondary-container" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase">Shipping</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[['UK', '£3.50 tracked'], ['International', '£12.00 tracked']].map(([val, sub]) => (
                      <div key={val} onClick={() => setForm({ ...form, shipping: val })} className={`border-2 border-black rounded-lg p-3 cursor-pointer transition-colors ${form.shipping === val ? 'bg-primary-container/30 border-secondary-container' : 'hover:bg-pink-50'}`}>
                        <p className="font-bold">{val}</p><p className="text-xs">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={sending} className="w-full squishy-btn py-4 bg-secondary-container text-white text-xl font-bold rounded-full border-4 border-black uppercase tracking-widest disabled:opacity-50">
                  {sending ? 'Sending...' : 'Send order request'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-16 border-t-4 border-pink-400 flex flex-col items-center gap-4">
        <div className="text-pink-400 font-black text-2xl font-mono italic tracking-tighter uppercase">JUNKED STUDIO</div>
        <a href="https://www.instagram.com/junkedstudio/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-pink-400 transition-colors font-mono text-xs uppercase tracking-widest">
          <span className="material-symbols-outlined text-lg">photo_camera</span>
          @junkedstudio
        </a>
        <p className="text-pink-400 font-mono text-[10px] tracking-widest uppercase">made with love in the UK</p>
        <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase">© 2025 JUNKED STUDIO. PLUSH-INDUSTRIAL VIBES ONLY.</p>
      </footer>
    </>
  )
}
