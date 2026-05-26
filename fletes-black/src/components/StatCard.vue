<template>
  <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
    <p class="text-sm text-gray-500 mb-1">{{ title }}</p>
    <p class="text-3xl font-bold" :class="colorClass">{{ value }}</p>
    <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props con valores por defecto
const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    color?: 'red' | 'green' | 'blue' | 'gray'
    subtitle?: string
  }>(),
  { color: 'gray' }
)

// Computed — clase de color derivada del prop color
const colorClass = computed(() => ({
  'text-red-500': props.color === 'red',
  'text-green-500': props.color === 'green',
  'text-blue-500': props.color === 'blue',
  'text-gray-800': props.color === 'gray'
}))
</script>
