// OpenWeatherMap APIプロキシ - APIキーを隠すためのサーバーレス関数
export async function handler(event, context) {
  // CORSヘッダー
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  }

  // OPTIONSリクエスト（プリフライト）の処理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // GETリクエストのみ許可
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // クエリパラメータから緯度経度を取得
    const { lat, lon } = event.queryStringParameters || {}

    if (!lat || !lon) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing lat or lon parameter' })
      }
    }

    // 環境変数からAPIキーを取得
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      }
    }

    // OpenWeatherMap APIを呼び出し
    // 注: OpenWeatherMapの無料プランでは波情報が限定的なため、
    // 風速・風向などの気象データを取得します
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    
    const response = await fetch(weatherUrl)
    
    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.status}`)
    }

    const data = await response.json()

    // レスポンスデータを整形
    const waveData = {
      location: {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        name: data.name
      },
      weather: {
        description: data.weather[0]?.description || 'N/A',
        temp: data.main?.temp || 0,
        feels_like: data.main?.feels_like || 0
      },
      wind: {
        speed: data.wind?.speed || 0,
        direction: data.wind?.deg || 0,
        gust: data.wind?.gust || 0
      },
      // 波情報は簡易的に風速から推定（実際のAPIでは正確な波情報が必要）
      wave: {
        height: estimateWaveHeight(data.wind?.speed || 0),
        period: estimateWavePeriod(data.wind?.speed || 0),
        direction: data.wind?.deg || 0
      },
      timestamp: new Date().toISOString(),
      source: 'OpenWeatherMap'
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(waveData)
    }

  } catch (error) {
    console.error('Error fetching wave data:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch wave data',
        message: error.message 
      })
    }
  }
}

// 風速から波高を推定する簡易関数（実際のAPIではより正確なデータが必要）
function estimateWaveHeight(windSpeed) {
  // 風速（m/s）から波高（m）を簡易推定
  // Beaufort scaleを参考にした簡易計算
  if (windSpeed < 2) return 0.1
  if (windSpeed < 5) return 0.3
  if (windSpeed < 8) return 0.6
  if (windSpeed < 11) return 1.0
  if (windSpeed < 14) return 1.5
  if (windSpeed < 17) return 2.5
  return 3.5
}

// 風速から波周期を推定する簡易関数
function estimateWavePeriod(windSpeed) {
  // 風速（m/s）から波周期（秒）を簡易推定
  if (windSpeed < 5) return 4
  if (windSpeed < 10) return 6
  if (windSpeed < 15) return 8
  return 10
}

// Made with Bob
