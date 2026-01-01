<template>
  <div id="app" class="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
    <!-- Light Mode Header with IBM Bob -->
    <header class="bg-white border-b-2 border-blue-600 shadow-lg z-20">
      <div class="px-4 md:px-6 py-3 md:py-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center space-x-3 md:space-x-4">
            <!-- IBM Bob Logo -->
            <div class="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <img src="/bob.svg" alt="IBM Bob" class="w-full h-full" />
            </div>
            <div class="min-w-0">
              <h1 class="text-lg md:text-2xl font-bold text-gray-900 tracking-tight truncate">Singapore - Surf & Turf Spots</h1>
              <p class="text-xs md:text-sm text-gray-600 truncate">2,000km radius • Real-time conditions • Powered by IBM Bob</p>
            </div>
          </div>
          
          <!-- Stats & Filters -->
          <div class="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-end">
            <!-- Stats -->
            <div class="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <div class="text-center">
                <div class="text-lg md:text-2xl font-bold text-blue-600">{{ stats.surf }}</div>
                <div class="text-xs text-gray-600">Surf</div>
              </div>
              <div class="w-px h-8 bg-blue-300"></div>
              <div class="text-center">
                <div class="text-lg md:text-2xl font-bold text-green-600">{{ stats.golf }}</div>
                <div class="text-xs text-gray-600">Golf</div>
              </div>
            </div>
            
            <!-- Filter Buttons -->
            <div class="flex items-center space-x-1 md:space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                @click="filterType = 'all'"
                :class="[
                  'px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all',
                  filterType === 'all' 
                    ? 'bg-white text-gray-900 shadow-md border-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                ]"
              >
                All
              </button>
              <button
                @click="filterType = 'surf'"
                :class="[
                  'px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center space-x-1',
                  filterType === 'surf' 
                    ? 'bg-white text-blue-700 shadow-md border-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                ]"
              >
                <span class="text-base md:text-lg">🏄</span>
                <span class="hidden sm:inline">Surf</span>
              </button>
              <button
                @click="filterType = 'golf'"
                :class="[
                  'px-2 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center space-x-1',
                  filterType === 'golf' 
                    ? 'bg-white text-green-700 shadow-md border-2 border-green-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                ]"
              >
                <span class="text-base md:text-lg">⛳</span>
                <span class="hidden sm:inline">Golf</span>
              </button>
            </div>
            
            <!-- View Toggle Buttons -->
            <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                @click="viewMode = 'map'"
                :class="[
                  'px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center space-x-1',
                  viewMode === 'map'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
                title="Map View"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span class="hidden sm:inline">Map</span>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all flex items-center space-x-1',
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
                title="List View"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="hidden sm:inline">List</span>
              </button>
            </div>
            
            <!-- Info Button -->
            <button
              @click="showInfo = !showInfo"
              class="p-2 md:p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-300 hover:border-blue-600"
              title="Information"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content (Map or List) -->
    <main class="flex-1 relative overflow-hidden">
      <MapView v-if="viewMode === 'map'" :filter-type="filterType" :locations="locations" />
      <ListView v-else :locations="locations" :filter-type="filterType" :weather-data="weatherData" @select-location="handleSelectLocation" />
    </main>

    <!-- Info Modal (Light Mode + Responsive) -->
    <Transition name="modal">
      <div
        v-if="showInfo"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="showInfo = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-2 border-blue-600">
          <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 md:px-8 py-5 md:py-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zm0 22c-5.5 0-10-4.5-10-10S10.5 6 16 6s10 4.5 10 10-4.5 10-10 10z"/>
                  <circle cx="12" cy="14" r="2"/>
                  <circle cx="20" cy="14" r="2"/>
                  <path d="M16 20c-2.2 0-4-1.3-4.7-3h1.5c.6 1 1.7 1.7 3.2 1.7s2.6-.7 3.2-1.7h1.5c-.7 1.7-2.5 3-4.7 3z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl md:text-2xl font-bold">About This Application</h2>
                <p class="text-blue-100 text-xs md:text-sm mt-1">Singapore 3,000km Radius Coverage</p>
              </div>
            </div>
            <button
              @click="showInfo = false"
              class="text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gray-50">
            <div class="bg-white rounded-xl p-5 md:p-6 border-2 border-blue-200 shadow-sm">
              <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span class="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
                  </svg>
                </span>
                Overview
              </h3>
              <p class="text-sm md:text-base text-gray-700 leading-relaxed ml-11 md:ml-13">
                Discover {{ stats.surf }} premium surf spots and {{ stats.golf }} world-class golf courses within 1,000km of Singapore.
                Get real-time weather conditions, wave information, and course details with live updates every 30 minutes.
              </p>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 md:p-6 border-2 border-blue-300">
                <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="text-2xl mr-2">🏄</span>
                  Surf Spots ({{ stats.surf }})
                </h3>
                <div class="space-y-2 text-xs md:text-sm text-gray-700">
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Indonesia (Bali, Lombok, Sumatra)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Malaysia (Desaru, Tioman, Cherating)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Thailand (Phuket)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Philippines (Siargao, La Union)</span>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 md:p-6 border-2 border-green-300">
                <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span class="text-2xl mr-2">⛳</span>
                  Golf Courses ({{ stats.golf }})
                </h3>
                <div class="space-y-2 text-xs md:text-sm text-gray-700">
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Singapore (8 courses)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Malaysia (Johor, KL)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Indonesia (Bali, Bintan, Batam)</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></span>
                    <span>Thailand (Hua Hin, Phuket)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-5 md:p-6 border-2 border-purple-200 shadow-sm">
              <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span class="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                  </svg>
                </span>
                Features
              </h3>
              <ul class="ml-11 md:ml-13 space-y-3 text-xs md:text-sm text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-600 mr-3 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong class="text-gray-900">Real-time Weather:</strong> Live temperature, wind speed, and direction</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-3 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong class="text-gray-900">Wave Data:</strong> Current wave height for surf spots</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-3 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong class="text-gray-900">Hover Info:</strong> Quick preview on marker hover</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-3 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong class="text-gray-900">Smart Filters:</strong> Toggle between surf spots and golf courses</span>
                </li>
                <li class="flex items-start">
                  <span class="text-blue-600 mr-3 mt-0.5 flex-shrink-0">▸</span>
                  <span><strong class="text-gray-900">Auto Updates:</strong> Data refreshes every 30 minutes</span>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t-2 border-gray-200">
              <p class="text-xs text-gray-600 text-center">
                Powered by OpenStreetMap & OpenWeatherMap API
              </p>
              <p class="text-xs text-gray-500 text-center mt-1">
                © 2025 Singapore - Surf & Turf Spots • Built with IBM Bob
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MapView from './components/MapView.vue'
import ListView from './components/ListView.vue'
import { locations as originalLocations, getStats } from './data/locations'
import { usePexels } from './composables/usePexels'

const showInfo = ref(false)
const filterType = ref('all') // 'all', 'surf', 'golf'
const viewMode = ref('map') // 'map', 'list'
const weatherData = ref({})
const locations = ref([...originalLocations])
const stats = computed(() => getStats())
const isLoadingPhotos = ref(false)

const { fetchPhotosForLocations } = usePexels()

const handleSelectLocation = (location) => {
  // Switch to map view and center on selected location
  viewMode.value = 'map'
  // TODO: Implement map centering logic
}

// Pexels APIから実際の写真を取得（バックグラウンドで実行）
onMounted(async () => {
  // 初期表示は既存の画像を使用（高速表示）
  locations.value = [...originalLocations]
  
  // バックグラウンドでPexels写真を取得
  isLoadingPhotos.value = true
  console.log('Fetching real photos from Pexels API in background...')
  
  // 非同期で写真を取得（UIをブロックしない）
  setTimeout(async () => {
    try {
      const photos = await fetchPhotosForLocations(originalLocations)
      
      // 取得した写真URLでlocationsを更新
      locations.value = originalLocations.map(loc => ({
        ...loc,
        image: photos[loc.id] || loc.image
      }))
      
      console.log(`Successfully fetched ${Object.keys(photos).length} photos from Pexels`)
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      isLoadingPhotos.value = false
    }
  }, 100) // 100ms後に開始（初期表示を優先）
})
</script>

<style>
/* Light Mode Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(-20px);
}

/* Scrollbar Light Mode */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f4f4f4;
}

::-webkit-scrollbar-thumb {
  background: #c6c6c6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>