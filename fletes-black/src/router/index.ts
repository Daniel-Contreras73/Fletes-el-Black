import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Página pública de inicio ──────────────────────────
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue')
    },

    // ── Autenticación ─────────────────────────────────────
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

    // ── Área protegida (DashboardLayout) ──────────────────
    // El parent usa /home pero los hijos con rutas absolutas
    // siguen funcionando en sus URLs originales (/shipments, etc.)
    {
      path: '/home',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: '/shipments',
          name: 'shipments',
          component: () => import('@/views/shipments/ShipmentsView.vue')
        },
        {
          path: '/shipments/new',
          name: 'shipments-new',
          component: () => import('@/views/shipments/NewShipmentView.vue')
        },
        {
          path: '/shipments/:id',
          name: 'shipment-detail',
          component: () => import('@/views/shipments/ShipmentDetailView.vue')
        },
        {
          path: '/documents',
          name: 'documents',
          component: () => import('@/views/documents/DocumentsView.vue')
        },
        {
          path: '/payments',
          name: 'payments',
          component: () => import('@/views/payments/PaymentsView.vue')
        },
        {
          path: '/loyalty',
          name: 'loyalty',
          component: () => import('@/views/loyalty/LoyaltyView.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/profile/ProfileView.vue')
        },
        {
          path: '/destinations',
          name: 'destinations',
          component: () => import('@/views/destinations/DestinationsView.vue')
        },
        {
          path: '/admin/shipments',
          name: 'admin-shipments',
          component: () => import('@/views/admin/AdminShipmentsView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: '/admin/users',
          name: 'admin-users',
          component: () => import('@/views/admin/UsersView.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: '/admin/documents',
          name: 'admin-documents',
          component: () => import('@/views/admin/DocumentsAdminView.vue'),
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

  // Rutas públicas — si ya está autenticado, ir al home
  const publicRoutes = ['login', 'register', 'landing']
  if (publicRoutes.includes(to.name as string) && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  // Rutas protegidas — si no está autenticado, ir a landing
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'landing' }
  }

  // Rutas solo admin
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'dashboard' }
  }

  // Recuperar perfil si hay token pero no hay datos en memoria
  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch {
      auth.clearSession()
      return { name: 'landing' }
    }
  }
})

export default router
