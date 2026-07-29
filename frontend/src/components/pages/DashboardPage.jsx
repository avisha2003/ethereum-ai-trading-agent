import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import {
  Clock, TrendingUp, TrendingDown, AlertTriangle, Play, RotateCw, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { fetchEthereumHistory } from '../../services/marketService'

// ---------------------------------------------------------------------------
// Fonts — Space Grotesk (display) + IBM Plex Mono (all data/numerics)
// ---------------------------------------------------------------------------
function useFonts() {
  useEffect(() => {
    const id = 'terminal-fonts'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
    document.head.appendChild(link)
  }, [])
}

// ---------------------------------------------------------------------------
// Color tokens — vivid dark theme
// ---------------------------------------------------------------------------
const C = {
  void: '#0A0A12',
  panel: '#14151F',
  panelRaised: '#191A28',
  border: '#262838',
  borderStrong: '#363954',
  textPrimary: '#EDEDF5',
  textSecondary: '#9092AC',
  textMuted: '#5C5E78',
  violet: '#8B6BF2',
  violetDim: 'rgba(139,107,242,0.12)',
  cyan: '#2DD4E0',
  amber: '#F5B942',
  green: '#31D69C',
  red: '#F5697A',
}



const loadingSteps = [
  'Fetching mainnet pool state',
  'Reading historical prices',
  'Preparing model input',
  'Awaiting Gemini response',
  'Scoring signal confidence',
  'Finalizing recommendation',
]

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const money = (v, d = 2) => `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`
const pct = (v, d = 1) => `${(v * 100).toFixed(d)}%`

function TickerTape({ chartData }) {
  if (chartData.length < 2) return null
  const first = chartData[0].price
  const last = chartData[chartData.length - 1].price
  const changePct = ((last - first) / first) * 100
  const up = changePct >= 0

  const items = chartData.slice(-14).map((d, i, arr) => ({
    ...d,
    up: i === 0 ? true : d.price >= arr[i - 1].price,
  }))

  const strip = (key) => (
    <div className="flex items-center shrink-0" key={key}>
      {items.map((it, i) => (
        <div key={`${key}-${i}`} className="flex items-center gap-2 px-5 border-r" style={{ borderColor: C.border }}>
          <span className="text-[11px] tracking-wider font-mono" style={{ color: C.textMuted }}>ETH/USD</span>
          <span className="text-[13px] font-mono font-medium" style={{ color: C.textPrimary }}>{money(it.price)}</span>
          <span className="text-[11px] font-mono flex items-center gap-0.5" style={{ color: it.up ? C.green : C.red }}>
            {it.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative overflow-hidden border-b" style={{ borderColor: C.border, background: C.panelRaised }}>
      <div className="flex w-max animate-[ticker_28s_linear_infinite]">
        {strip('a')}
        {strip('b')}
      </div>
      <div className="absolute right-0 top-0 h-full flex items-center gap-2 pl-6 pr-4" style={{ background: `linear-gradient(to left, ${C.panelRaised}, ${C.panelRaised}, transparent)` }}>
        <span className="text-[11px] font-mono font-semibold" style={{ color: up ? C.green : C.red }}>
          {up ? '+' : ''}{changePct.toFixed(2)}% 24H
        </span>
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}

function Panel({ children, className = '', accent }) {
  return (
    <section
      className={`rounded-[10px] ${className}`}
      style={{ background: C.panel, border: `1px solid ${accent || C.border}` }}
    >
      {children}
    </section>
  )
}

function PanelHeader({ eyebrow, eyebrowColor, title, right }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b" style={{ borderColor: C.border }}>
      <div>
        <span className="block text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: eyebrowColor || C.textMuted }}>{eyebrow}</span>
        <h2 className="text-[15px] font-medium" style={{ color: C.textPrimary, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      </div>
      {right}
    </div>
  )
}

function TermButton({ children, onClick, tone = 'violet', className = '' }) {
  const styles = {
    violet: { borderColor: 'rgba(139,107,242,0.45)', color: '#C4B3F9', background: 'transparent' },
    neutral: { borderColor: C.borderStrong, color: C.textSecondary, background: 'transparent' },
  }
  return (
    <button
      onClick={onClick}
      style={styles[tone]}
      className={`flex items-center gap-2 rounded-[6px] border px-4 py-2 text-[12px] font-mono font-medium tracking-wide transition active:scale-[0.98] cursor-pointer hover:brightness-125 ${className}`}
    >
      {children}
    </button>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[6px] px-3 py-2" style={{ background: C.panelRaised, border: `1px solid ${C.borderStrong}` }}>
      <p className="text-[10px] font-mono mb-1" style={{ color: C.textMuted }}>{label}</p>
      <p className="text-[13px] font-mono font-medium" style={{ color: C.cyan }}>{money(payload[0].value)}</p>
    </div>
  )
}

function StatChip({ label, value, tone }) {
  const color = tone === 'green' ? C.green : tone === 'red' ? C.red : tone === 'amber' ? C.amber : C.textPrimary
  return (
    <div className="flex-1 rounded-[8px] px-4 py-3" style={{ background: C.panelRaised, border: `1px solid ${C.border}` }}>
      <span className="block text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>{label}</span>
      <span className="block text-[16px] font-mono font-semibold mt-1" style={{ color }}>{value != null ? money(value) : '—'}</span>
    </div>
  )
}

function DataCell({ label, value, tone }) {
  const color = tone === 'green' ? C.green : tone === 'red' ? C.red : C.textPrimary
  return (
    <div className="rounded-[8px] px-4 py-3" style={{ background: C.panelRaised, border: `1px solid ${C.border}` }}>
      <span className="block text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>{label}</span>
      <span className="block text-[17px] font-mono font-semibold mt-1" style={{ color }}>{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
function DashboardPage() {
  useFonts()

  const [loadingPredict, setLoadingPredict] = useState(false)
  const [loadingBacktest, setLoadingBacktest] = useState(false)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)

  const [predictError, setPredictError] = useState(null)
  const [backtestError, setBacktestError] = useState(null)

  const [prediction, setPrediction] = useState(null)
  const [backtest, setBacktest] = useState(null)

  const [chartData, setChartData] = useState([])
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setChartError(false)
        const data = await fetchEthereumHistory()
        setChartData(data)
      } catch (e) {
        setChartError(true)
      }
    }
    load()
    const interval = setInterval(load, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let interval
    if (loadingPredict) {
      setLoadingStepIndex(0)
      interval = setInterval(() => setLoadingStepIndex(p => (p + 1) % loadingSteps.length), 1200)
    }
    return () => clearInterval(interval)
  }, [loadingPredict])

  const handlePredict = async () => {
    setLoadingPredict(true)
    setPredictError(null)
    setPrediction(null)
    try {
      const response = await axios.get('http://localhost:8000/predict')
      setPrediction(response.data)
    } catch (err) {
      setPredictError(err.response?.data?.detail || err.message || 'Failed to generate prediction. Gemini API might be busy.')
    } finally {
      setLoadingPredict(false)
    }
  }

  const handleBacktest = async () => {
    setLoadingBacktest(true)
    setBacktestError(null)
    try {
      const response = await axios.get('http://localhost:8000/backtest')
      setBacktest(response.data)
    } catch (err) {
      setBacktestError(err.response?.data?.detail || err.message || 'Backtest execution failed. Check backend connection.')
    } finally {
      setLoadingBacktest(false)
    }
  }

  const latest = chartData[chartData.length - 1]
  const dayLow = useMemo(() => chartData.length ? Math.min(...chartData.map(d => d.price)) : null, [chartData])
  const dayHigh = useMemo(() => chartData.length ? Math.max(...chartData.map(d => d.price)) : null, [chartData])
  const avgPrice = useMemo(() => chartData.length ? chartData.reduce((a, d) => a + d.price, 0) / chartData.length : null, [chartData])

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui", background: C.void, minHeight: '100vh' }}>
      <TickerTape chartData={chartData} />

      <div className="max-w-6xl mx-auto p-6 space-y-5">

        {/* Brand row */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[8px] flex items-center justify-center" style={{ background: C.violetDim, border: '1px solid rgba(139,107,242,0.4)' }}>
              <Activity size={17} style={{ color: C.violet }} />
            </div>
            <div>
              <h1 className="text-[16px] font-semibold leading-none" style={{ color: C.textPrimary, fontFamily: "'Space Grotesk', sans-serif" }}>
                ETH SIGNAL DESK
              </h1>
              <p className="text-[11px] font-mono mt-1" style={{ color: C.textMuted }}>Uniswap WETH · Gemini-assisted inference</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: C.green }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: C.green }} />
            LIVE
          </div>
        </div>

        {/* 1. Market pulse — single full-width section */}
        <Panel accent="rgba(45,212,224,0.25)">
          <PanelHeader
            eyebrow="Market pulse"
            eyebrowColor={C.cyan}
            title="ETH / USD — 24H"
            right={latest && (
              <div className="text-right">
                <span className="block text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textMuted }}>Last</span>
                <span className="text-[22px] font-mono font-semibold" style={{ color: C.cyan }}>{money(latest.price)}</span>
              </div>
            )}
          />
          <div className="p-5">
            {chartError ? (
              <div className="h-64 flex flex-col items-center justify-center text-center rounded-[8px] border border-dashed" style={{ borderColor: C.borderStrong }}>
                <AlertTriangle size={20} style={{ color: C.red }} className="mb-2" />
                <span className="text-[13px]" style={{ color: C.textSecondary }}>Ethereum history unavailable</span>
                <span className="text-[11px] font-mono mt-1" style={{ color: C.textMuted }}>Source rate limits may apply</span>
              </div>
            ) : (
              <>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={C.border} vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: C.textMuted, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: C.border }} tickLine={false} interval={5} />
                      <YAxis tick={{ fontSize: 10, fill: C.textMuted, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} width={58} tickFormatter={(v) => `$${Math.round(v)}`} />
                      {avgPrice && <ReferenceLine y={avgPrice} stroke={C.borderStrong} strokeDasharray="3 3" />}
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="price" stroke={C.cyan} strokeWidth={2} fill="url(#cyanFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <StatChip label="24H high" value={dayHigh} tone="green" />
                  <StatChip label="24H low" value={dayLow} tone="red" />
                  <StatChip label="24H avg" value={avgPrice} tone="amber" />
                </div>
              </>
            )}
          </div>
        </Panel>

        {/* 2. Prediction workspace */}
        <Panel accent="rgba(139,107,242,0.25)">
          <PanelHeader
            eyebrow="Signal engine"
            eyebrowColor={C.violet}
            title="Prediction workspace"
            right={prediction && !loadingPredict && (
              <TermButton tone="neutral" onClick={handlePredict}><RotateCw size={12} /> Run again</TermButton>
            )}
          />
          <div className="p-5">
            {predictError && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-[8px] px-4 py-3" style={{ border: `1px solid rgba(245,105,122,0.35)`, background: 'rgba(245,105,122,0.06)' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={15} style={{ color: C.red }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: '#F7A3AF' }}>Prediction failed</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: C.textSecondary }}>{predictError}</p>
                  </div>
                </div>
                <TermButton tone="neutral" onClick={handlePredict}><RotateCw size={11} /> Retry</TermButton>
              </div>
            )}

            {!loadingPredict && !prediction ? (
              <div className="flex flex-col items-center justify-center text-center py-9 px-4 rounded-[8px]" style={{ border: `1px solid ${C.border}` }}>
                <p className="text-[13px] max-w-md leading-relaxed mb-5" style={{ color: C.textSecondary }}>
                  Pulls live pool state from mainnet RPC and consults Gemini for the next directional signal.
                </p>
                <TermButton onClick={handlePredict} className="px-6 py-2.5"><Play size={12} /> Generate prediction</TermButton>
              </div>
            ) : loadingPredict ? (
              <div className="flex flex-col items-center justify-center text-center py-10 px-4 rounded-[8px]" style={{ border: `1px solid ${C.border}` }}>
                <div className="h-9 w-9 mb-4 rounded-full border-2 animate-spin" style={{ borderColor: C.border, borderTopColor: C.violet }} />
                <span className="text-[12px] font-mono tracking-wide" style={{ color: C.textSecondary }}>{loadingSteps[loadingStepIndex]}</span>
              </div>
            ) : (
              <div className="rounded-[8px] pl-5 pr-5 py-5" style={{
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${prediction.recommendation === 'BUY' ? C.green : C.red}`,
              }}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b pb-4" style={{ borderColor: C.border }}>
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: C.textMuted }}>Signal output</span>
                    <span className="flex items-center gap-2 text-[28px] font-semibold tracking-wide mt-1" style={{
                      color: prediction.recommendation === 'BUY' ? C.green : C.red,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {prediction.recommendation === 'BUY' ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
                      {prediction.recommendation}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                  <DataCell label="Current price" value={money(prediction.current_price)} />
                  <DataCell label="Predicted price" value={money(prediction.predicted_price)} />
                  <DataCell
                    label="Expected change"
                    value={`${prediction.recommendation === 'BUY' ? '+' : '-'}${money(prediction.difference)}`}
                    tone={prediction.recommendation === 'BUY' ? 'green' : 'red'}
                  />
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono" style={{ color: C.textMuted }}>
                  <Clock size={12} />
                  <span>Checked {prediction.prediction_time.replace('T', ' ').slice(0, 19)} UTC</span>
                </div>
              </div>
            )}
          </div>
        </Panel>

        {/* 3. Backtest workspace */}
        <Panel accent="rgba(245,185,66,0.22)">
          <PanelHeader
            eyebrow="Model validation"
            eyebrowColor={C.amber}
            title="Backtest simulation"
            right={!backtest && !loadingBacktest && (
              <TermButton onClick={handleBacktest}><Play size={12} /> Run backtest</TermButton>
            )}
          />
          <div className="p-5">
            {backtestError && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-[8px] px-4 py-3" style={{ border: `1px solid rgba(245,105,122,0.35)`, background: 'rgba(245,105,122,0.06)' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={15} style={{ color: C.red }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[12px] font-medium" style={{ color: '#F7A3AF' }}>Backtest failed</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: C.textSecondary }}>{backtestError}</p>
                  </div>
                </div>
                <TermButton tone="neutral" onClick={handleBacktest}><RotateCw size={11} /> Retry</TermButton>
              </div>
            )}

            {loadingBacktest ? (
              <div className="flex flex-col items-center justify-center text-center py-10 rounded-[8px]" style={{ border: `1px solid ${C.border}` }}>
                <div className="h-8 w-8 mb-3 rounded-full border-2 animate-spin" style={{ borderColor: C.border, borderTopColor: C.amber }} />
                <span className="text-[12px] font-mono" style={{ color: C.textSecondary }}>Running historical cycles…</span>
              </div>
            ) : backtest ? (
              <div className="space-y-5">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                  <DataCell label="Mean error" value={money(backtest.summary.mean_error)} />
                  <DataCell label="Win rate" value={pct(backtest.summary.win_rate)} tone="green" />
                  <DataCell label="Avg profit / trade" value={money(backtest.summary.avg_profit)} tone={backtest.summary.avg_profit >= 0 ? 'green' : 'red'} />
                </div>

                <div className="border-t pt-4" style={{ borderColor: C.border }}>
                  <h3 className="text-[11px] font-mono uppercase tracking-[0.18em] mb-3" style={{ color: C.textMuted }}>Signal log</h3>
                  <div className="overflow-x-auto rounded-[8px]" style={{ border: `1px solid ${C.border}` }}>
                    <table className="w-full text-[12px] font-mono border-collapse">
                      <thead>
                        <tr className="border-b text-[10px] uppercase tracking-wider" style={{ borderColor: C.border, color: C.textMuted }}>
                          <th className="text-left px-3 py-2.5 font-medium">Time</th>
                          <th className="text-right px-3 py-2.5 font-medium">Predicted</th>
                          <th className="text-right px-3 py-2.5 font-medium">Actual</th>
                          <th className="text-right px-3 py-2.5 font-medium">Error</th>
                          <th className="text-center px-3 py-2.5 font-medium">Signal</th>
                          <th className="text-right px-3 py-2.5 font-medium">P&amp;L</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backtest.predictions.map((row, idx) => (
                          <tr key={idx} className="border-b last:border-0" style={{ borderColor: 'rgba(38,40,56,0.6)', background: idx % 2 === 1 ? C.panelRaised : 'transparent' }}>
                            <td className="px-3 py-2.5" style={{ color: C.textMuted }}>{row.time}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: C.textSecondary }}>{money(row.predicted)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: C.textSecondary }}>{money(row.actual)}</td>
                            <td className="px-3 py-2.5 text-right tabular-nums" style={{ color: C.textMuted }}>{money(row.error)}</td>
                            <td className="px-3 py-2.5 text-center">
                              <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold" style={{
                                color: row.recommendation === 'BUY' ? C.green : C.red,
                                border: `1px solid ${row.recommendation === 'BUY' ? 'rgba(49,214,156,0.35)' : 'rgba(245,105,122,0.35)'}`,
                                background: row.recommendation === 'BUY' ? 'rgba(49,214,156,0.08)' : 'rgba(245,105,122,0.08)',
                              }}>{row.recommendation}</span>
                            </td>
                            <td className="px-3 py-2.5 text-right font-semibold tabular-nums" style={{ color: row.pnl >= 0 ? C.green : C.red }}>
                              {row.pnl >= 0 ? '+' : '-'}{money(Math.abs(row.pnl))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[8px] border border-dashed px-4 py-6 text-center" style={{ borderColor: C.borderStrong }}>
                <p className="text-[12px] leading-relaxed" style={{ color: C.textMuted }}>
                  Runs simulations over historical cycles to compute win rate and signal error metrics.
                </p>
              </div>
            )}
          </div>
        </Panel>

      </div>
    </div>
  )
}

export default DashboardPage