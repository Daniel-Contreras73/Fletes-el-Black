import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas públicas
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/tracking/:folio',
      name: 'tracking',
      component: () => import('@/views/tracking/TrackingView.vue')
    },

    // Rutas protegidas
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: 'shipments',
          name: 'shipments',
          component: () => import('@/views/shipments/ShipmentsView.vue')
        },
        {
          path: 'shipments/new',
          name: 'shipments-new',
          component: () => import('@/views/shipments/NewShipmentView.vue')
        },
        {
          path: 'shipments/:id',
          name: 'shipment-detail',
          component: () => import('@/views/shipments/ShipmentDetailView.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue')
        },
        // Solo admin
        {
          path: 'admin/users',
          name: 'admin-users',
          component: () => import('@/views/admin/UsersView.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Guard de navegación
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Redirigir usuarios autenticados fuera de rutas públicas
  const publicRoutes = ['login', 'register']
  if (publicRoutes.includes(to.name as string) && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'dashboard' }
  }

  // Recuperar perfil solo si hay token pero no hay datos de usuario en memoria
  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch {
      auth.clearSession()
      return { name: 'login' }
    }
  }
})

export default router