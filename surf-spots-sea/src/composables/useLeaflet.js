import { ref, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leafletのデフォルトアイコンの問題を修正
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

/**
 * Leaflet地図を管理するComposable
 */
export function useLeaflet() {
  const map = ref(null)
  const markers = ref([])
  const isMapLoaded = ref(false)
  
  /**
   * 地図を初期化
   * @param {string} containerId - 地図コンテナのID
   * @param {object} options - 地図オプション
   */
  const initMap = (containerId, options = {}) => {
    const defaultOptions = {
      center: [1.3521, 103.8198], // シンガポールを中心に [lat, lng]
      zoom: 6,
      zoomControl: true,
      attributionControl: true
    }
    
    map.value = L.map(containerId, {
      ...defaultOptions,
      ...options
    })
    
    // Standard OpenStreetMap Tiles
    // 標準的なOpenStreetMapスタイル
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: 'abc',
      maxZoom: 19
    }).addTo(map.value)
    
    // 地図の読み込み完了
    map.value.whenReady(() => {
      isMapLoaded.value = true
      console.log('Map loaded successfully')
    })
    
    // スケールコントロールを追加
    L.control.scale({
      maxWidth: 100,
      metric: true,
      imperial: false,
      position: 'bottomleft'
    }).addTo(map.value)
    
    return map.value
  }
  
  /**
   * 波の高さに応じた色を取得
   * @param {number|string} waveHeight - 波の高さ (m)
   */
  const getWaveColor = (waveHeight) => {
    // データがない場合はグレー
    if (!waveHeight || waveHeight === 'N/A' || waveHeight === null || waveHeight === undefined) {
      return { primary: '#6f6f6f', secondary: '#525252', shadow: 'rgba(111, 111, 111, 0.4)' } // グレー: データなし
    }
    
    // 文字列の場合は数値に変換
    const height = typeof waveHeight === 'string' ? parseFloat(waveHeight) : waveHeight
    
    // 数値変換に失敗した場合もグレー
    if (isNaN(height)) {
      return { primary: '#6f6f6f', secondary: '#525252', shadow: 'rgba(111, 111, 111, 0.4)' }
    }
    
    if (height < 0.5) {
      return { primary: '#0f62fe', secondary: '#0043ce', shadow: 'rgba(15, 98, 254, 0.4)' } // 青: 小波 (Flat)
    } else if (height < 1.0) {
      return { primary: '#24a148', secondary: '#198038', shadow: 'rgba(36, 161, 72, 0.4)' } // 緑: 良好 (Good)
    } else if (height < 2.0) {
      return { primary: '#f1c21b', secondary: '#d4a500', shadow: 'rgba(241, 194, 27, 0.4)' } // 黄: 中波 (Moderate)
    } else if (height < 3.0) {
      return { primary: '#ff832b', secondary: '#e65c00', shadow: 'rgba(255, 131, 43, 0.4)' } // オレンジ: 大波 (Big)
    } else {
      return { primary: '#da1e28', secondary: '#a2191f', shadow: 'rgba(218, 30, 40, 0.4)' } // 赤: 巨大波 (Huge)
    }
  }

  /**
   * カスタムサーフアイコンを作成 (波の高さに応じて色が変わる)
   * @param {number} waveHeight - 波の高さ (m)
   */
  const createSurfIcon = (waveHeight = null) => {
    const colors = getWaveColor(waveHeight)
    
    return L.divIcon({
      className: 'custom-surf-marker',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${colors.shadow};
          cursor: pointer;
          transition: all 0.3s ease;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.6.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.45c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.17.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.43 2.95-.8c.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm2.95-8.08c-.75-.38-1.6-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.37-1.6-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.93c1.35 0 2.2-.43 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.6.8 2.95.8V5.04c-.9 0-1.4-.25-2.05-.58zM17 8.09c-1.35 0-2.2.43-2.95.8-.65.35-1.15.6-2.05.6s-1.4-.25-2.05-.6c-.75-.38-1.6-.8-2.95-.8s-2.2.43-2.95.8c-.65.35-1.15.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.6.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.6.8 2.95.8V8.89c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8z"/>
          </svg>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    })
  }
  
  /**
   * カスタムゴルフアイコンを作成 (IBM Design)
   */
  const createGolfIcon = () => {
    return L.divIcon({
      className: 'custom-golf-marker',
      html: `
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #24a148 0%, #198038 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(36, 161, 72, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.69 2 6 4.69 6 8s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 2v8h2v-8h-2z"/>
            <circle cx="12" cy="8" r="1.5"/>
          </svg>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24]
    })
  }
  
  /**
   * マーカーを追加
   * @param {object} location - ロケーション情報 (surf or golf)
   * @param {function} onClick - クリック時のコールバック
   * @param {object} weatherData - 天候データ (オプション)
   */
  const addMarker = (location, onClick, weatherData = null) => {
    if (!map.value) return
    
    // ロケーションタイプに応じてアイコンを選択
    // サーフスポットの場合は波の高さに応じて色を変更
    let icon
    if (location.type === 'surf') {
      const waveHeight = weatherData?.waveHeight || weatherData?.wave_height
      icon = createSurfIcon(waveHeight)
    } else {
      icon = createGolfIcon()
    }
    
    const marker = L.marker(
      [location.location.lat, location.location.lon],
      { icon }
    ).addTo(map.value)
    
    // クリックイベント
    marker.on('click', () => {
      if (onClick) onClick(location)
    })
    
    // ホバー時の詳細情報ツールチップ
    const tooltipContent = createTooltipContent(location, weatherData)
    marker.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'auto',
      offset: [15, 0],
      className: 'custom-tooltip',
      autoPan: true,
      autoPanPadding: [80, 80],
      keepInView: true,
      maxWidth: 320
    })
    
    markers.value.push({ id: location.id, marker })
    
    return marker
  }
  
  /**
   * ツールチップコンテンツを作成 (Light Mode + Real-time Weather)
   */
  const createTooltipContent = (location, weatherData) => {
    const typeLabel = location.type === 'surf' ? '🏄 Surf Spot' : '⛳ Golf Course'
    const accentColor = location.type === 'surf' ? '#0f62fe' : '#24a148'
    const lightAccent = location.type === 'surf' ? '#d0e2ff' : '#a7f0ba'
    
    let content = `
      <div style="
        font-family: 'IBM Plex Sans', sans-serif;
        min-width: 280px;
        max-width: 320px;
        padding: 0;
        background: white;
        border: 2px solid ${accentColor};
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, ${accentColor} 0%, ${location.type === 'surf' ? '#0043ce' : '#198038'} 100%);
          padding: 12px 16px;
        ">
          <div style="font-size: 11px; color: rgba(255,255,255,0.9); margin-bottom: 4px; font-weight: 500; text-transform: uppercase;">${typeLabel}</div>
          <div style="font-size: 17px; font-weight: 700; color: white; margin-bottom: 4px;">${location.name}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.95); display: flex; align-items: center;">
            <span style="margin-right: 4px;">📍</span>
            <span>${location.country} • ${location.distance || 'N/A'}</span>
          </div>
        </div>
        
        <!-- Image (if available) -->
        ${location.image ? `
        <div style="
          width: 100%;
          height: 180px;
          overflow: hidden;
          position: relative;
        ">
          <img
            src="${location.image}"
            alt="${location.name}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            "
            onerror="this.style.display='none'"
          />
          <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
            padding: 8px 12px;
            color: white;
            font-size: 10px;
            font-weight: 500;
          ">
            📸 ${location.name}
          </div>
        </div>
        ` : ''}
        
        <!-- Japanese Comment (if available) -->
        ${location.comment ? `
        <div style="
          padding: 12px 16px;
          background: linear-gradient(135deg, #f4f4f4 0%, #e8e8e8 100%);
          border-bottom: 1px solid #d0d0d0;
        ">
          <div style="font-size: 11px; color: #525252; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
            💬 一言メモ
          </div>
          <div style="
            font-size: 13px;
            color: #161616;
            line-height: 1.6;
            font-weight: 500;
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;
          ">
            ${location.comment}
          </div>
        </div>
        ` : ''}
        
        <!-- Weather Info -->
        <div style="padding: 14px 16px; background: #f4f4f4;">
    `
    
    if (weatherData && weatherData.temp) {
      const temp = weatherData.temp || weatherData.temperature || 'N/A'
      const windSpeed = weatherData.windSpeed || weatherData.wind_speed || 'N/A'
      const windDir = weatherData.windDir || weatherData.wind_direction || 'N/A'
      const waveHeight = weatherData.waveHeight || weatherData.wave_height || 'N/A'
      const waveDirection = weatherData.waveDirection || weatherData.wave_direction || 'N/A'
      const wavePeriod = weatherData.wavePeriod || weatherData.wave_period || 'N/A'
      const swellHeight = weatherData.swellHeight || weatherData.swell_height || 'N/A'
      const swellDirection = weatherData.swellDirection || weatherData.swell_direction || 'N/A'
      
      content += `
          <div style="
            background: white;
            border: 2px solid ${lightAccent};
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
          ">
            <div style="font-size: 11px; color: #525252; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
              ⚡ Real-time Conditions
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">🌡️</div>
                <div style="font-size: 18px; font-weight: 700; color: #f59e0b; margin-bottom: 2px;">${temp}°C</div>
                <div style="font-size: 9px; color: #6f6f6f;">Temperature</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">💨</div>
                <div style="font-size: 18px; font-weight: 700; color: #0f62fe; margin-bottom: 2px;">${windSpeed} m/s</div>
                <div style="font-size: 9px; color: #6f6f6f;">Wind Speed</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">🧭</div>
                <div style="font-size: 18px; font-weight: 700; color: #8a3ffc; margin-bottom: 2px;">${windDir}</div>
                <div style="font-size: 9px; color: #6f6f6f;">Wind Dir</div>
              </div>
              ${location.type === 'surf' ? `
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">🌊</div>
                <div style="font-size: 18px; font-weight: 700; color: #24a148; margin-bottom: 2px;">${waveHeight}m</div>
                <div style="font-size: 9px; color: #6f6f6f;">Wave Height</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">↗️</div>
                <div style="font-size: 18px; font-weight: 700; color: #0f62fe; margin-bottom: 2px;">${waveDirection}</div>
                <div style="font-size: 9px; color: #6f6f6f;">Wave Dir</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">⏱️</div>
                <div style="font-size: 18px; font-weight: 700; color: #8a3ffc; margin-bottom: 2px;">${wavePeriod}</div>
                <div style="font-size: 9px; color: #6f6f6f;">Wave Period</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">〰️</div>
                <div style="font-size: 18px; font-weight: 700; color: #da1e28; margin-bottom: 2px;">${swellHeight}m</div>
                <div style="font-size: 9px; color: #6f6f6f;">Swell Height</div>
              </div>
              <div style="background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #e0e0e0;">
                <div style="font-size: 18px; margin-bottom: 2px;">🔄</div>
                <div style="font-size: 18px; font-weight: 700; color: #da1e28; margin-bottom: 2px;">${swellDirection}</div>
                <div style="font-size: 9px; color: #6f6f6f;">Swell Dir</div>
              </div>
              ` : ''}
            </div>
          </div>
          <div style="font-size: 10px; color: #6f6f6f; text-align: center; background: white; padding: 6px; border-radius: 6px;">
            ⏰ Updated: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
      `
    } else {
      content += `
          <div style="
            background: white;
            border: 2px dashed #c6c6c6;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
          ">
            <div style="font-size: 24px; margin-bottom: 8px;">⏳</div>
            <div style="font-size: 13px; color: #525252; font-weight: 500;">
              Loading weather data...
            </div>
          </div>
      `
    }
    
    content += `
        </div>
        
        <!-- Footer -->
        <div style="
          background: ${accentColor};
          padding: 8px 16px;
          font-size: 10px;
          color: white;
          text-align: center;
          font-weight: 500;
        ">
          Click marker for detailed information
        </div>
      </div>
    `
    
    return content
  }
  
  /**
   * すべてのマーカーを削除
   */
  const clearMarkers = () => {
    markers.value.forEach(({ marker }) => {
      marker.remove()
    })
    markers.value = []
  }
  
  /**
   * 特定の位置に地図を移動
   * @param {number} lon - 経度
   * @param {number} lat - 緯度
   * @param {number} zoom - ズームレベル
   */
  const flyTo = (lon, lat, zoom = 10) => {
    if (!map.value) return
    
    map.value.flyTo([lat, lon], zoom, {
      duration: 2
    })
  }
  
  /**
   * すべてのマーカーが表示されるように地図を調整
   * @param {Array} spots - サーフスポットの配列
   */
  const fitBounds = (spots) => {
    if (!map.value || !spots.length) return
    
    const bounds = L.latLngBounds(
      spots.map(spot => [spot.location.lat, spot.location.lon])
    )
    
    map.value.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 10
    })
  }
  
  /**
   * マーカーの色を更新（波のコンディションに応じて）
   * @param {string} spotId - サーフスポットID
   * @param {string} color - 色（hex）
   */
  const updateMarkerColor = (spotId, color) => {
    const markerData = markers.value.find(m => m.id === spotId)
    if (markerData) {
      // 必要に応じてマーカーの色を変更
      // Leafletでは新しいアイコンを設定する必要がある
    }
  }
  
  /**
   * 地図を破棄
   */
  const destroyMap = () => {
    if (map.value) {
      clearMarkers()
      map.value.remove()
      map.value = null
      isMapLoaded.value = false
    }
  }
  
  // コンポーネントがアンマウントされたときに地図を破棄
  onUnmounted(() => {
    destroyMap()
  })
  
  return {
    map,
    markers,
    isMapLoaded,
    initMap,
    addMarker,
    clearMarkers,
    flyTo,
    fitBounds,
    updateMarkerColor,
    destroyMap,
    createSurfIcon,
    createGolfIcon,
    createTooltipContent
  }
}

// Made with Bob