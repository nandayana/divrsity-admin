<template>
  <div class="w-full flex flex-col items-center">
    <div
      v-for="(items, pageIndex) in orderPages"
      :key="pageIndex"
      class="print-page w-[100mm] h-[150mm] m-0 p-0 screen:my-5 screen:mx-auto screen:border screen:border-gray-300 screen:shadow-[0_2px_15px_rgba(0,0,0,.15)]"
    >
      <div
        v-if="order"
        class="shipping-label box-border w-[100mm] h-[150mm] overflow-hidden bg-white text-black p-[4mm] font-[Arial,Helvetica,sans-serif] text-[10px]"
      >
        <!-- HEADER -->
        <div class="flex justify-between items-center border-b-2 border-black pb-1">
          <div class="text-[22px] font-black tracking-[1px]">
            DIVRSITY
          </div>

          <div class="text-right">
            <div class="text-[16px] font-black">
              {{ order.orderShipping?.shipping || '-' }}
            </div>

            <div class="text-[10px]">
              {{ order.orderShipping?.shippingType || '-' }}
            </div>
          </div>
        </div>

        <!-- DESTINATION -->
        <div class="grid grid-cols-3">
          <div class="py-[3mm] border-b border-black col-span-2">
            <div class="text-[8px] font-black tracking-[.5px] mb-[1.5mm]">
              SHIP TO
            </div>

            <div class="text-[12px] font-black mb-[1mm]">
              {{ order.orderAddress?.recipientName }}
            </div>

            <div class="text-[11px] font-bold mb-[1.5mm]">
              {{ order.orderAddress?.phone }}
            </div>

            <div class="text-[10px] leading-[1.35]">
              {{ order.orderAddress?.address }}
            </div>

            <div class="text-[10px] leading-[1.35]">
              {{ order.orderAddress?.subdistrictName }},
              {{ order.orderAddress?.districtName }}
            </div>

            <div class="text-[10px] leading-[1.35]">
              {{ order.orderAddress?.cityName }},
              {{ order.orderAddress?.provinceName }}
            </div>

            <div class="text-[11px] font-black mt-[1mm]">
              {{ order.orderAddress?.postalCode }}
            </div>
          </div>

          <div class="py-[3mm] border-b border-black pl-1">
            <div class="text-[8px] font-black tracking-[.5px] mb-[1.5mm]">
              SHIP FROM
            </div>

            <div class="text-[12px] font-black mb-[1mm]">
              DIVRSITY
            </div>

            <div class="text-[11px] font-bold mb-[1.5mm]">
              0821 318 3838
            </div>
          </div>
        </div>

        <!-- ORDER INFO -->
        <div class="grid grid-cols-2 gap-[3mm] py-[2.5mm] border-b border-black">
          <div class="flex flex-col">
            <span class="text-[7px] font-bold">
              ORDER
            </span>

            <strong class="text-[9px] mt-[1mm]">
              {{ order.orderNumber }}
            </strong>
          </div>

          <div class="flex flex-col">
            <span class="text-[7px] font-bold">
              DATE
            </span>

            <strong class="text-[9px] mt-[1mm]">
              {{ formatDate(order.createdAt) }}
            </strong>
          </div>
        </div>

        <!-- ITEMS -->
        <div class="py-[2.5mm]">
          <div class="text-[8px] font-black tracking-[.5px] mb-[1.5mm]">
            ITEMS :
          </div>

          <div
            v-for="item in items"
            :key="item.id"
            class="py-1 border-b border-dashed border-gray-400 last:border-b-0"
          >
            <div class="flex justify-between">
              <div class="flex flex-col gap-0 min-w-0">
                <div class="text-[9px] font-bold leading-[1.25]">
                  {{ item.name }}
                </div>

                <div class="flex gap-1 font-light">
                  <div>
                    {{ item.product?.color?.name || '-' }}
                  </div>

                  <div>
                    {{ item.product?.size?.name || '-' }}
                  </div>
                </div>
              </div>

              <div class="shrink-0">
                <strong class="ml-auto">
                  ×{{ item.quantity }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="flex justify-between items-center border-t-2 border-black pt-[2mm]"
        >
          <div class="text-[10px]">
            TOTAL ITEM:

            <strong class="text-[14px]">
              {{ totalItems }}
            </strong>
          </div>

          <div
            class="border-2 border-black px-[3mm] py-[1.5mm] text-[10px] font-black"
          >
            {{ order.orderShipping?.codValue > 0 ? 'COD' : 'NON COD' }}
          </div>
        </div>

        <!-- PAGE -->
        <div
          v-if="orderPages.length > 1"
          class="text-center text-[7px] mt-[2mm]"
        >
          PAGE {{ pageIndex + 1 }} / {{ orderPages.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import router from '@/router'

const data = useDataStore()
const order = ref(null)

const ITEMS_PER_PAGE = 6

const orderPages = computed(() => {
  if (!order.value?.orders?.length) {
    return []
  }

  const pages = []

  for (let i = 0; i < order.value.orders.length; i += ITEMS_PER_PAGE) {
    pages.push(
      order.value.orders.slice(
        i,
        i + ITEMS_PER_PAGE
      )
    )
  }

  return pages
})

const totalItems = computed(() => {
  if (!order.value?.orders) {
    return 0
  }

  return order.value.orders.reduce(
    (total, item) => total + item.quantity,
    0
  )
})

function formatDate(date) {
  if (!date) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

function printLabel() {
  window.print()
}

onMounted(async () => {
  const id = router.currentRoute.value.params.id

  const res = await data.getOrderById(id)

  order.value = res.data.data

  await nextTick()

  setTimeout(printLabel, 300)
})
</script>

<style scoped>
@page {
  size: 100mm 150mm;
  margin: 0;
}

@media print {
  html,
  body {
    width: 100mm;
    margin: 0;
    padding: 0;
  }

  .print-page {
    width: 100mm;
    height: 150mm;
    margin: 0;
    padding: 0;
    break-after: page;
    page-break-after: always;
  }

  .print-page:last-child {
    break-after: auto;
    page-break-after: auto;
  }

  .shipping-label {
    width: 100mm;
    height: 150mm;
    box-sizing: border-box;
    margin: 0;
    padding: 4mm;
    overflow: hidden;
  }
}

@media screen {
  .print-page {
    margin: 20px auto;
  }

  .shipping-label {
    border: 1px solid #ddd;
    box-shadow: 0 2px 15px rgba(0, 0, 0, .15);
  }
}
</style>