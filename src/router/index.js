import { createRouter, createWebHistory } from 'vue-router'
import { usePreferenceStore } from '../stores/preference.js'
import adminRoute from './admin.js'

const routes = [
  /* {
    path: '/',
    name: 'root',
    redirect: { name: 'dashboard' },
    meta: {
      authenticated: true
    }
  }, */
  {
    path: '/shipping-label-print/:id',
    name: 'shipping-label-print',
    meta: {
      authenticated: true
    },
    component: () => import('@/views/other/shippingLabelPrint.vue'),
  },
  {
    path: '/shipping-label-print-bulk',
    name: 'shipping-label-print-bulk',
    meta: {
      authenticated: true
    },
    component: () => import('@/views/other/shippingLabelPrintBulk.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
  },
  ...adminRoute,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/other/notFound.vue')
  },
  {
    path: '/server-error',
    name: 'server-error',
    component: () => import('@/views/other/serverError.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

function updateMenu() {
  const preference = usePreferenceStore()
  const adminRoute = routes.find(r => r.name === 'admin')

  let menus = []

  adminRoute.children.forEach((menu) => {
    menu.identityPath = menu.path ? `${adminRoute.path}/${menu.path}` : adminRoute.path
    menus.push(menu)

    menu.children?.forEach((subMenu) => {
      subMenu.identityPath = `${adminRoute.path}/${menu.path}/${subMenu.path}`
    })
  })
  preference.menus = menus
}

router.beforeEach(async (to) => {
  const preference = usePreferenceStore()

  updateMenu()

  const res = await preference.getProfile()
  const isAuthenticated = res?.status === 200

  if (to.meta.authenticated && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.name === 'root' && isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
