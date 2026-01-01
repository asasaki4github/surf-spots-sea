import { ref, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * Mapbox地図を管理するComposable
 */
export function useMapbox() {
  const map = ref(null)
  const markers = ref([])
  const isMapLoaded = ref(false)
  
  /**
   * 地図を初期化
   * @param {string} containerId - 地図コンテナのID
   * @param {object} options - 地図オプション
   */
  const initMap = (containerId, options = {}) => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    
    if (!accessToken) {
      console.error('Mapbox access token is not set')
      return
    }
    
    mapboxgl.accessToken = accessToken
    
    const defaultOptions = {
      container: containerId,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [103.8198, 1.3521], // シンガポールを中心に
      zoom: 6,
      pitch: 0,
      bearing: 0
    }
    
    map.value = new mapboxgl.Map({
      ...defaultOptions,
      ...options
    })
    
    // 地図の読み込み完了イベント
    map.value.on('load', () => {
      isMapLoaded.value = true
      console.log('Map loaded successfully')
    })
    
    // ナビゲーションコントロールを追加
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
    
    // スケールコントロールを追加
    map.value.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left')
    
    return map.value
  }
  
  /**
   * マーカーを追加
   * @param {object} spot - サーフスポット情報
   * @param {function} onClick - クリック時のコールバック
   */
  const addMarker = (spot, onClick) => {
    if (!map.value) return
    
    // カスタムマーカー要素を作成
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.style.width = '40px'
    el.style.height = '40px'
    el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiMwZWE1ZTkiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPgo8cGF0aCBkPSJNMjAgMTBDMTguNSAxMCAxNyAxMS41IDE3IDEzQzE3IDE0LjUgMTguNSAxNiAyMCAxNkMyMS41IDE2IDIzIDE0LjUgMjMgMTNDMjMgMTEuNSAyMS41IDEwIDIwIDEwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE1IDE4QzE0IDE4IDEzIDE5IDEzIDIwQzEzIDIxIDE0IDIyIDE1IDIyQzE2IDIyIDE3IDIxIDE3IDIwQzE3IDE5IDE2IDE4IDE1IDE4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI1IDE4QzI0IDE4IDIzIDE5IDIzIDIwQzIzIDIxIDI0IDIyIDI1IDIyQzI2IDIyIDI3IDIxIDI3IDIwQzI3IDE5IDI2IDE4IDI1IDE4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIwIDI0QzE4IDI0IDE2IDI1IDE2IDI3QzE2IDI5IDE4IDMwIDIwIDMwQzIyIDMwIDI0IDI5IDI0IDI3QzI0IDI1IDIyIDI0IDIwIDI0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)'
    el.style.backgroundSize = 'cover'
    el.style.cursor = 'pointer'
    
    // マーカーを作成
    const marker = new mapboxgl.Marker(el)
      .setLngLat([spot.location.lon, spot.location.lat])
      .addTo(map.value)
    
    // クリックイベント
    el.addEventListener('click', () => {
      if (onClick) onClick(spot)
    })
    
    markers.value.push({ id: spot.id, marker, element: el })
    
    return marker
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
    
    map.value.flyTo({
      center: [lon, lat],
      zoom: zoom,
      duration: 2000
    })
  }
  
  /**
   * すべてのマーカーが表示されるように地図を調整
   * @param {Array} spots - サーフスポットの配列
   */
  const fitBounds = (spots) => {
    if (!map.value || !spots.length) return
    
    const bounds = new mapboxgl.LngLatBounds()
    
    spots.forEach(spot => {
      bounds.extend([spot.location.lon, spot.location.lat])
    })
    
    map.value.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
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
      // SVGの色を動的に変更する場合はここで実装
      // 簡易的にはクラスを変更するなど
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
    destroyMap
  }
}

// Made with Bob
