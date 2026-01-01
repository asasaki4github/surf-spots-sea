<template>
  <div class="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden">
    <!-- ヘッダー -->
    <div class="bg-gradient-to-r from-ocean-500 to-ocean-600 px-4 py-3 text-white">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold">{{ spot.name }}</h3>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p class="text-sm text-ocean-100 mt-1">
        {{ spot.island }}, {{ spot.country }}
      </p>
    </div>

    <!-- コンテンツ -->
    <div class="p-4">
      <!-- ローディング状態 -->
      <div v-if="loading" class="flex justify-center py-8">
        <LoadingSpinner size="sm" text="波情報を取得中..." />
      </div>

      <!-- エラー状態 -->
      <div v-else-if="error" class="py-4">
        <ErrorMessage
          type="error"
          title="データ取得エラー"
          :message="error"
          :show-retry="true"
          @retry="$emit('retry')"
        />
      </div>

      <!-- 波情報表示 -->
      <div v-else-if="waveData" class="space-y-4">
        <!-- コンディション評価 -->
        <div class="text-center py-3 rounded-lg bg-gray-50">
          <div class="text-2xl font-bold" :class="conditionColor">
            {{ condition.message }}
          </div>
        </div>

        <!-- 波情報グリッド -->
        <div class="grid grid-cols-2 gap-3">
          <!-- 波高 -->
          <div class="bg-ocean-50 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">波高</div>
            <div class="text-2xl font-bold text-ocean-700">
              {{ formatWaveHeight(waveData.wave.height) }}
            </div>
          </div>

          <!-- 波周期 -->
          <div class="bg-ocean-50 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">周期</div>
            <div class="text-2xl font-bold text-ocean-700">
              {{ formatWavePeriod(waveData.wave.period) }}
            </div>
          </div>

          <!-- 風速 -->
          <div class="bg-blue-50 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">風速</div>
            <div class="text-2xl font-bold text-blue-700">
              {{ formatWindSpeed(waveData.wind.speed) }}
            </div>
          </div>

          <!-- 風向 -->
          <div class="bg-blue-50 rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">風向</div>
            <div class="text-2xl font-bold text-blue-700">
              {{ formatWindDirection(waveData.wind.direction) }}
            </div>
          </div>
        </div>

        <!-- 気温 -->
        <div v-if="waveData.weather" class="flex items-center justify-between text-sm text-gray-600">
          <span>気温</span>
          <span class="font-semibold">{{ formatTemperature(waveData.weather.temp) }}</span>
        </div>

        <!-- スポット情報 -->
        <div class="border-t pt-4 space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">移動時間</span>
            <span class="font-semibold text-gray-900">{{ spot.travelTime }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">ベストシーズン</span>
            <span class="font-semibold text-gray-900">{{ spot.bestSeason }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">難易度</span>
            <span class="font-semibold text-gray-900">{{ spot.difficulty }}</span>
          </div>
        </div>

        <!-- 説明 -->
        <div class="text-sm text-gray-600 border-t pt-4">
          {{ spot.description }}
        </div>

        <!-- 更新時刻 -->
        <div class="text-xs text-gray-500 text-center">
          更新: {{ formatTimestamp(waveData.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import ErrorMessage from './ErrorMessage.vue'
import {
  formatWaveHeight,
  formatWavePeriod,
  formatWindSpeed,
  formatWindDirection,
  formatTemperature,
  formatTimestamp,
  evaluateConditions,
  getConditionColor
} from '@/utils/formatters'

const props = defineProps({
  spot: {
    type: Object,
    required: true
  },
  waveData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

defineEmits(['close', 'retry'])

const condition = computed(() => {
  if (!props.waveData) return { rating: 'unknown', message: 'データなし' }
  return evaluateConditions(
    props.waveData.wave.height,
    props.waveData.wind.speed
  )
})

const conditionColor = computed(() => {
  return getConditionColor(condition.value.rating)
})
</script>