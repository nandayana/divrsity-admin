<template>
  <div class="bg-gray-50 dark:bg-gray-800 h-full absolute top-0 bottom-0 left-0 right-0 overflow-auto">
    <div class="flex gap-4 px-4 pt-4 justify-between sticky left-0">
      <div class="text-xl font-bold">{{ currentRoute.meta.menu.name }}</div>
      <div class="flex gap-2">
        <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="pickupOrderBulk">Pickup Order</fwb-button>
        <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="openDownloadModal">Download</fwb-button>
        <!-- <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="openUploadModal">Upload</fwb-button> -->
        <fwb-button class="bg-brand-600" @click="addData()">
          <template #prefix>
            <plus-icon class="h-5 text-white" />
          </template>
          Add {{ currentRoute.meta.menu.name }}
        </fwb-button>
      </div>
    </div>
    <div class="p-4 flex justify-between sticky left-0">
      <div class="flex gap-8">
        <fwb-button @click="openFilterModal" class="bg-brand-500 hover:bg-brand-600 relative">
          <div v-if="data.params.dataFilter.filter(item => item.value).length" class="bg-red-600 absolute rounded-full h-5 w-5 right-1 top-0 text-xs flex justify-center border-2 border-brand-500 items-center">{{ data.params.dataFilter.filter(item => item.value).length }}</div>
          <filterIcon class="w-5" />
        </fwb-button>
      </div>
      <div class="flex gap-4">
        <fwb-select :disabled="!data.enableAction" v-model="data.selectedAction" :options="data.actions"
          placeholder="Aksi" clearable />
        <fwb-button v-if="data.selectedAction" class="bg-brand-500 hover:bg-brand-600"
          @click="submitAction()">Go</fwb-button>

        <!-- <div v-if="data.selectedRows.length === data.datas.length && data.selectedRows.length !== 0">
          <fwb-button v-if="!data.selectedAllRows" color="default" class="text-nowrap h-full" @click="selectAllRows()">Pilih semua {{ data.count }} {{ preference.tabName }}</fwb-button>
          <fwb-button v-else color="yellow" class="h-full" @click="clearAllRows()">Batal</fwb-button>
        </div> -->
      </div>
    </div>
    <div v-if="!data.datas.length" class="absolute top-32  bottom-0 left-0 right-0 items-center flex justify-center">Tidak ada data</div>
    <div class="min-w-fit" v-else>
      <table class="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-100 text-body overscroll-y-auto">
        <thead class="text-sm text-body bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <fwb-checkbox v-model="checkedAll" :disabled="!data.datas?.length"
                  class="cursor-pointer text-brand-500 border-brand-400 focus:ring-brand-600" @click="checkAll" />
              </div>
            </th>
            <th scope="col" class="px-6 py-3 font-medium" v-for="item, index in headers">
              <div class="w-full flex justify-between gap-2">
                <div>{{ item.label }}</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in bodies" class="bg-neutral-primary-soft border-b border-default hover:bg-gray-100 dark:hover:bg-gray-600">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <fwb-checkbox 
                  v-model="data.selectedRows"
                  class="cursor-pointer text-brand-500 border-brand-400 focus:ring-brand-600" 
                  :value="row.lookupField"
                  :name="row.lookupField"
                />
              </div>
            </td>
            <td v-for="item, index in row.datas" class="px-6 h-12 whitespace-nowrap">
              <div :class="index === 0 ? 'font-bold cursor-pointer' : ''" @click="index === 0 ? editData(row) : ''">
                <div v-if="item.type === 'date'">{{ dayjs(item.value).format('DD MMMM YYYY') }}</div>
                <div v-if="item.type === 'dateTime'">{{ item.value ? dayjs(item.value).format('DD MMM YYYY, HH:mm') : '-' }}</div>
                <div v-else-if="item.type === 'boolean'">
                  <check-circle-icon v-if="item.value" class="h-5 text-green-500" />
                  <close-circle-icon v-else class="h-5 text-red-500" />
                </div>
                <div v-else-if="item.type === 'image'" class="h-full">
                  <img :src="item.value" class="object-cover h-10" alt="">
                </div>
                <div v-else-if="item.type === 'objectImage'" class="h-full">
                  <img :src="imageConverter(item.value?.image)" class="object-cover h-10 cursor-pointer" alt=""
                    @click="openImageModal(item.value.image)">
                </div>
                <div v-else-if="item.type === 'orderQuantity'" class="h-full">
                  <div class="flex flex-col gap-1">
                    <div v-for="value in item.value" :key="value.id">
                      {{ value.name }} X {{ value.quantity }} - {{ value.variant.size.name }}
                    </div>
                    <div class="font-bold">Total: {{ calculateTotal(item.value) }}</div>
                    <div class="font-bold">Total: {{ calculateAmount(item.value) }}</div>
                  </div>
                </div>
                <div v-else-if="item.type === 'actionShippingLabel'" class="h-full">
                  <fwb-button @click="printShippingLabel(item)">Cetak Label</fwb-button>
                </div>
                <div v-else-if="item.type === 'actionInputShippingLabel'" class="h-full flex gap-2">
                  <div class="w-20 overflow-hidden text-ellipsis whitespace-nowrap content-center">{{ item.value || '-' }}</div>
                  <fwb-button @click="openInputShippingModal(row.datas)">{{ item.value ? 'Ubah Resi' : 'Input Resi' }}</fwb-button>
                </div>
                <div v-else-if="item.type === 'badgePaymentStatus'" class="h-full">
                  <fwb-badge :type="item.value?.status === 'EXPIRED' ? 'red' : item.value?.status === 'PENDING' ? 'yellow' : item.value?.status === 'PAID' ? 'green' : 'dark'">
                    {{ item.value?.status }}
                  </fwb-badge>
                </div>
                <div v-else-if="item.type === 'actionPaymentStatus'" class="h-full">
                  <fwb-dropdown 
                    v-if="!item.value?.paymentId"
                    :text="item.value?.status"
                    :color="item.value?.status === 'pending' ? 'red' : item.value?.status === 'success' ? 'green' : 'dark'"
                  >
                    <nav class="py-2 text-sm text-gray-700 dark:text-gray-200">
                      <div
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        @click="updateStatus(item, 'pending')">Pending</div>
                      <div
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        @click="updateStatus(item, 'success')">Success</div>
                      <div
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        @click="updateStatus(item, 'rejected')">Rejected</div>
                    </nav>
                  </fwb-dropdown>
                  <div v-else>{{ item.value.status }}</div>
                </div>
                <div v-else-if="item.type === 'actionOrder'" class="h-full flex gap-2">
                  <fwb-button class="group" :disabled="Boolean(!item.value.shipping?.awb)" @click="downloadShippingLabel({value: item.value.id})">
                    <div class="flex">
                      <printerIcon class="h-5" />
                      <span class="max-w-0 opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                        Cetak Label
                      </span>
                    </div>
                  </fwb-button>
                  <fwb-button color="green" class="group z-10" :disabled="Boolean(!item.value.shipping || !!item.value.shipping?.awb)" @click="openPickupModal(item.value)">
                    <div class="flex">
                      <truckClockIcon class="h-5" />
                      <span class="max-w-0 opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                        Pickup Order
                      </span>
                    </div>
                  </fwb-button>
                  <fwb-button color="purple" class="group z-10" :disabled="Boolean(item.value.orderShipping?.shipping !== 'Pickup' || item.value.payment?.status !== 'PAID' || item.value.status === 'DONE')" @click="openConfirmationPickupModal(item.value)">
                    <div class="flex">
                      <storeIcon class="h-5" />
                      <span class="max-w-0 opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                        Konfirmasi Pickup
                      </span>
                    </div>
                  </fwb-button>
                  <fwb-button color="yellow" class="group z-10" @click="paymentCheck(item.value)">
                    <div class="flex">
                      <cashIcon class="h-5" />
                      <span class="max-w-0 opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                        Cek Pembayaran
                      </span>
                    </div>
                  </fwb-button>
                  <fwb-button :disabled="Boolean(item.value.shipping || item.value.payment?.status !== 'PAID' || item.value.orderShipping.shipping === 'Pickup')" color="red" class="group z-10" @click="resendShipping(item.value)">
                    <div class="flex">
                      <arrowRightAltIcon class="h-5" />
                      <span class="max-w-0 opacity-0 whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
                        Resend Shipping
                      </span>
                    </div>
                  </fwb-button>
                </div>
                <div v-else-if="item.type === 'statusOrder'" class="h-full flex gap-2">
                  <fwb-badge :type="status(item.value).type">{{ status(item.value).label }}</fwb-badge>
                </div>
                <div v-else-if="item.type === 'color'" class="flex gap-2">
                  <div :style="{'background-color': item.value}" class="h-6 w-6 rounded-md border"></div>
                  <div>{{ item.value }}</div>
                </div>
                <div v-else-if="item.type === 'number'" class="flex gap-2">
                  <div>{{ item.value || 0 }}</div>
                </div>
                <div v-else-if="item.type === 'variant'" class="flex flex-col">
                  <div class="flex gap-2">
                    <div v-if="item.value.product?.category">{{ item.value.product.category.name }}</div>
                    <div>-</div>
                    <div v-if="item.value.product?.name">{{ item.value.product.name }}</div>
                  </div>
                  <div v-if="item.value.size?.name">{{ item.value.size.name }}</div>
                  <div v-if="item.value.color?.name">{{ item.value.color.name }}</div>
                </div>
                <div v-else>{{ item.value }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="z-10 sticky bottom-0 right-0 left-0 p-4 flex justify-between gap-4 items-center w-full bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg text-nowrap overflow-auto">
      <div class="flex justify-center items-center gap-4">
        <fwb-select v-model="data.rows" :options="rows" placeholder="" @change="changeRow" />
        <div>
          <span class="text-sm text-gray-700 dark:text-gray-300">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">{{ data.datas.length ? (data.page * data.rows) -
              data.rows + 1 : '0' }}</span>
            to
            <span class="font-semibold text-gray-900 dark:text-white">{{ data.page * data.rows > data.count ?
              data.count :
              data.page * data.rows }}</span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">{{ data.count }}</span>
            Entries
          </span>
        </div>
      </div>
      <fwb-pagination v-model="data.page" :total-pages="Math.ceil(data.count / data.rows)" large enable-first-last
        @update:model-value="changePage">
        <template #page-button="{ disabled, page, setPage }">
          <button
            class="disabled:cursor-not-allowed ml-0 flex h-10 items-center justify-center border px-3 leading-tight text-gray-600 first:rounded-l-lg last:rounded-r-lg hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
            :class="{
              'bg-white hover:bg-brand-100': !disabled,
              'bg-brand-200 dark:bg-brand-200': disabled
            }" :disabled="disabled" @click="setPage(page)">
            {{ page }}
          </button>
        </template>
      </fwb-pagination>
    </div>
  </div>

  <fwb-modal v-if="showImageModal" @close="showImageModal = false" class="z-50" overlayClass="z-50">
    <template #body>
      <div class="flex justify-center items-center">
        <img :src="imageConverter(selectedImage)" class="object-cover" alt="">
      </div>
    </template>
  </fwb-modal>

  <fwb-modal v-if="showFilterModal" @close="showFilterModal = false, identifyFilter()" class="z-50" overlayClass="z-50">
    <template #body>
      <form v-on:submit.prevent="filter()" class="flex flex-col gap-4">
        <div v-for="filter in data.params.dataFilter">
          <div v-if="filter.type === 'search'">
            <fwb-input class="mt-7" v-model="filter.value" :placeholder="filter.label + '...'" >
              <template #suffix v-if="filter.value">
                <CloseCircleIcon @click="filter.value = null" class="h-5 cursor-pointer" />
              </template>
            </fwb-input>
          </div>
          <div v-else-if="filter.type === 'select'" class="flex flex-col gap-1">
            <div class="font-bold text-black">{{ filter.label }}</div>
            <div class="flex gap-2">
              <div class="border px-4 py-1 rounded-full cursor-pointer" :class="!filter.value ? 'bg-brand-500 text-white' : ''" @click="filter.value = null">Semua</div>
              <div v-for="item in filter.options" class="border px-4 py-1 rounded-full cursor-pointer" :class="filter.value === item.value ? 'bg-brand-500 text-white' : ''" @click="filter.value = item.value">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div v-else-if="filter.type === 'date'" class="flex flex-col gap-1">
            <div class="font-bold text-black">{{ filter.label }}</div>
            <VueDatePicker v-model="filter.value" placeholder="Pilih tanggal" :time-config="{ enableTimePicker: false }" :auto-apply="true" :formats="{ input: 'dd-MM-yyyy' }" model-type="yyyy-MM-dd" />
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <fwb-button class="bg-yellow-500 hover:bg-yellow-600" @click="resetFilter()">Reset</fwb-button>
        <fwb-button class="bg-brand-500 hover:bg-brand-600" @click="filter()">Filter</fwb-button>
      </div>
    </template>
  </fwb-modal>
  
  <fwb-modal v-if="showDownloadModal" @close="showDownloadModal = false" class="z-50" overlayClass="z-50">
    <template #header>
      Download Lists
    </template>
    <template #body>
      <div class="flex flex-col divide-y-2">
        <div class="flex justify-between items-center py-2">
          <div>Laporan Penjualan</div>
          <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="downloadSalesReport()">Download</fwb-button>
        </div>
        <!-- <div class="flex justify-between items-center py-2">
          <div>List Pengiriman</div>
          <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="downloadShippingReport()">Download</fwb-button>
        </div> -->
        <div class="flex justify-between items-center py-2">
          <div>Cetak Label Pengiriman</div>
          <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="printShippingLabelBulk()">Download</fwb-button>
        </div>
      </div>
    </template>
  </fwb-modal>
  
  <fwb-modal v-if="showUploadModal" @close="showUploadModal = false" class="z-50" overlayClass="z-50">
    <template #header>
      Upload Lists
    </template>
    <template #body>
      <div class="flex flex-col divide-y-2">
        <div class="flex justify-between items-center py-2 w-full">
          <fwb-file-input 
            v-model="fileShipping" 
            label="Upload List Resi"
            wrapperClass = "w-full"
            class="form-input dark:text-gray-500 focus:ring-brand-300 focus:border-brand-300 dark:focus:ring-brand-500 dark:focus:border-brand-500"
          />
          <fwb-button v-if="data.params.name === 'orderList'" class="bg-brand-500 hover:bg-brand-600" @click="uploadFile()">Submit</fwb-button>
        </div>
      </div>
    </template>
  </fwb-modal>

  <fwb-modal v-if="showInputShippingModal" @close="showInputShippingModal = false" class="z-50" overlayClass="z-50">
    <template #header>
      Input Resi
    </template>
    <template #body>
      <fwb-input v-model="awbValue" @keyup.enter="submitInputShipping()" />
    </template>
  </fwb-modal>

  <fwb-modal v-if="showPickupModal" @close="showPickupModal = false" class="z-50" overlayClass="z-50">
    <template #header>
      Pickup Order
    </template>
    <template #body>
      <VueDatePicker v-model="pickupDateTime"></VueDatePicker>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <fwb-button class="bg-brand-500 hover:bg-brand-600" @click="showPickupModal = false">Cancel</fwb-button>
        <fwb-button class="bg-yellow-500 hover:bg-yellow-600" @click="pickupOrder()">Submit</fwb-button>
      </div>
    </template>
  </fwb-modal>
  
  <fwb-modal v-if="showPickupBulkModal" @close="showPickupBulkModal = false" class="z-50" overlayClass="z-50">
    <template #header>
      Pickup Order
    </template>
    <template #body>
      <VueDatePicker v-model="pickupBulkDateTime" placeholder="Pilih tanggal"></VueDatePicker>
    </template>
    <template #footer>
      <div class="flex justify-end gap-4">
        <fwb-button class="bg-brand-500 hover:bg-brand-600" @click="showPickupBulkModal = false">Cancel</fwb-button>
        <fwb-button class="bg-yellow-500 hover:bg-yellow-600" @click="sendPickupOrderBulk()">Submit</fwb-button>
      </div>
    </template>
  </fwb-modal>

  <fwb-modal v-if="showConfirmationPickupModal" @close="closeConfirmationPickupModal()" class="z-50" overlay>
    <template #header>
      <div class="flex items-center text-lg">
        Konfirmasi
      </div>
    </template>
    <template #body>
      <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Apakah Anda yakin ubah status pesanan <span class="font-bold">{{ selectedShippingOrder.orderNumber }}</span> menjadi "Selesai"?
      </p>
    </template>
    <template #footer>
      <div class="flex w-full justify-between">
        <fwb-button @click="closeConfirmationPickupModal" color="alternative">
          Batal
        </fwb-button>
        <fwb-button @click="doActionConfirmationPickup" color="green">
          Ya
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
<script setup>
import { useDataStore } from '@/stores/data';
import { FwbCheckbox, FwbSelect, FwbPagination, FwbButton, FwbDropdown, FwbModal, FwbInput, FwbFileInput, FwbBadge } from 'flowbite-vue';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import router from '@/router';
import { usePreferenceStore } from '@/stores/preference';
import CloseCircleIcon from '@/components/icons/solid/closeCircleIcon.vue';
import CheckCircleIcon from '@/components/icons/solid/checkCircleIcon.vue';
import plusIcon from '@/components/icons/outline/plusIcon.vue'
import filterIcon from '../icons/outline/filterIcon.vue';
import printerIcon from '../icons/outline/printerIcon.vue';
import truckClockIcon from '../icons/outline/truckClockIcon.vue';
import storeIcon from '../icons/outline/storeIcon.vue';
import cashIcon from '../icons/outline/cashIcon.vue';
import arrowRightAltIcon from '../icons/outline/arrowRightAltIcon.vue';
import { VueDatePicker } from '@vuepic/vue-datepicker';

const currentRoute = ref(router.currentRoute)
const data = useDataStore()
const checkedAll = ref(false)
const selectedImage = ref(null)
const showImageModal = ref(false)
const showFilterModal = ref(false)
const showDownloadModal = ref(false)
const showInputShippingModal = ref(false)
const selectedData = ref(null)
const awbValue = ref(null)
const showUploadModal = ref(null)
const fileShipping = ref(null)
const showPickupModal = ref(false)
const selectedShippingOrder = ref(null)
const pickupDateTime = ref(null)
const showConfirmationPickupModal = ref(false)
const showPickupBulkModal = ref(false)
const pickupBulkDateTime = ref(null)

const resendShipping = async (item) => {
  const res = await data.resendShipping(item.id)
  if (res.status === 200) {
    data.getDatas()
  }
}

const paymentCheck = async (item) => {
  const res = await data.paymentCheck(item.payment)
  if (res.status === 200) {
    data.getDatas()
  }
}

const pickupOrderBulk = () => {
  showPickupBulkModal.value = true
}

const sendPickupOrderBulk = async() => {
  const shippingNumber = []
  data.datas.forEach((order) => {
    if (order.shipping) {
      shippingNumber.push({
        order_no: order.shipping.shippingNo
      })
    }
  })

  const res = await data.pickupOrder(
    {
      pickup_date: dayjs(pickupBulkDateTime.value).format('YYYY-MM-DD'),
      pickup_time: dayjs(pickupBulkDateTime.value).format('HH:mm'),
      pickup_vehicle: 'Mobil',
      orders: shippingNumber
    }
  )

  console.log('RESULT = ', res.status)

  if (res.status === 200) {
    showPickupBulkModal.value = false
    data.getDatas()
  }
}

const status = (item) => {
  if (!item || !item.payment) return {type: 'red', label: 'Rejected'};

  if (item.status === 'DONE') return {type: 'green', label: 'Done'};

  const payment = item.payment.status.toUpperCase()
  if (!item.payment.paymentType || item.payment.paymentType === 'direct') {
    if (payment === 'SUCCESS') {
      if (item.shippingNumber) {
        return {type: 'green', label: 'On Delivery'};
      } else {
        return {type: 'yellow', label: 'Packing'};
      }
    } else if (payment === 'REJECTED') {
      return {type: 'red', label: 'Rejected'};
    } else {
      return {type: 'yellow', label: 'Process'};
    }
  }

  const shipping = item.shipping;
  if (shipping) {
    const shippingStatus = shipping.status.toUpperCase();

    if (shippingStatus === 'SENT') return {type: 'green', label: 'On Delivery'};
    if (shippingStatus === 'PROBLEM') return {type: 'red', label: 'Shipping Problem'};
    if (shippingStatus === 'PENDING') return {type: 'yellow', label: 'Packing'};
    if (shippingStatus === 'RETURN') return {type: 'yellow', label: 'Return'};
    if (shippingStatus === 'RETURN DONE') return {type: 'dark', label: 'Return Done'};
    if (shippingStatus === 'CANCELLED') return {type: 'red', label: 'Cancelled'};
    if (shippingStatus === 'RECEIVED') return {type: 'green', label: 'Done'};
  }

  const paymentStatus = item.payment.status.toUpperCase()

  if (paymentStatus === 'PENDING') return {type: 'yellow', label: 'Waiting Payment'};
  if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS') return {type: 'yellow', label: 'Packing'};
  if (paymentStatus === 'EXPIRED' || paymentStatus === 'REJECTED') return {type: 'red', label: 'Rejected'};
  return {type: 'red', label: 'Rejected'};
}

const openConfirmationPickupModal = (item) => {
  selectedShippingOrder.value = item
  showConfirmationPickupModal.value = true
}

const closeConfirmationPickupModal = () => {
  showConfirmationPickupModal.value = false
}

const doActionConfirmationPickup = () => {
  try {
    data.doneOrder(selectedShippingOrder.value.orderNumber)
  } catch (error) {
    
  } finally {
    data.getDatas()
    showConfirmationPickupModal.value = false
  }
}

const openPickupModal = (item) => {
  selectedShippingOrder.value = item
  showPickupModal.value = true
}

const pickupOrder = async () => {
  const res = await data.pickupOrder(
    {
      pickup_date: dayjs(pickupDateTime.value).format('YYYY-MM-DD'),
      pickup_time: dayjs(pickupDateTime.value).format('HH:mm'),
      pickup_vehicle: 'Mobil',
      orders: [
        {
          order_no: selectedShippingOrder.value.shipping.shippingNo
        }
      ]
    }
  )

  console.log('RESULT = ', res.status)

  if (res.status === 200) {
    showPickupModal.value = false
    data.getDatas()
  }
}

const uploadFile = async () => {
  if (!fileShipping.value) {
    alert('Pilih file Excel terlebih dahulu!')
    return
  }

  const params = new FormData()
  // MASUKKAN FILE KE FORMDATA DI SINI (nama key 'file' harus cocok dengan Multer di Express)
  params.append('file', fileShipping.value)

  try {
    await data.uploadShipping(params)
    showUploadModal.value = false
    alert('Berhasil mengunggah file!')
    data.getDatas()
  } catch (error) {
    console.error('Gagal upload:', error)
  }
}

const openUploadModal = () => {
  showUploadModal.value = true
}

const submitInputShipping = async () => {
  const id = selectedData.value[0].value
  const res = await data.inputAwb({id: id, shippingNumber: awbValue.value})
  if (res.status === 200) {
    data.datas.forEach((item) => {
      if (item.orderNumber === id) {
        item.shippingNumber = res.data.data.shippingNumber
      }
    })
  }
  showInputShippingModal.value = false
  awbValue.value = null
}

const openInputShippingModal = (item) => {
  selectedData.value = item
  showInputShippingModal.value = true
}

const openDownloadModal = () => {
  showDownloadModal.value = true
}

const openFilterModal = () => {
  showFilterModal.value = true
  identifyFilter()
}

const downloadShippingLabel = async (item) => {
  try {
    const res = await data.downloadShippingLabel(item.value)

    console.log('RESULT = ', res)

    const blob = new Blob([res.data], {
      type: 'application/pdf'
    })

    const url = window.URL.createObjectURL(blob)

    window.open(url, '_blank')

    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 5000)
  } catch (error) {
    console.error('Download shipping label error:', error)
  }
}

const printShippingLabel = (item) => {
  const route = router.resolve({
    name: 'shipping-label-print',
    params: {
      id: item.value
    }
  })

  window.open(
    route.href,
    '_blank'
  )
}

const printShippingLabelBulk = () => {
  console.log('ASEM = ', router.currentRoute.value.query)
  const route = router.resolve({
    name: 'shipping-label-print-bulk',
    query: {
      ...router.currentRoute.value.query || null
    }
  })

  window.open(
    route.href,
    '_blank'
  )
  showDownloadModal.value = false
}

const downloadSalesReport = () => {
  const domain = window.location.origin
  const queryParam = `rows=${data.rows}&page=${data.page}&${data.params.dataFilter.reduce((acc, filter) => {
    if (filter.value) {
      acc.push(`${filter.field}=${filter.value}`)
    }
    return acc
  }, []).join('&')}`
  window.open(`${domain}/api/order/report?${queryParam}`, '_blank')
  showDownloadModal.value = false
}
const downloadShippingReport = () => {
  const domain = window.location.origin
  const queryParam = `rows=${data.rows}&page=${data.page}&${data.params.dataFilter.reduce((acc, filter) => {
    if (filter.value) {
      acc.push(`${filter.field}=${filter.value}`)
    }
    return acc
  }, []).join('&')}`
  window.open(`${domain}/api/order/shipping?${queryParam}`)
  showDownloadModal.value = false
}

const filter = () => {
  const filters = []
  data.page = 1
  data.params.dataFilter.forEach((filter) => {
    filters[filter.field] = filter.value

    if (filter.type === 'date' && filter.value) {
      if (filter.field === 'create_lte') {
        filters[filter.field] = dayjs(filter.value).startOf('day').format('YYYY-MM-DD')
      } else {
        filters[filter.field] = dayjs(filter.value).startOf('day').format('YYYY-MM-DD')
      }
    }
  })
  console.log('FILTER = ', filters)

  router.replace({
    query: {
      ...router.currentRoute.value.query,
      ...filters,
      page: 1,
    }
  }).then(() => {
    data.getDatas()
    showFilterModal.value = false
  })
}

const resetFilter = () => {
  data.page = 1
  data.params.dataFilter.forEach((filter) => {
    filter.value = ''
  })

  router.replace({
    query: {
      ...router.currentRoute.value.query,
      ...data.params.dataFilter.reduce((acc, filter) => {
        acc[filter.field] = ''
        return acc
      }, {}),
      page: 1,
    }
  }).then(() => {
    data.getDatas()
    showFilterModal.value = false
  })
}

const calculateAmount = (items) => {
  let total = 0
  items?.forEach((item) => {
    total += item.quantity * item.price
  })
  return total
}

const calculateTotal = (items) => {
  let total = 0
  items?.forEach((item) => {
    total += item.quantity
  })
  return total
}

const updateStatus = async (item, status) => {
  const response = await data.updatePaymentStatus({
    id: item.value.id,
    status: status
  })

  if (response.status === 200) {
    data.getDatas()
  }
}

const openImageModal = (image) => {
  selectedImage.value = image
  showImageModal.value = true
}

const rows = [
  {
    value: 2,
    name: 2,
  },
  {
    value: 10,
    name: 10,
  },
  {
    value: 20,
    name: 20,
  },
  {
    value: 30,
    name: 30,
  },
  {
    value: 50,
    name: 50,
  },
  {
    value: 100,
    name: 100,
  },
]

const imageConverter = (url) => {
  if (!url) {
    return null
  }
  return url.replace("//app", "")
}

const addData = () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      state: 'create'
    }
  }).then(() => {
  })
}

const submitAction = () => {
  actionDelete()
}

const actionDelete = () => {
  data.deleteData({
    action: data.selectedAction,
    isSelectedAll: data.selectedAllRows,
    ids: data.selectedRows
  })

  data.selectedAction = null
  data.selectedAllRows = false
  data.selectedRows = []
}

watch(() => data.selectedRows, (newSelectedRows) => {
  data.enableAction = false
  data.selectedAction = ''
  if (newSelectedRows.length) {
    data.enableAction = true
  }

  if (newSelectedRows.length === data.rows) {
    checkedAll.value = true
  } else {
    checkedAll.value = false
    data.selectedAllRows = false
  }
})

const checkAll = () => {
  checkedAll.value = !checkedAll.value
  if (checkedAll.value) {
    data.selectedRows = []
    data.datas.forEach((item) => {
      data.selectedRows.push(item[data.lookupField])
    })
  } else {
    data.selectedRows = []
  }
}

const selectAllRows = () => {
  data.selectedAllRows = true
}

const clearAllRows = () => {
  data.selectedAction = ''
  data.selectedAllRows = false
  data.selectedRows = []
  checkedAll.value = !checkedAll.value
}

const editData = (params) => {
  console.log('params = ', params)
  router.push({
    query: {
      ...router.currentRoute.value.query,
      state: 'update',
      id: params.lookupField
    }
  }).then(() => {
  })
}

const headers = computed(() => {
  let filteredHeader = []
  data.params?.dataTable.forEach((item) => {
    filteredHeader.push(item)
  })
  return filteredHeader
})

const changePage = (value) => {
  data.page = value
  router.replace({
    query: {
      ...router.currentRoute.value.query,
      page: value
    }
  }).then(() => {
    data.getDatas()
  })
}

const bodies = computed(() => {
  let filteredBodies = []
  data.datas?.forEach((item) => {
    let filteredBody = []
    data.params?.dataTable.forEach((key) => {
      let lists = {
        value: item[key.field] || null,
        type: key.type
      }

      if (key.type === 'object' && item[key.field]) {
        if (key.field2) {
          console.log('ASEM = ', key.field2)
          console.log('ASEM = ', item.product.category.name)
          lists.value = item[key.field][key.field1][key.field2]
        } else if (key.field1) {
          lists.value = item[key.field][key.field1]
        }
      }

      if (key.type === 'actionOrder') {
        lists.value = item
      }
      
      if (key.type === 'variant') {
        lists.value = item
      }
      
      if (key.type === 'statusOrder') {
        lists.value = item
      }

      filteredBody.push(lists)
    })

    filteredBodies.push({
      lookupField: item[data.lookupField],
      datas: filteredBody,
    })
  })
  return filteredBodies
})

const changeRow = (event) => {
  data.rows = event.target.value
  data.page = 1

  router.replace({
    query: {
      ...router.currentRoute.value.query,
      rows: event.target.value
    }
  }).then(() => {
    data.getDatas()
  })
}

const identifyFilter = () => {
  const filters = []
  data.params.dataFilter.forEach((filter) => {
    router.currentRoute.value.query[filter.field] ? filter.value = router.currentRoute.value.query[filter.field] : filter.value = ''
  })
  return filters
}

onMounted(() => {
  data.rows = router.currentRoute.value.query.rows || 10
  data.page = Number(router.currentRoute.value.query.page) || 1
  if (data.params.dataFilter.length) {
    identifyFilter()
  }
  data.getDatas()
})

onUnmounted(() => {
  data.selectedRows = []
  data.selectedAllRows = false
})
</script>