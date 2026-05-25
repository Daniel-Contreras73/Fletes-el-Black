<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold tracking-widest" style="color: #E85454">DOCUMENTOS</h1>
      <RouterLink
        to="/shipments/new"
        class="flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style="background-color: #8B1A1A"
      >
        <span class="text-lg font-bold">+</span>
        Nuevo Flete
      </RouterLink>
    </div>
    <div class="bg-white rounded-2xl p-8 text-gray-400 text-center">
      Próximamente — gestión de documentos
    </div>
  </div>
</template>
