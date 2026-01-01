<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <div class="animate-spin rounded-full border-4 border-ocean-200" 
           :class="sizeClass"
           :style="{ borderTopColor: color }">
      </div>
      <div v-if="text" class="mt-4 text-center text-sm text-gray-600">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: '#0ea5e9'
  },
  text: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  return sizes[props.size]
})

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'p-8'
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>