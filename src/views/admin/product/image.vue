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
    endpoint: '/api/product/image',
    dataTable: [
      {
        label: 'Name',
        type: 'object',
        field: 'product',
        field1: 'name'
      },
      {
        label: 'Category',
        type: 'object',
        field: 'product',
        field1: 'category',
        field2: 'name'
      },
      {
        label: 'Image',
        type: 'image',
        field: 'image'
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
        label: 'Image',
        type: 'image',
        field: 'image',
        required: true,
        value: null,
        error: null
      }
    ]
  }
})
</script>