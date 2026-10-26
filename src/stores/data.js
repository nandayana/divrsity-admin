import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router/index.js'
import httpRequest from '../services/httpRequest'
import dayjs from 'dayjs'

export const useDataStore = defineStore('data', {
  state: () => ({
    datas: ref([]),
    editData: ref(null),
    params: ref(null),
    rows: router.currentRoute.value.query.rows || 20,
    page: router.currentRoute.value.query.page || 1,
    count: 0,
    loadingButton: ref(false),
    relativeOptions: [],
    actions: [
      {
        value: 'DELETE',
        name: 'Hapus data dipilih'
      }
    ],
    selectedAction: ref(''),
    selectedRows: [],
    selectedAllRows: false,
    lookupField: 'id',
    enableAction: ref(false),
    error: ref(null),
    relativeOptions: ref([])
  }),
  getters: {
  },
  actions: {
    async getDatas() {
      this.params.dataFilter.forEach(async (item) => {
        if (item.optionsEndPoint) {
          const options = await this.getSelectOptions(item.optionsEndPoint)
          if (options.status === 200) {
            const optionsItems = []

            options.data.data.forEach((optionItem) => {
              optionsItems.push({
                name: optionItem.slug,
                value: optionItem.id,
              })
            })

            item.options = optionsItems
          }
        }
      })
      this.datas = []
      const queryParam = `rows=${this.rows}&page=${this.page}&${this.params.dataFilter.reduce((acc, filter) => {
        if (filter.value) {
          if (filter.type === 'date') {
            if (filter.field === 'create_lte') {
              acc.push(`${filter.field}=${dayjs(filter.value).startOf('day').format('YYYY-MM-DD')}`)
            } else {
              acc.push(`${filter.field}=${dayjs(filter.value).startOf('day').format('YYYY-MM-DD')}`)
            }
          } else {
            acc.push(`${filter.field}=${filter.value}`)
          }
        }
        return acc
      }, []).join('&')}`
      const payload = {
        method: 'GET',
        url: `${this.params.endpoint}?${queryParam}`
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {
        this.datas = response.data.data
        this.count = response.data.pagination.totalItems
      }
    },

    async getData(id) {
      const payload = {
        method: 'GET',
        url: `${this.params.endpoint}/${id}`
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {

        console.log('RESPONSE = ', response.data.data)
        this.params.dataForm.forEach((item) => {
          console.log('ITEM = ', response.data.data[item.field])
          item.value = response.data.data[item.field] || null
          if (item.type === 'autocomplete') {
            item.relativeSelected = response.data.data[item.relativeField]
          }
          if (item.type === 'number') {
            item.value = response.data.data[item.field] || 0
          }
        })
      }
    },

    async getSelectOptions(data) {
      const payload = {
        method: 'GET',
        url: `${data}`
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async updateData(data) {
      const payload = {
        method: 'PUT',
        url: `${this.params.endpoint}/${data.id}`,
        data: data.data
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async createData(data) {
      const payload = {
        method: 'POST',
        url: `${this.params.endpoint}`,
        data: data
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async deleteData(data) {
      const payload = {
        method: 'POST',
        url: `${this.params.endpoint}/delete`,
        data: data
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {
        this.getDatas()
      }
    },

    async getRelativeOptions(data) {
      console.log('DATA = ', data)
      const payload = {
        method: 'GET',
        url: `${data.model}?search=${data.query}`
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {
        this.relativeOptions = response.data.data
      }
    },

    async updatePaymentStatus(data) {
      const payload = {
        method: 'PUT',
        url: `/api/payment/update-status/${data.id}`,
        data: {
          status: data.status
        }
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async getOrderById(id) {
      const payload = {
        method: 'GET',
        url: `/api/order/item/${id}`
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {
        return response
      }
    },

    async getOrderList() {
      console.log('QUERY = ', router.currentRoute.value.query.create_gte)
      const payload = {
        method: 'GET',
        url: `/api/order/list?rows=1000&create_gte=${router.currentRoute.value.query.create_gte || ''}&create_lte=${router.currentRoute.value.query.create_lte || ''}&status=${router.currentRoute.value.query.status || ''}&payment_image=${router.currentRoute.value.query.payment_image || ''}&collection=${router.currentRoute.value.query.collection || ''}&awb=${router.currentRoute.value.query.awb || ''}&pickup=${router.currentRoute.value.query.pickup || ''}`
      }

      const response = await httpRequest.request(payload)

      if (response.status === 200) {
        return response
      }
    },

    async inputAwb(data) {
      const payload = {
        method: 'PUT',
        url: `/api/order/shipping/${data.id}`,
        data: {
          shippingNumber: data.shippingNumber
        }
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async uploadShipping(params) {
      const payload = {
        method: 'POST',
        url: `/api/order/upload-shipping`,
        data: params,
        // Tambahkan header multipart/form-data agar server mengenali kiriman file
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async pickupOrder(data) {
      const payload = {
        method: 'POST',
        url: `/api/shipping/pickup`,
        data: data
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async downloadShippingLabel(orderId) {
      const payload = {
        method: 'GET',
        url: `/api/shipping/download-label/${orderId}`,
        responseType: 'blob'
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async doneOrder(id) {
      const payload = {
        method: 'GET',
        url: `/api/order/done-order/${id}`,
      }

      const response = await httpRequest.request(payload)

      return response
    },

    async paymentCheck(data) {
      const payload = {
        method: 'POST',
        url: `/api/payment/payment-check`,
        data: data
      }

      const response = await httpRequest.request(payload)

      return response
    },
    
    async resendShipping(id) {
      const payload = {
        method: 'POST',
        url: `/api/payment/resend-shipping`,
        data: {
          id: id
        }
      }

      const response = await httpRequest.request(payload)

      return response
    }
  }
})
