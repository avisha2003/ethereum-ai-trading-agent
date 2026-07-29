import axios from 'axios'

export const fetchEthereumHistory = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
      params: {
        vs_currency: 'usd',
        days: '1'
      }
    })
    
    if (response.data && response.data.prices) {
      // Return mapped points
      return response.data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        price: parseFloat(price.toFixed(2))
      }))
    }
    throw new Error('Invalid format returned from CoinGecko')
  } catch (error) {
    console.error('Error fetching Ethereum market chart data:', error)
    throw error
  }
}
