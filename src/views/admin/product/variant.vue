<template>
  <defaultForm v-if="['create', 'update'].includes(currentRoute.query.state)" />
  <defaultTable v-else />
</template>

<script setup>
import router from '@/router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useDataStore } from '@/stores/data';

const currentRoute = ref(router.currentRoute)
const data = useDataStore()

onBeforeMount(() => {
  data.params = {
    endpoint: '/api/product/variant',
    dataTable: [
      {
        label: 'Variant',
        type: 'variant',
        field: ''
      },
      {
        label: 'SKU',
        type: 'text',
        field: 'sku'
      },
      {
        label: 'Stock',
        type: 'number',
        field: 'stock'
      },
      {
        label: 'Stock Belum Dibayar',
        type: 'number',
        field: 'reservedStock'
      },
    ],
    dataFilter: [],
    dataForm: [
      {
        label: 'Product',
        type: 'autocomplete',
        field: 'productId',
        targetPath: '/api/product/product',
        displayField: 'name',
        relativeSelected: null,
        relativeValue: 'id',
        relativeField: 'product',
        required: true,
        value: null,
        error: null
      },
      {
        label: 'SKU',
        type: 'text',
        field: 'sku',
        required: false,
        value: null,
        error: null,
      },
      {
        label: 'Color',
        type: 'autocomplete',
        field: 'colorId',
        targetPath: '/api/product/color',
        displayField: 'name',
        relativeSelected: null,
        relativeValue: 'id',
        relativeField: 'color',
        required: true,
        value: null,
        error: null
      },
      {
        label: 'Size',
        type: 'autocomplete',
        field: 'sizeId',
        targetPath: '/api/product/size',
        displayField: 'name',
        relativeSelected: null,
        relativeValue: 'id',
        relativeField: 'size',
        required: true,
        value: null,
        error: null
      },
      {
        label: 'Stock',
        type: 'number',
        field: 'stock',
        required: false,
        value: 0,
        error: null,
      },
    ]
  }
})
</script>