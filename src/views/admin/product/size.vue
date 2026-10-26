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
    endpoint: '/api/product/size',
    dataTable: [
      {
        label: 'Name',
        type: 'text',
        field: 'name'
      },
      {
        label: 'Deskripsi',
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
        label: 'Deskripsi',
        type: 'text',
        field: 'description',
        required: false,
        value: null,
        error: null,
      },
    ]
  }
})
</script>