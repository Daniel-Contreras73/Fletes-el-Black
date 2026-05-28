<template>
  <div class="min-h-screen flex flex-col bg-white" style="scroll-behavior: smooth">

    <!-- ══ HEADER FIJO ══════════════════════════════════════════ -->
    <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-2 shadow-lg" style="background-color: #7F1D1D">
      <img src="/img/logo.png" class="h-14 object-contain" alt="Fletes El Black" />

      <nav class="hidden md:flex items-center gap-6">
        <a href="#servicios" class="text-white/70 text-sm font-medium hover:text-white transition-colors">Servicios</a>
        <a href="#por-que" class="text-white/70 text-sm font-medium hover:text-white transition-colors">¿Por qué elegirnos?</a>
        <a href="#como-funciona" class="text-white/70 text-sm font-medium hover:text-white transition-colors">¿Cómo funciona?</a>
        <a href="#testimonios" class="text-white/70 text-sm font-medium hover:text-white transition-colors">Clientes</a>
        <a href="#galeria" class="text-white/70 text-sm font-medium hover:text-white transition-colors">Galería</a>
        <a href="#contacto" class="text-white/70 text-sm font-medium hover:text-white transition-colors">Contacto</a>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink to="/login"
          class="text-white/70 text-sm font-medium px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
          Iniciar sesión
        </RouterLink>
        <RouterLink to="/register"
          class="text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          style="background-color: #DC2626">
          Registrarse
        </RouterLink>
      </div>
    </header>

    <!-- ══ HERO con carrusel de fondo ══════════════════════════ -->
    <section id="hero" class="relative flex flex-col min-h-screen overflow-hidden scroll-mt-16">

      <!-- Slides de fondo -->
      <div class="absolute inset-0">
        <transition-group name="fade-slide" tag="div" class="absolute inset-0">
          <div
            v-for="(slide, i) in slides"
            v-show="currentSlide === i"
            :key="slide"
            class="absolute inset-0 bg-cover bg-center"
            :style="`background-image: url('${slide}')`"
          />
        </transition-group>
        <div class="absolute inset-0" style="background: rgba(0,0,0,0.45)" />
      </div>

      <!-- Contenido hero (pt-20 compensa el header fijo) -->
      <div class="relative z-20 flex-1 flex flex-col items-start justify-center px-8 md:px-20 pb-20 pt-20">
        <!-- Badge cotización semiautomatizada -->
        <div class="flex items-center gap-2 mb-6">
          <span class="inline-flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm"
            style="background-color: rgba(220,38,38,0.75)">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
            </svg>
            Cotización en línea semiautomatizada · Obtén tu precio al instante
          </span>
        </div>

        <h1 class="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5 max-w-2xl">
          Movemos tu Carga,<br>
          <span style="color: #DC2626">Con Seguridad</span><br>
          y Puntualidad
        </h1>

        <p class="text-gray-300 text-lg mb-10 max-w-lg">
          Servicio de fletes locales y foráneos desde Chetumal. Transporte confiable para negocios, mudanzas y entregas.
        </p>

        <div class="flex flex-wrap gap-4 mb-12">
          <a href="#contacto"
            class="flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-base shadow-lg"
            style="background-color: #DC2626">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
            </svg>
            Calcular costo de mi flete
          </a>
        </div>

        <!-- Stats -->
        <div class="flex flex-wrap gap-10">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col">
            <span class="text-3xl font-extrabold text-white">{{ stat.value }}</span>
            <span class="text-gray-400 text-sm mt-0.5">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        <button v-for="(_, i) in slides" :key="i" @click="goTo(i)"
          class="rounded-full transition-all duration-300"
          :class="currentSlide === i ? 'w-8 h-2.5' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'"
          :style="currentSlide === i ? 'background-color: #DC2626' : ''" />
      </div>

      <!-- Flechas -->
      <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">‹</button>
      <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors">›</button>
    </section>

    <!-- ══ Servicios ═══════════════════════════════════════════ -->
    <section id="servicios" class="px-8 md:px-16 py-20 bg-white scroll-mt-16">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Nuestros Servicios</h2>
        <p class="text-gray-500">Soluciones completas de transporte en Chetumal</p>
        <p class="text-sm font-semibold mt-2" style="color: #DC2626">Nos seguimos expandiendo cobertura a más zonas de Quintana Roo y México</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="svc in services" :key="svc.title"
          class="rounded-2xl p-7 border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style="background-color: #FEE2E2">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" style="stroke: #DC2626">
              <path stroke-linecap="round" stroke-linejoin="round" :d="svc.iconPath" />
            </svg>
          </div>
          <h3 class="text-gray-800 font-bold text-lg mb-2">{{ svc.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ svc.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ══ Por qué elegirnos ═══════════════════════════════════ -->
    <section id="por-que" class="px-8 md:px-16 py-20 bg-gray-50 scroll-mt-16">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">¿Por qué elegirnos?</h2>
        <p class="text-gray-500">Confianza, profesionalismo y transparencia en cada servicio</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div v-for="(reason, i) in reasons" :key="reason.title" class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
            style="background-color: #991B1B">
            {{ i + 1 }}
          </div>
          <div>
            <h3 class="font-bold text-gray-800 mb-1">{{ reason.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ reason.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Cómo funciona ════════════════════════════════════════ -->
    <section id="como-funciona" class="px-8 md:px-16 py-20 scroll-mt-16" style="background-color: #991B1B">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-white mb-3">¿Cómo funciona?</h2>
        <p class="text-red-200">Solicitar tu flete es muy sencillo, solo sigue estos pasos</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
        <div v-for="(stepItem, i) in steps" :key="stepItem.title" class="text-center">
          <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-bold bg-white"
            style="color: #991B1B">
            {{ i + 1 }}
          </div>
          <h3 class="font-bold text-white text-lg mb-2">{{ stepItem.title }}</h3>
          <p class="text-red-200 text-sm leading-relaxed">{{ stepItem.desc }}</p>
        </div>
      </div>
      <div class="text-center mt-12">
        <a href="#contacto"
          class="inline-block bg-white font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors text-base"
          style="color: #991B1B">
          Deseo solicitar un servicio de flete
        </a>
      </div>
    </section>

    <!-- ══ Testimonios ═════════════════════════════════════════ -->
    <section id="testimonios" class="px-8 md:px-16 py-20 bg-gray-50 scroll-mt-16">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="review in reviews" :key="review.name"
          class="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
          <div class="flex gap-0.5 mb-4">
            <span v-for="n in 5" :key="n"
              class="text-lg"
              :class="n <= review.stars ? 'text-yellow-400' : 'text-gray-200'">★</span>
          </div>
          <p class="text-gray-600 text-sm leading-relaxed mb-5">{{ review.text }}</p>
          <div>
            <p class="font-bold text-gray-800 text-sm">{{ review.name }}</p>
            <p class="text-gray-400 text-xs">{{ review.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Galería ════════════════════════════════════════════ -->
    <section id="galeria" class="px-8 md:px-16 py-20 bg-white scroll-mt-16">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Así Trabajamos en Cada Destino</h2>
        <p class="text-gray-500">Fletes y mudanzas reales organizados por tipo de servicio</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div v-for="cat in galleryCategories" :key="cat.id">
          <!-- Encabezado categoría -->
          <div class="mb-4 pb-3 border-b-2" style="border-color: #DC2626">
            <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">{{ cat.label }}</h3>
            <p class="text-gray-400 text-xs mt-0.5">{{ cat.desc }}</p>
          </div>
          <!-- Fotos -->
          <div class="flex flex-col gap-3">
            <div v-for="img in cat.images" :key="img"
              class="aspect-video rounded-xl overflow-hidden shadow-sm">
              <img :src="img" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" :alt="cat.label" />
            </div>
            <!-- Slot vacío si no hay fotos aún -->
            <div v-if="cat.images.length === 0"
              class="aspect-video rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-1">
              <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
              </svg>
              <p class="text-gray-400 text-xs">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <a href="https://www.facebook.com/fletecito.elblack" target="_blank"
          class="inline-flex items-center gap-3 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
          style="background-color: #DC2626">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
          </svg>
          Ver más fotos en Facebook
        </a>
      </div>
    </section>

    <!-- ══ Cotización Semiautomática ════════════════════════════ -->
    <section id="contacto" class="px-8 md:px-16 py-20 bg-gray-50 scroll-mt-16">
      <div class="text-center mb-12">
        <span class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 text-white" style="background-color: #DC2626">COTIZACIÓN SEMIAUTOMÁTICA</span>
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Cotiza tu Flete al Instante</h2>
        <p class="text-gray-500 max-w-xl mx-auto">Rellena el formulario y obtén una estimación de precio en segundos — sin necesidad de crear una cuenta.</p>
      </div>

      <!-- Formulario de cotización -->
      <div class="max-w-3xl mx-auto mb-16">
        <LandingQuotationForm />
      </div>

      <!-- Info cards: cobertura, horarios, contacto -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

        <!-- Cobertura -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background-color: #FEE2E2">
            <svg class="w-5 h-5" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
            </svg>
          </div>
          <h3 class="font-bold text-gray-800 mb-3">Cobertura</h3>
          <div class="flex flex-col gap-2 text-sm text-gray-600">
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: #DC2626">✓</span>
              <span><strong>Chetumal</strong> — Obrera, Proletaria, IMSS, Lagunillas, Insurgentes, Forjadores, Magisterial, Calderitas, Antorchistas y todas las colonias</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: #DC2626">✓</span>
              <span><strong>Todo Quintana Roo</strong> — Cancún, Playa del Carmen, Tulum, Cozumel, Bacalar, Mahahual, Felipe Carrillo Puerto y más</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: #DC2626">✓</span>
              <span><strong>Sur de México</strong> — Tabasco, Chiapas, Yucatán y Campeche con rutas foráneas seguras y rápidas</span>
            </div>
            <div class="flex items-start gap-2">
              <span class="font-bold flex-shrink-0" style="color: #DC2626">✓</span>
              <span><strong>Belice</strong> — Corozal, Orange Walk, Belice City y más</span>
            </div>
          </div>
        </div>

        <!-- Horarios -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style="background-color: #FEE2E2">
            <svg class="w-5 h-5" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="font-bold text-gray-800 mb-3">Horarios de servicio</h3>
          <p class="text-sm font-semibold mb-1" style="color: #DC2626">Lunes a Domingo</p>
          <p class="text-2xl font-extrabold text-gray-800 mb-3">8:00 AM – 10:00 PM</p>
          <p class="text-gray-500 text-sm mb-3">Servicio todos los días incluidos fines de semana y días festivos.</p>
          <div class="rounded-lg p-3 bg-orange-50 text-xs text-orange-700 border border-orange-200">
             <strong>Fuera de horario disponible</strong> — aplican costos adicionales.
          </div>
        </div>

        <!-- Contacto directo -->
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-0" style="background-color: #FEE2E2">
            <svg class="w-5 h-5" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
            </svg>
          </div>
          <h3 class="font-bold text-gray-800">Contacto directo</h3>
          <a href="https://wa.me/529831015526" target="_blank"
            class="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200 hover:border-green-400 transition-colors group">
            <div class="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.517 5.829L.057 23.486a.5.5 0 00.612.612l5.693-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.722.959.984-3.607-.235-.371A9.818 9.818 0 1112 21.818z"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm group-hover:text-green-700">WhatsApp</p>
              <p class="text-green-600 text-sm font-bold">983 101 5526</p>
            </div>
          </a>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: #DC2626">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold text-gray-800 text-sm">Teléfono</p>
              <p class="text-sm font-bold" style="color: #DC2626">983 101 5526</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Footer ════════════════════════════════════════════ -->
    <footer class="pt-14 pb-0" style="background-color: #7F1D1D">
      <div class="px-8 md:px-16 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

        <!-- Columna 1: Logo + info -->
        <div class="flex flex-col gap-4">
          <img src="/img/logo.png" class="h-20 object-contain object-left" alt="Fletes El Black" />
          <p class="text-red-200 text-sm leading-relaxed">
            Servicio de fletes locales y foráneos desde Chetumal para mudanzas, entregas y transporte confiable.
          </p>
        </div>

        <!-- Columna 2: Servicios -->
        <div>
          <p class="text-white font-extrabold text-sm tracking-widest uppercase mb-1">Servicios</p>
          <div class="w-8 h-0.5 mb-5 bg-white"></div>
          <ul class="flex flex-col divide-y divide-white/20">
            <li v-for="svc in footerServices" :key="svc.label"
              class="flex items-center gap-3 py-2.5 text-red-200 text-sm hover:text-white transition-colors">
              <svg class="w-4 h-4 flex-shrink-0" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="svc.icon" />
              </svg>
              {{ svc.label }}
            </li>
          </ul>
        </div>

        <!-- Columna 3: Contacto -->
        <div>
          <p class="text-white font-extrabold text-sm tracking-widest uppercase mb-1">Contacto</p>
          <div class="w-8 h-0.5 mb-5 bg-white"></div>
          <div class="flex flex-col gap-5">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center flex-shrink-0" style="background-color: rgba(220,38,38,0.15)">
                <svg class="w-4 h-4" style="color: #DC2626" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.517 5.829L.057 23.486a.5.5 0 00.612.612l5.693-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.722.959.984-3.607-.235-.371A9.818 9.818 0 1112 21.818z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold text-sm">WhatsApp</p>
                <p class="text-red-200 text-sm">983 101 5526</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center flex-shrink-0" style="background-color: rgba(220,38,38,0.15)">
                <svg class="w-4 h-4" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold text-sm">Teléfono</p>
                <p class="text-red-200 text-sm">983 101 5526</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center flex-shrink-0" style="background-color: rgba(220,38,38,0.15)">
                <svg class="w-4 h-4" style="color: #DC2626" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-semibold text-sm">Ubicación</p>
                <p class="text-red-200 text-sm">Chetumal,<br>Quintana Roo</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna 4: Navegación -->
        <div>
          <p class="text-white font-extrabold text-sm tracking-widest uppercase mb-1">Navegación</p>
          <div class="w-8 h-0.5 mb-5 bg-white"></div>
          <div class="flex flex-col divide-y divide-white/20">
            <a href="#hero"    class="flex items-center justify-between py-3 text-red-200 text-sm hover:text-white transition-colors">Inicio <span class="text-red-500">›</span></a>
            <a href="#servicios"  class="flex items-center justify-between py-3 text-red-200 text-sm hover:text-white transition-colors">Servicios <span class="text-red-500">›</span></a>
            <a href="#como-funciona" class="flex items-center justify-between py-3 text-red-200 text-sm hover:text-white transition-colors">¿Cómo funciona? <span class="text-red-500">›</span></a>
            <a href="#testimonios"  class="flex items-center justify-between py-3 text-red-200 text-sm hover:text-white transition-colors">Clientes <span class="text-red-500">›</span></a>
            <a href="#contacto"  class="flex items-center justify-between py-3 text-red-200 text-sm hover:text-white transition-colors">Contacto <span class="text-red-500">›</span></a>
          </div>
        </div>
      </div>

      <!-- Barra inferior -->
      <div class="border-t border-white/20 px-8 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-red-300 text-sm">© 2026 Fletes El Black. Todos los derechos reservados.</p>
        <div class="flex items-center gap-3">
          <span class="text-red-300 text-sm">Síguenos:</span>
          <!-- Facebook -->
          <a href="https://www.facebook.com/fletecito.elblack" target="_blank" class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center text-red-300 hover:text-white hover:border-white transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <!-- WhatsApp -->
          <a href="https://wa.me/529831015526" target="_blank" class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center text-red-300 hover:text-white hover:border-white transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.117.552 4.103 1.517 5.829L.057 23.486a.5.5 0 00.612.612l5.693-1.467A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.722.959.984-3.607-.235-.371A9.818 9.818 0 1112 21.818z"/>
            </svg>
          </a>
          <!-- Instagram -->
          <a href="#" class="w-9 h-9 rounded-full border border-red-700 flex items-center justify-center text-red-300 hover:text-white hover:border-white transition-colors">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LandingQuotationForm from '@/components/LandingQuotationForm.vue'

const slides = [
  '/img/qroo2.jpg',
  '/img/chetu1.jpeg',
  '/img/FondoPrincipal.jpg',
  '/img/belice1.jpeg',
  '/img/chetu2.jpeg',
  '/img/foraneo2.jpeg',

]

const currentSlide = ref(0)
let timer: ReturnType<typeof setInterval>

const next = () => { currentSlide.value = (currentSlide.value + 1) % slides.length }
const prev = () => { currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length }
const goTo = (i: number) => { currentSlide.value = i; resetTimer() }

const resetTimer = () => {
  clearInterval(timer)
  timer = setInterval(next, 5000)
}

onMounted(() => { timer = setInterval(next, 5000) })
onUnmounted(() => clearInterval(timer))

const stats = [
  { value: '500+', label: 'Fletes realizados' },
  { value: '5 ★', label: 'Calificación promedio' },
  { value: '24/7', label: 'Disponibilidad' },
  { value: '100%', label: 'Entregas a tiempo' },
]

const footerServices = [
  { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', label: 'Fletes locales' },
  { icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z', label: 'Fletes foráneos' },
  { icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9', label: 'Mudanzas' },
  { icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', label: 'Envíos a Belice' },
  { icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z', label: 'Abastecimiento para negocios' },
]

const services = [
  {
    iconPath: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
    title: 'Fletes dentro de Chetumal',
    desc: 'Nos movemos por toda la ciudad: colonias, fraccionamientos, mercados y zonas industriales. Rápido, sin vueltas y al precio que acordamos.',
  },
  {
    iconPath: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
    title: 'Fletes Foráneos en México',
    desc: 'Transportamos tu carga a cualquier estado de la República. Cancún, Mérida, CDMX o donde lo necesites — salimos cuando tú digas.',
  },
  {
    iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
    title: 'Envíos a Belice',
    desc: 'Frontera con Chetumal, perfecta para cruzar mercancía a Belice. Coordinamos el traslado con toda la documentación necesaria para un cruce sin complicaciones.',
  },
  {
    iconPath: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    title: 'Mudanzas Casa u Oficina',
    desc: 'Empacamos, cargamos y acomodamos. Ya sea que te mudes a la vuelta o a otro estado, tratamos cada cosa como si fuera nuestra.',
  },
  {
    iconPath: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z',
    title: 'Abastecimiento para Negocios',
    desc: 'Restaurantes, tiendas, bodegas y locales comerciales: te ayudamos a mover mercancía de forma regular o cuando lo necesites, con puntualidad y cuidado.',
  },
  {
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Flete Express o Programado',
    desc: '¿Lo necesitas hoy? Vamos. ¿Prefieres agendarlo? También. Nos adaptamos a tu horario para que no tengas que cambiar tus planes.',
  },
]

const reasons = [
  { title: 'Te decimos el precio antes de salir', desc: 'Nada de sorpresas al final. Cotizamos en línea o por WhatsApp y te confirmamos el costo total antes de comprometerte con nada.' },
  { title: 'Llegamos cuando quedamos', desc: 'Sabemos que tu tiempo vale. Por eso nos comprometemos con un horario real y te avisamos si algo cambia, siempre con anticipación.' },
  { title: 'Tu carga no viaja sola', desc: 'Cuidamos cada mueble, caja y aparato como si fuera nuestro. Si algo requiere protección extra, te lo decimos y lo resolvemos.' },
  { title: 'Hablamos contigo, no con un bot', desc: 'Cuando escribes o llamas, te responde una persona de verdad. Sin formularios, sin esperas eternas, sin rodeos.' },
  { title: 'Cruzamos fronteras sin complicarte la vida', desc: 'Fletes locales, foráneos a toda la República y envíos a Belice. Un solo proveedor para todos tus traslados.' },
  { title: 'Somos de aquí y lo hacemos con orgullo', desc: 'Empresa 100% chetumalense. Conocemos cada calle, colonia y ruta mejor que nadie, y ponemos eso a tu favor en cada servicio.' },
]

const steps = [
  { title: 'Dinos qué necesitas mover', desc: 'Escríbenos por WhatsApp o usa el formulario en línea: cuéntanos el origen, el destino y qué vas a cargar. Sin compromisos.' },
  { title: 'Te mandamos el precio y el horario', desc: 'En minutos te confirmamos cuánto cuesta y cuándo podemos salir. Tú decides si aceptas, sin presiones.' },
  { title: 'Nosotros nos encargamos de todo', desc: 'Llegamos a tiempo, cargamos con cuidado y entregamos en el lugar acordado. Así de sencillo.' },
]

const reviews = [
  { name: 'Berenice Enriquez C.', label: 'Mudanza residencial', stars: 5, text: 'Los contraté para mi mudanza el mes pasado. Llegaron a tiempo y terminaron más rápido de lo que esperaba. Lo único que me hubiera gustado es que trajeran más cajas, pero de ahí en fuera todo bien.' },
  { name: 'Jorge Sanchez.', label: 'Cliente frecuente', stars: 4, text: 'Buen servicio en general. El precio me pareció justo y los muchachos trabajaron bien. Tuve que llamar un par de veces para confirmar la hora pero al final todo salió según lo planeado.' },
  { name: 'Walter Galindo.', label: 'Comerciante local', stars: 5, text: 'Ya es la tercera vez que los contrato para traer mercancía a mi negocio. Son responsables y siempre me avisan si van a llegar tarde. Me contestan rápido por WhatsApp, eso me gusta.' },
]

const galleryCategories = [
  {
    id: 'chetumal',
    label: 'Chetumal',
    desc: 'Fletes locales en la ciudad',
    images: ['/img/chetu1.jpeg', '/img/chetu2.jpeg'],
  },
  {
    id: 'qroo',
    label: 'Quintana Roo',
    desc: 'Todo el estado',
    images: ['/img/qroo1.jpg','/img/qroo2.jpg'],
  },
  {
    id: 'foraneo',
    label: 'Foráneos México',
    desc: 'Tabasco, Yucatán, Chiapas...',
    images: ['/img/foraneo1.jpg','/img/foraneo2.jpeg'],
  },
  {
    id: 'extranjero',
    label: 'Foráneo / Belice',
    desc: 'Envíos internacionales',
    images: ['/img/belice1.jpeg','/img/belice2.jpeg'],
  },
]

</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  inset: 0;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
</style>
