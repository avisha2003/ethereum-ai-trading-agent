import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend)



const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#94a3b8',
        maxTicksLimit: 8,
      },
    },
    y: {
      grid: {
        color: 'rgba(148, 163, 184, 0.12)',
      },
      ticks: {
        color: '#94a3b8',
      },
    },
  },
}

function PriceChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center text-slate-400 font-medium rounded-2xl bg-slate-900/20 border border-dashed border-white/5">
        <span className="text-sm">Market data currently unavailable.</span>
      </div>
    )
  }

  const data = {
    labels: chartData.map((d) => d.time),
    datasets: [
      {
        label: 'ETH/USD',
        data: chartData.map((d) => d.price),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.16)',
        tension: 0.38,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  )
}

export default PriceChart
