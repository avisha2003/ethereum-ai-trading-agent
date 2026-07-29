import { useState } from 'react'
import { FaBars } from 'react-icons/fa6'
import Sidebar from './components/layout/Sidebar'
import DashboardPage from './components/pages/DashboardPage'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(120deg,_#020617_0%,_#0f172a_55%,_#111827_100%)] px-3 py-3 text-slate-100 sm:px-4 lg:px-6 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <Sidebar activeItem={activeView} onSelect={setActiveView} />

        <main className="flex-1 rounded-[32px] border border-white/10 bg-slate-950/70 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-slate-900/60 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Ethereum AI Trading Agent</p>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Frontend Phase 1</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" /> Gemini
                <span className="text-slate-500">Disconnected</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Ethereum RPC
                <span className="text-slate-500">Disconnected</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Latest Block
                <span className="text-slate-500">--</span>
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
