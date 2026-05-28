<template>
  <div class="flex items-center justify-center gap-3">
    <button
      v-for="n in total"
      :key="n"
      :class="[
        n === current
          ? 'bg-red-500 text-white shadow-md'
          : n < current
            ? 'bg-red-200 text-red-600'
            : 'border-2 border-gray-300 text-gray-400 bg-white'
      ]"
      class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
    >
      {{ n }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ total: number; current: number }>()
</script>
