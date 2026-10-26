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
    name: 'orderList',
    endpoint: '/api/order/list',
    dataFilter: [
      {
        label: 'Search',
        type: 'search',
        value: '',
        field: 'search'
      },
      {
        label: 'Status Pembayaran',
        type: 'select',
        value: '',
        field: 'status',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Expired', value: 'expired' },
          { name: 'Success', value: 'success' },
          { name: 'Rejected', value: 'rejected' },
          { name: 'Paid', value: 'paid' },
        ]
      },
      {
        label: 'Bukti Pembayaran',
        type: 'select',
        value: '',
        field: 'payment_image',
        options: [
          { name: 'Ya', value: 'true' },
          { name: 'Tidak', value: 'false' },
        ]
      },
      {
        label: 'Nomor Resi',
        type: 'select',
        value: '',
        field: 'awb',
        options: [
          { name: 'Ya', value: 'true' },
          { name: 'Tidak', value: 'false' },
        ]
      },
      {
        label: 'Pickup Order',
        type: 'select',
        value: '',
        field: 'pickup',
        options: [
          { name: 'Ya', value: 'true' },
          { name: 'Tidak', value: 'false' },
        ]
      },
      {
        label: 'Collection',
        type: 'select',
        value: '',
        field: 'collection',
        optionsEndPoint: '/api/product/category',
        options: []
      },
      {
        label: 'Mulai',
        type: 'date',
        value: '',
        field: 'create_gte'
      },
      {
        label: 'Sampai',
        type: 'date',
        value: null,
        field: 'create_lte'
      },
    ],
    dataTable: [
      {
        label: 'Nomor Order',
        type: 'text',
        field: 'orderNumber'
      },
      {
        label: 'Jumlah Order',
        type: 'orderQuantity',
        field: 'items',
      },
      {
        label: 'Ongkos Kirim',
        type: 'text',
        field: 'shippingCost',
      },
      {
        label: 'Total',
        type: 'text',
        field: 'grandTotal',
      },
      /* {
        label: 'Bukti Transfer',
        type: 'objectImage',
        field: 'payment',
        field1: 'image'
      }, */
      {
        label: 'Status Pembayaran',
        type: 'badgePaymentStatus',
        field: 'payment',
        field1: 'status'
      },
      {
        label: 'Order Status',
        type: 'statusOrder',
        field: '',
      },
      /* {
        label: 'Cetak Pengiriman',
        type: 'actionShippingLabel',
        redirect: 'shippingLabelPrint',
        field: 'id',
      },
      {
        label: 'Input Resi',
        type: 'actionInputShippingLabel',
        field: 'shippingNumber',
      }, */
      {
        label: 'No Resi',
        type: 'object',
        field: 'shipping',
        field1: 'awb'
      },
      {
        label: 'Penerima',
        type: 'object',
        field: 'orderAddress',
        field1: 'recipientName'
      },
      {
        label: 'Email',
        type: 'object',
        field: 'user',
        field1: 'email'
      },
      {
        label: 'HP',
        type: 'object',
        field: 'orderAddress',
        field1: 'phone'
      },
      {
        label: 'Action',
        type: 'actionOrder',
        field: '',
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