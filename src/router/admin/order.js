export default [
  {
    path: 'order',
    name: 'order',
    meta: {
      menu: {
        name: 'Order',
        icon: 'filePen'
      },
    },
    children: [
      {
        path: 'list',
        name: 'order-list',
        meta: {
          menu: {
            name: 'List Order',
          },
        },
        component: () => import('@/views/admin/order/list.vue'),
      },
      {
        path: 'payment',
        name: 'order-payment',
        meta: {
          menu: {
            name: 'Payment',
          },
        },
        component: () => import('@/views/admin/order/payment.vue'),
      },
    ]
  },
]