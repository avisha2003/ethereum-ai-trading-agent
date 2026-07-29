import { FaArrowTrendUp, FaClock, FaEthereum } from 'react-icons/fa6'
import ActionButton from '../buttons/ActionButton'
import MetricCard from '../cards/MetricCard'
import StatusBadge from '../cards/StatusBadge'
import PriceChart from '../charts/PriceChart'

const historyRows = [
  { time: '08:12', predicted: '$3,180', actual: '$3,198', error: '0.56%', recommendation: 'BUY', pnl: '+$112' },
  { time: '09:05', predicted: '$3,220', actual: '$3,214', error: '0.19%', recommendation: 'SELL', pnl: '+$58' },
  { time: '10:41', predicted: '$3,260', actual: '$3,289', error: '0.89%', recommendation: 'BUY', pnl: '+$91' },
  { time: '11:18', predicted: '$3,310', actual: '$3,275', error: '1.07%', recommendation: 'SELL', pnl: '-$36' },
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Ethereum Market</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Live Market Pulse</h2>
            </div>
            <div className="flex gap-2">
              <StatusBadge label="Trend" value="Bullish" tone="success" />
              <StatusBadge label="Signal" value="Strong" tone="neutral" />
            </div>
          </div>
          <PriceChart />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-500/10 via-slate-950/70 to-cyan-500/10 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-200">
              <FaEthereum className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Prediction Snapshot</p>
              <h3 className="text-xl font-semibold text-white">Next Signal</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Current Price</p>
              <p className="mt-1 text-2xl font-semibold text-white">--</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Predicted Price</p>
              <p className="mt-1 text-2xl font-semibold text-white">--</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Expected Change</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-300">--</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-400">Recommendation</p>
              <p className="mt-1 text-2xl font-semibold text-amber-300">--</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ActionButton className="flex-1 justify-center">Predict</ActionButton>
            <ActionButton variant="secondary" className="flex-1 justify-center">Run Backtest</ActionButton>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Mean Error" value="--" detail="Backtest placeholder" accent="blue" />
        <MetricCard title="Prediction Count" value="--" detail="Model sample size" accent="blue" />
        <MetricCard title="Win Rate" value="--" detail="Historical signal rate" accent="green" />
        <MetricCard title="Average Profit" value="--" detail="Estimated returns" accent="green" />
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Prediction History</p>
            <h3 className="mt-1 text-xl font-semibold text-white">Recent Signals</h3>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-400">
            <FaClock />
            Dummy Data Only
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="px-3 py-3">Prediction Time</th>
                <th className="px-3 py-3">Predicted Price</th>
                <th className="px-3 py-3">Actual Price</th>
                <th className="px-3 py-3">Error</th>
                <th className="px-3 py-3">Recommendation</th>
                <th className="px-3 py-3">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr key={row.time} className="border-b border-white/5 text-slate-300">
                  <td className="px-3 py-3">{row.time}</td>
                  <td className="px-3 py-3">{row.predicted}</td>
                  <td className="px-3 py-3">{row.actual}</td>
                  <td className="px-3 py-3">{row.error}</td>
                  <td className={`px-3 py-3 font-semibold ${row.recommendation === 'BUY' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {row.recommendation}
                  </td>
                  <td className={`px-3 py-3 font-semibold ${row.pnl.startsWith('+') ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {row.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
