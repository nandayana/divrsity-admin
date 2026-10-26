export default [
  {
    path: 'product',
    name: 'product',
    meta: {
      menu: {
        name: 'Product',
        icon: 'filePen'
      },
    },
    children: [
      {
        path: 'category',
        name: 'product-category',
        meta: {
          menu: {
            name: 'Category',
          },
        },
        component: () => import('@/views/admin/product/category.vue'),
      },
      {
        path: 'product',
        name: 'product-product',
        meta: {
          menu: {
            name: 'Product',
          },
        },
        component: () => import('@/views/admin/product/product.vue'),
      },
      {
        path: 'image',
        name: 'product-image',
        meta: {
          menu: {
            name: 'Image',
          },
        },
        component: () => import('@/views/admin/product/image.vue'),
      },
      {
        path: 'color',
        name: 'product-color',
        meta: {
          menu: {
            name: 'Color',
          },
        },
        component: () => import('@/views/admin/product/color.vue'),
      },
      {
        path: 'size',
        name: 'product-size',
        meta: {
          menu: {
            name: 'Size',
          },
        },
        component: () => import('@/views/admin/product/size.vue'),
      },
      {
        path: 'Variant',
        name: 'product-variant',
        meta: {
          menu: {
            name: 'Variant',
          },
        },
        component: () => import('@/views/admin/product/variant.vue'),
      },
    ]
  },
]