<template>
  <div class="rounded-lg p-4" :class="typeClass">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <svg class="h-5 w-5" :class="iconClass" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium" :class="titleClass">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm" :class="messageClass">
          <p>{{ message }}</p>
        </div>
        <div v-if="showRetry" class="mt-4">
          <button
            @click="$emit('retry')"
            class="rounded-md px-3 py-2 text-sm font-medium transition-colors"
            :class="buttonClass"
          >
            再試行
          </button>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
          @click="$emit('dismiss')"
          class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="dismissClass"
        >
          <span class="sr-only">閉じる</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'エラーが発生しました'
  },
  message: {
    type: String,
    required: true
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry', 'dismiss'])

const typeClass = computed(() => {
  const classes = {
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200'
  }
  return classes[props.type]
})

const iconClass = computed(() => {
  const classes = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return classes[props.type]
})

const titleClass = computed(() => {
  const classes = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }
  return classes[props.type]
})

const messageClass = computed(() => {
  const classes = {
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  }
  return classes[props.type]
})

const buttonClass = computed(() => {
  const classes = {
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    info: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  }
  return classes[props.type]
})

const dismissClass = computed(() => {
  const classes = {
    error: 'text-red-500 hover:bg-red-100 focus:ring-red-600',
    warning: 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
    info: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
  }
  return classes[props.type]
})
</script>