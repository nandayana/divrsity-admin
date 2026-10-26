<template>
  <defaultForm v-if="['create', 'update'].includes(currentRoute.query.state)" />
  <defaultTable v-else />
</template>

<script setup>
import router from '@/router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useDataStore } from '@/stores/data';
import productForm from '../../../components/pages/productForm.vue';

const currentRoute = ref(router.currentRoute)
const data = useDataStore()

onBeforeMount(() => {
  data.params = {
    endpoint: '/api/product/product',
    dataTable: [
      {
        label: 'Name',
        type: 'text',
        field: 'name'
      },
      {
        label: 'Category',
        type: 'object',
        field: 'category',
        field1: 'name'
      },
      {
        label: 'Base Price',
        type: 'curency',
        field: 'basePrice'
      },
      {
        label: 'Discount',
        type: 'text',
        field: 'discountPercent'
      },
      {
        label: 'Active',
        type: 'boolean',
        field: 'isActive'
      },
      {
        label: 'Open Order',
        type: 'dateTime',
        field: 'openOrderAt'
      },
      {
        label: 'Close Order',
        type: 'dateTime',
        field: 'closeOrderAt'
      },
      {
        label: 'Description',
        type: 'text',
        field: 'description'
      },
    ],
    dataFilter: [],
    dataForm: [
      {
        label: 'Name',
        type: 'text',
        field: 'name',
        required: true,
        value: null,
        error: null,
      },
      {
        label: 'Description',
        type: 'textarea',
        field: 'description',
        required: false,
        value: null,
        error: null
      },
      {
        label: 'Base Price',
        type: 'number',
        field: 'basePrice',
        required: true,
        value: 0,
        error: null
      },
      {
        label: 'Active',
        type: 'boolean',
        field: 'isActive',
        required: true,
        value: true,
        error: null,
      },
      {
        label: 'Discount',
        type: 'number',
        field: 'discountPercent',
        required: false,
        value: 0,
        error: null
      },
      {
        label: 'Category',
        type: 'autocomplete',
        field: 'categoryId',
        targetPath: '/api/product/category',
        displayField: 'name',
        relativeSelected: null,
        relativeValue: 'id',
        relativeField: 'category',
        required: true,
        value: null,
        error: null
      },
      {
        label: 'Open Order',
        type: 'dateTime',
        field: 'openOrderAt',
        required: false,
        value: null,
        error: null
      },
    ]
  }
})
</script>