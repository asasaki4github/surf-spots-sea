<template>
  <div class="relative w-full h-full">
    <!-- 地図コンテナ -->
    <div ref="mapContainer" id="map" class="w-full h-full"></div>

    <!-- ポップアップオーバーレイ -->
    <Transition name="popup">
      <div
        v-if="selectedSpot"
        class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm px-4"
      >
        <SpotPopup
          :spot="selectedSpot"
          :wave-data="getWaveDataForSpot(selectedSpot.id)"
          :loading="loading"
          :error="error"
          @close="closePopup"
          @retry="retryFetchData"
        />
      </div>
    </Transition>

    <!-- 更新情報バー -->
    <div
      v-if="lastUpdate"
      class="absolute bottom-4 left-4 bg-white rounded-lg shadow-md px-4 py-2 text-sm text-gray-600"
    >
      <div class="flex items-center space-x-2">
        <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>最終更新: {{ formatTimestamp(lastUpdate) }}</span>
      </div>
    </div>

    <!-- ローディングオーバーレイ -->
    <div
      v-if="initialLoading"
      class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20"
    >
      <LoadingSpinner size="lg" text="地図を読み込んでいます..." />
    </div>

    <!-- エラー表示 -->
    <div
      v-if="globalError"
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4"
    >
      <ErrorMessage
        type="error"
        title="エラー"
        :message="globalError"
        :show-retry="true"
        :dismissible="true"
        @retry="retryInit"
        @dismiss="globalError = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import L from 'leaflet'
import { useLeaflet } from '@/composables/useLeaflet'
import { useWaveData } from '@/composables/useWaveData'
import { locations as defaultLocations } from '@/data/locations'
import { formatTimestamp } from '@/utils/formatters'
import SpotPopup from './SpotPopup.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'

// Props
const props = defineProps({
  filterType: {
    type: String,
    default: 'all' // 'all', 'surf', 'golf'
  },
  locations: {
    type: Array,
    default: () => defaultLocations
  }
})

const mapContainer = ref(null)
const selectedSpot = ref(null)
const initialLoading = ref(true)
const globalError = ref(null)

// Leaflet composable
const {
  map,
  markers,
  isMapLoaded,
  initMap,
  addMarker,
  clearMarkers,
  fitBounds,
  createSurfIcon,
  createGolfIcon,
  createTooltipContent
} = useLeaflet()

// フィルターされたロケーション
const filteredLocations = computed(() => {
  if (props.filterType === 'all') return props.locations
  return props.locations.filter(loc => loc.type === props.filterType)
})

// Wave data composable
const {
  waveData,
  loading,
  error,
  lastUpdate,
  fetchWaveData,
  getWaveDataForSpot,
  startAutoUpdate
} = useWaveData()

// マーカークリック時の処理
const handleMarkerClick = async (spot) => {
  selectedSpot.value = spot
  
  // まだデータがない場合は取得
  if (!getWaveDataForSpot(spot.id)) {
    try {
      await fetchWaveData(spot.location.lat, spot.location.lon, spot.id)
    } catch (err) {
      console.error('Failed to fetch wave data:', err)
    }
  }
}

// ポップアップを閉じる
const closePopup = () => {
  selectedSpot.value = null
}

// データ再取得
const retryFetchData = async () => {
  if (selectedSpot.value) {
    try {
      await fetchWaveData(
        selectedSpot.value.location.lat,
        selectedSpot.value.location.lon,
        selectedSpot.value.id
      )
    } catch (err) {
      console.error('Retry failed:', err)
    }
  }
}

// 初期化の再試行
const retryInit = () => {
  globalError.value = null
  initializeMap()
}

// 地図の初期化
const initializeMap = async () => {
  try {
    initialLoading.value = true
    globalError.value = null

    // ユーザーの位置情報を取得
    let userLat = 1.3521 // デフォルト: シンガポール
    let userLon = 103.8198
    let locationSource = 'default'
    
    try {
      const position = await new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 0
          })
        } else {
          reject(new Error('Geolocation not supported'))
        }
      })
      
      userLat = position.coords.latitude
      userLon = position.coords.longitude
      locationSource = 'user'
      console.log(`User location detected: ${userLat}, ${userLon}`)
    } catch (geoError) {
      console.warn('Could not get user location, using Singapore as default:', geoError.message)
      console.log(`Default location (Singapore): ${userLat}, ${userLon}`)
    }

    // 地図を初期化 - 100km圏内を表示 (zoom level 9)
    initMap('map', {
      center: [userLat, userLon],
      zoom: 9 // 100km圏内を表示
    })

    // 地図の読み込みを待つ
    await new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (isMapLoaded.value) {
          clearInterval(checkLoaded)
          resolve()
        }
      }, 100)
    })

    // まずマーカーを全て追加（天候データなし）
    props.locations.forEach(location => {
      addMarker(location, handleMarkerClick, null)
    })

    // 天候データを並列で取得（バックグラウンド）
    console.log('Fetching weather data for all locations...')
    const weatherPromises = props.locations.map(async (location) => {
      try {
        console.log(`Fetching weather for: ${location.name}`)
        const weatherData = await fetchWaveData(location.location.lat, location.location.lon, location.id)
        
        if (weatherData) {
          console.log(`Weather data received for ${location.name}:`, {
            waveHeight: weatherData.waveHeight,
            temp: weatherData.temp
          })
          
          // 天候データ取得後、マーカーを更新
          const markerData = markers.value.find(m => m.id === location.id)
          if (markerData && location.type === 'surf') {
            // マーカーを削除して再作成（色を更新）
            markerData.marker.remove()
            
            // waveHeightを数値に変換
            const waveHeight = weatherData.waveHeight !== 'N/A' ? parseFloat(weatherData.waveHeight) : null
            console.log(`Creating new icon for ${location.name} with wave height: ${waveHeight}`)
            
            const newMarker = L.marker(
              [location.location.lat, location.location.lon],
              { icon: createSurfIcon(waveHeight) }
            ).addTo(map.value)
            
            newMarker.on('click', () => handleMarkerClick(location))
            
            const tooltipContent = createTooltipContent(location, weatherData)
            newMarker.bindTooltip(tooltipContent, {
              permanent: false,
              direction: 'auto',
              offset: [15, 0],
              className: 'custom-tooltip',
              autoPan: true,
              autoPanPadding: [80, 80],
              keepInView: true,
              maxWidth: 320
            })
            
            markerData.marker = newMarker
            console.log(`Marker updated for ${location.name}`)
          }
        }
      } catch (err) {
        console.error(`Failed to fetch weather for ${location.name}:`, err)
      }
    })
    
    // すべての天候データ取得を待つ（非ブロッキング）
    Promise.all(weatherPromises).then(() => {
      console.log('All weather data fetched successfully')
    })

    // すべてのマーカーが表示されるように調整
    fitBounds(props.locations)

    // すべてのロケーションの天候情報を自動更新（30分ごと）
    startAutoUpdate(props.locations, 30)

    initialLoading.value = false
  } catch (err) {
    console.error('Map initialization error:', err)
    globalError.value = 'Failed to initialize map. Please reload the page.'
    initialLoading.value = false
  }
}

// フィルター変更時にマーカーを更新
watch(() => props.filterType, async () => {
  if (map.value && isMapLoaded.value) {
    clearMarkers()
    for (const location of filteredLocations.value) {
      const weatherData = getWaveDataForSpot(location.id)
      addMarker(location, handleMarkerClick, weatherData)
    }
    if (filteredLocations.value.length > 0) {
      fitBounds(filteredLocations.value)
    }
  }
})

onMounted(() => {
  initializeMap()
})
</script>

<style scoped>
#map {
  font-family: 'Inter', sans-serif;
}

/* ポップアップアニメーション */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.popup-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* カスタムマーカースタイル */
:deep(.custom-marker) {
  transition: transform 0.2s ease;
}

:deep(.custom-marker:hover) {
  transform: scale(1.1);
}
</style>