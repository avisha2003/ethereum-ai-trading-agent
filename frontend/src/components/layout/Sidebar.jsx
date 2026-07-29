import { FaChartLine, FaCube, FaRobot, FaSlidersH } from 'react-icons/fa'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaChartLine /> },
  { id: 'prediction', label: 'Prediction', icon: <FaRobot /> },
  { id: 'backtest', label: 'Backtesting', icon: <FaCube /> },
  { id: 'settings', label: 'Settings', icon: <FaSlidersH /> },
]

function Sidebar({ activeItem, onSelect }) {
  return (
    <aside className="hidden w-72 flex-col rounded-[32px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.5)] backdrop-blur-xl lg:flex lg:sticky lg:top-6 self-start">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-semibold text-white">
          EA
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Ethereum AI</p>
          <p className="text-sm text-slate-400">Trading Agent</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-500/15 text-blue-200 shadow-inner'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
