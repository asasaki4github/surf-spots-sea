// データフォーマット用のユーティリティ関数

/**
 * 風向を度数から方位に変換
 * @param {number} degrees - 風向（度）
 * @returns {string} 方位（N, NE, E, SE, S, SW, W, NW）
 */
export function formatWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

/**
 * 波高をフォーマット
 * @param {number} height - 波高（メートル）
 * @returns {string} フォーマットされた波高
 */
export function formatWaveHeight(height) {
  return `${height.toFixed(1)}m`
}

/**
 * 風速をフォーマット
 * @param {number} speed - 風速（m/s）
 * @returns {string} フォーマットされた風速
 */
export function formatWindSpeed(speed) {
  return `${speed.toFixed(1)} m/s`
}

/**
 * 波周期をフォーマット
 * @param {number} period - 波周期（秒）
 * @returns {string} フォーマットされた波周期
 */
export function formatWavePeriod(period) {
  return `${period}s`
}

/**
 * 温度をフォーマット
 * @param {number} temp - 温度（摂氏）
 * @returns {string} フォーマットされた温度
 */
export function formatTemperature(temp) {
  return `${Math.round(temp)}°C`
}

/**
 * タイムスタンプをフォーマット
 * @param {string} timestamp - ISO形式のタイムスタンプ
 * @returns {string} フォーマットされた日時
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * 波のコンディションを評価
 * @param {number} height - 波高（メートル）
 * @param {number} windSpeed - 風速（m/s）
 * @returns {object} コンディション情報
 */
export function evaluateConditions(height, windSpeed) {
  let rating = 'good'
  let message = '良好なコンディション'
  
  if (height < 0.3) {
    rating = 'flat'
    message = 'フラット - 波が小さすぎます'
  } else if (height < 0.8) {
    rating = 'small'
    message = '小波 - 初心者向け'
  } else if (height < 1.5) {
    rating = 'good'
    message = '良好 - サーフィンに最適'
  } else if (height < 2.5) {
    rating = 'big'
    message = '大波 - 中級者以上向け'
  } else {
    rating = 'huge'
    message = '非常に大きな波 - 上級者のみ'
  }
  
  if (windSpeed > 10) {
    rating = 'windy'
    message = '強風 - コンディション悪化'
  }
  
  return { rating, message }
}

/**
 * コンディションレーティングに応じた色を取得
 * @param {string} rating - コンディションレーティング
 * @returns {string} Tailwind CSSカラークラス
 */
export function getConditionColor(rating) {
  const colors = {
    flat: 'text-gray-500',
    small: 'text-blue-400',
    good: 'text-green-500',
    big: 'text-orange-500',
    huge: 'text-red-500',
    windy: 'text-purple-500'
  }
  return colors[rating] || 'text-gray-500'
}

// Made with Bob
