import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

/**
 * 波情報データを取得・管理するComposable
 */
export function useWaveData() {
  const waveData = ref(new Map())
  const loading = ref(false)
  const error = ref(null)
  const lastUpdate = ref(null)
  
  // 自動更新用のタイマー
  let updateInterval = null
  
  /**
   * 指定された座標の波情報を取得
   * @param {number} lat - 緯度
   * @param {number} lon - 経度
   * @param {string} spotId - サーフスポットID
   */
  const fetchWaveData = async (lat, lon, spotId) => {
    try {
      loading.value = true
      error.value = null
      
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
      
      if (!apiKey) {
        console.error('OpenWeatherMap API key is not set')
        error.value = 'API key is not configured'
        return null
      }
      
      // OpenWeatherMap APIとOpen-Meteo Marine APIを並行して呼び出し
      console.log(`Fetching data for coordinates: ${lat}, ${lon}`)
      
      const [weatherResponse, marineResponse] = await Promise.all([
        axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat,
            lon,
            appid: apiKey,
            units: 'metric'
          }
        }),
        axios.get('https://marine-api.open-meteo.com/v1/marine', {
          params: {
            latitude: lat,
            longitude: lon,
            current: 'wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period',
            timezone: 'auto'
          }
        }).catch(err => {
          console.error('Marine API error:', err.message, err.response?.data)
          return null
        })
      ])
      
      // Marine APIデータを取得
      const marineData = marineResponse?.data?.current || {}
      console.log('Marine API response:', marineData)
      
      // データを整形
      const weatherData = {
        temp: Math.round(weatherResponse.data.main.temp),
        temperature: Math.round(weatherResponse.data.main.temp),
        windSpeed: Math.round(weatherResponse.data.wind.speed * 10) / 10,
        wind_speed: Math.round(weatherResponse.data.wind.speed * 10) / 10,
        windDir: getWindDirection(weatherResponse.data.wind.deg),
        wind_direction: getWindDirection(weatherResponse.data.wind.deg),
        humidity: weatherResponse.data.main.humidity,
        pressure: weatherResponse.data.main.pressure,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
        // Marine API データ（数値型で保存）
        waveHeight: marineData.wave_height !== undefined && marineData.wave_height !== null
          ? Math.round(marineData.wave_height * 10) / 10
          : null,
        wave_height: marineData.wave_height !== undefined && marineData.wave_height !== null
          ? Math.round(marineData.wave_height * 10) / 10
          : null,
        waveDirection: marineData.wave_direction ? getWindDirection(marineData.wave_direction) : 'N/A',
        wave_direction: marineData.wave_direction ? getWindDirection(marineData.wave_direction) : 'N/A',
        wavePeriod: marineData.wave_period ? `${Math.round(marineData.wave_period)}s` : 'N/A',
        wave_period: marineData.wave_period ? `${Math.round(marineData.wave_period)}s` : 'N/A',
        swellHeight: marineData.swell_wave_height !== undefined && marineData.swell_wave_height !== null
          ? `${Math.round(marineData.swell_wave_height * 10) / 10}`
          : 'N/A',
        swell_height: marineData.swell_wave_height !== undefined && marineData.swell_wave_height !== null
          ? `${Math.round(marineData.swell_wave_height * 10) / 10}`
          : 'N/A',
        swellDirection: marineData.swell_wave_direction ? getWindDirection(marineData.swell_wave_direction) : 'N/A',
        swell_direction: marineData.swell_wave_direction ? getWindDirection(marineData.swell_wave_direction) : 'N/A',
        swellPeriod: marineData.swell_wave_period ? `${Math.round(marineData.swell_wave_period)}s` : 'N/A',
        swell_period: marineData.swell_wave_period ? `${Math.round(marineData.swell_wave_period)}s` : 'N/A'
      }
      
      console.log('Formatted weather data:', {
        waveHeight: weatherData.waveHeight,
        temp: weatherData.temp
      })
      
      // データをMapに保存
      waveData.value.set(spotId, weatherData)
      lastUpdate.value = new Date()
      
      return weatherData
    } catch (err) {
      console.error('Error fetching wave data:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to fetch weather data'
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 風向きを度数から方位に変換
   * @param {number} deg - 度数（0-360）
   */
  const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(deg / 22.5) % 16
    return directions[index]
  }
  
  /**
   * 複数のサーフスポットの波情報を一括取得
   * @param {Array} spots - サーフスポットの配列
   */
  const fetchAllWaveData = async (spots) => {
    loading.value = true
    error.value = null
    
    try {
      const promises = spots.map(spot => 
        fetchWaveData(spot.location.lat, spot.location.lon, spot.id)
          .catch(err => {
            console.error(`Failed to fetch data for ${spot.name}:`, err)
            return null
          })
      )
      
      await Promise.all(promises)
      lastUpdate.value = new Date()
    } catch (err) {
      console.error('Error fetching all wave data:', err)
      error.value = 'データの一括取得に失敗しました'
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 特定のスポットの波情報を取得
   * @param {string} spotId - サーフスポットID
   */
  const getWaveDataForSpot = (spotId) => {
    return waveData.value.get(spotId)
  }
  
  /**
   * 自動更新を開始
   * @param {Array} spots - サーフスポットの配列
   * @param {number} intervalMinutes - 更新間隔（分）
   */
  const startAutoUpdate = (spots, intervalMinutes = 30) => {
    // 既存のタイマーをクリア
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    
    // 初回データ取得
    fetchAllWaveData(spots)
    
    // 定期的に更新
    updateInterval = setInterval(() => {
      console.log('Auto-updating wave data...')
      fetchAllWaveData(spots)
    }, intervalMinutes * 60 * 1000)
  }
  
  /**
   * 自動更新を停止
   */
  const stopAutoUpdate = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
  
  /**
   * データをクリア
   */
  const clearData = () => {
    waveData.value.clear()
    error.value = null
    lastUpdate.value = null
  }
  
  // コンポーネントがアンマウントされたときにタイマーをクリア
  onUnmounted(() => {
    stopAutoUpdate()
  })
  
  return {
    waveData,
    loading,
    error,
    lastUpdate,
    fetchWaveData,
    fetchAllWaveData,
    getWaveDataForSpot,
    startAutoUpdate,
    stopAutoUpdate,
    clearData
  }
}

// Made with Bob
