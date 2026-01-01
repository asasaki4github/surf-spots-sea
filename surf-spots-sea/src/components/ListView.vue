<template>
  <div class="h-full overflow-y-auto bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Search and Filter -->
      <div class="mb-6 bg-white rounded-lg shadow-md p-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search spots..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Spots Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="location in filteredLocations"
          :key="location.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          @click="$emit('select-location', location)"
        >
          <!-- Image -->
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="location.image"
              :src="location.image"
              :alt="location.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-semibold"
                 :class="location.type === 'surf' ? 'bg-blue-600' : 'bg-green-600'">
              {{ location.type === 'surf' ? '🏄 Surf' : '⛳ Golf' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ location.name }}</h3>
            <p class="text-sm text-gray-600 mb-2">
              📍 {{ location.country }} • {{ location.distance }}
            </p>
            <p v-if="location.comment" class="text-sm text-gray-700 line-clamp-2 mb-3">
              {{ location.comment }}
            </p>
            
            <!-- Weather Info -->
            <div v-if="weatherData[location.id]" class="grid grid-cols-2 gap-2 text-xs">
              <div class="flex items-center space-x-1">
                <span>🌡️</span>
                <span class="font-semibold">{{ weatherData[location.id].temp }}°C</span>
              </div>
              <div class="flex items-center space-x-1">
                <span>💨</span>
                <span class="font-semibold">{{ weatherData[location.id].windSpeed }} m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredLocations.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No spots found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  locations: {
    type: Array,
    required: true
  },
  filterType: {
    type: String,
    default: 'all'
  },
  weatherData: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['select-location'])

const searchQuery = ref('')

const filteredLocations = computed(() => {
  let filtered = props.locations

  // Filter by type
  if (props.filterType !== 'all') {
    filtered = filtered.filter(loc => loc.type === props.filterType)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(loc =>
      loc.name.toLowerCase().includes(query) ||
      loc.country.toLowerCase().includes(query) ||
      loc.region.toLowerCase().includes(query)
    )
  }

  return filtered
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>