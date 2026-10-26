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
        label: 'Description',
        type: 'text',
        field: 'description'
      },
    ],
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
        value: null,
        error: null
      },
      {
        label: 'Discount',
        type: 'number',
        field: 'discountPrecent',
        required: false,
        value: null,
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
        required: true,
        value: null,
        error: null
      }
    ]
  }
})
</script>