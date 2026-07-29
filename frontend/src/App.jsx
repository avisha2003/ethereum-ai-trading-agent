import { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa6'
import Sidebar from './components/layout/Sidebar'
import DashboardPage from './components/pages/DashboardPage'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [status, setStatus] = useState({
    backend: 'offline',
    gemini: 'offline',
    rpc: 'offline',
    latest_block: null
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:8000/status')
        if (response.ok) {
          const data = await response.json()
          setStatus(data)
        } else {
          setStatus({ backend: 'offline', gemini: 'offline', rpc: 'offline', latest_block: null })
        }
      } catch (err) {
        setStatus({ backend: 'offline', gemini: 'offline', rpc: 'offline', latest_block: null })
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(120deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-3 py-3 text-slate-100 sm:px-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-7xl w-full flex-col gap-4 lg:flex-row items-start">
        <Sidebar activeItem={activeView} onSelect={setActiveView} />

        <main className="flex-1 min-w-0 w-full rounded-[32px] border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-slate-900/60 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Ethereum AI Trading Agent</p>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Live Dashboard</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${status.backend === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} /> Backend
                <span className={`text-xs font-semibold ${status.backend === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>{status.backend === 'online' ? 'Connected' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${status.gemini === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} /> Gemini
                <span className={`text-xs font-semibold ${status.gemini === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>{status.gemini === 'online' ? 'Connected' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${status.rpc === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} /> RPC
                <span className={`text-xs font-semibold ${status.rpc === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>{status.rpc === 'online' ? 'Connected' : 'Offline'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" /> Block
                <span className="text-xs text-slate-300 font-mono font-bold">{status.latest_block || '--'}</span>
              </div>
            </div>
          </header>

          <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-400 lg:hidden">
            <span>Dashboard</span>
            <button type="button" className="rounded-xl border border-white/10 p-2 text-slate-200">
              <FaBars />
            </button>
          </div>

          <DashboardPage />
        </main>
      </div>
    </div>
  )
}

export default App
