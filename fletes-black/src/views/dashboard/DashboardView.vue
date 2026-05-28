<template>
  <div class="p-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">
      Bienvenidoooooo, {{ auth.user?.firstName }} 👋
    </h2>
    <p class="text-gray-500">Panel de control de Fletes Blackkkkkkkkkkk</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
