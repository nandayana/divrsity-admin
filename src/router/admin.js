import productRoutes from './admin/product'
import orderRoutes from './admin/order'

export default [
  {
      path: '/admin',
      name: 'admin',
      meta: {
        authenticated: true
      },
      component: () => import('@/views/adminLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          meta: {
            menu: {
              name: 'Dashboard',
              icon: 'chartPie'
            },
          },
          component: () => import('@/views/admin/dashboard.vue'),
        },
        ...productRoutes,
        ...orderRoutes
      ]
    },
]
