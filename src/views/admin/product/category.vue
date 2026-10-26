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
    endpoint: '/api/product/category',
    dataTable: [
      {
        label: 'Name',
        type: 'text',
        field: 'name'
      },
      {
        label: 'Description',
        type: 'text',
        field: 'description'
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
        label: 'Name',
        type: 'text',
        field: 'name',
        required: true,
        value: null,
        error: null,
      },
      {
        label: 'Slug',
        type: 'text',
        field: 'slug',
        required: true,
        value: null,
        error: null,
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
        label: 'Description',
        type: 'textarea',
        field: 'description',
        required: false,
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