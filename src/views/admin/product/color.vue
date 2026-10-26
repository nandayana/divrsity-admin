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
    endpoint: '/api/product/color',
    dataTable: [
      {
        label: 'Name',
        type: 'text',
        field: 'name'
      },
      {
        label: 'Code',
        type: 'color',
        field: 'hexCode'
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
        label: 'Kode',
        type: 'color',
        field: 'hexCode',
        required: true,
        value: null,
        error: null,
      },
    ]
  }
})
</script>