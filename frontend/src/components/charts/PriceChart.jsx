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

const data = {
  labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
  datasets: [
    {
      label: 'ETH (mock)',
      data: [3180, 3215, 3196, 3264, 3330, 3310, 3378],
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56, 189, 248, 0.16)',
      tension: 0.38,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ],
}

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

function PriceChart() {
  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  )
}

export default PriceChart
