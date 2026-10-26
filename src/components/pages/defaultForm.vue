<template>
  <div class="p-4">
    <div v-if="router.currentRoute.value.query.state === 'create'" class="border-b-2 pb-2 text-lg font-bold">Tambah {{
      currentRoute.meta.menu.name }}</div>
    <div v-if="router.currentRoute.value.query.state === 'update'" class="border-b-2 pb-2 text-lg font-bold">Edit {{
      currentRoute.meta.menu.name }}</div>
    <div>
      <div v-if="data.error" class="border border-red-600 mt-4 p-2 bg-red-100 rounded-md">{{ data.error }}</div>
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl py-4">
          <div v-for="form in data.params?.dataForm">
            <fwb-input v-if="['text', 'number', 'email', 'password', 'list', 'color'].includes(form.type) && !form.choices"
              :type="form.type" v-model="form.value"
              :label="`${form.label} ${form.required ? '*' : ''}`"
              :placeholder="`Input ${form.label}`"
              :required="form.required"
              :validation-status="form.error ? 'error' : ''" input-class="placeholder-gray-400"
              class="h-10 border-[1px] bg-white border-gray-300 has-[input:focus]:border-brand-500 dark:border-gray-500 dark:has-[input:focus]:border-brand-500 has-[input:focus]:ring-brand-300 dark:has-[input:focus]:ring-brand-500">
              <template v-if="form.error" #validationMessage>
                {{ form.error }}
              </template>
              <template #helper>
                <div class="text-gray-400">{{ form.notes }}</div>
              </template>
            </fwb-input>
            <fwb-textarea v-if="form.type === 'textarea'"
              v-model="form.value"
              :label="`${form.label} ${form.required ? '*' : ''}`" 
              :required="form.required"
              :placeholder="`Input ${form.label}`" 
              :validation-status="form.error ? 'error' : ''"
              class="bg-white"
            >
              <template v-if="form.error" #validationMessage>
                {{ form.error }}
              </template>
              <template #helper>
                <div class="text-gray-400">{{ form.notes }}</div>
              </template>
            </fwb-textarea>
            <fwb-file-input v-if="form.type === 'image'" 
              v-model="form.value"
              :label="`${form.label} ${form.required ? '*' : ''}`" 
              :validation-status="form.error ? 'error' : ''"
              class="form-input dark:text-gray-500 focus:ring-brand-300 focus:border-brand-300 dark:focus:ring-brand-500 dark:focus:border-brand-500"
            >
              <template v-if="form.error" #validationMessage>
                {{ form.error }}
              </template>
              <template #helper>
                <div class="text-gray-400">{{ form.notes }}</div>
              </template>
            </fwb-file-input>
            <div v-if="form.type === 'image'" class="w-fit h-auto cursor-pointer">
              <div v-if="form.value" class="relative mt-2">
                <fwb-img :src="imageSrc(form.value)" alignment="mx-auto" alt="flowbite-vue"
                  img-class="rounded-lg border h-32 w-full" />
                <div class="absolute right-2 top-2 bg-red-400 rounded-md" @click="deleteImage(form)">
                  <closeIcon class="w-6 h-6" />
                </div>
              </div>
              <div v-else class="relative mt-2">
                <fwb-img :src="noImage" img-class="rounded-lg border-[1px]" />
              </div>
            </div>
            <fwb-autocomplete v-if="form.type === 'autocomplete'"
              v-model="form.relativeSelected"
              :options="data.relativeOptions" 
              :loading="loading" 
              :search-fields="form.relativeDisplay"
              :display="form.displayField || 'label'" 
              :label="form.label"
              :placeholder="`Ketik untuk mencari ${form.label}...`" 
              :required="form.required" 
              remote 
              :min-chars="2"
              :debounce="500"
              @search="search($event, form)" 
              :validation-status="form.error ? 'error' : ''"
              input-class="placeholder-gray-400 bg-white rounded-l-lg">
              <template #option="{ option }">
                <div>{{ option.name }}</div>
              </template>
              <template v-if="form.error" #validationMessage>
                <div>{{ 'Please select a ' + form.field }}</div>
              </template>
              <template #helper>
                <div>We'll never share your details. Read our</div>
              </template>
            </fwb-autocomplete>
            <div v-if="form.type === 'boolean'" class="flex flex-col h-full gap-2">
              <div class="h-full flex flex-col justify-center">
                <fwb-checkbox class="cursor-pointer text-brand-500 border-brand-400 focus:ring-brand-600"
                  v-model="form.value" :label="`${form.label} ${form.require ? '*' : ''}`" />
              </div>
            </div>

            <div v-if="form.type === 'dateTime'">
              <VueDatePicker v-model="form.value"></VueDatePicker>
            </div>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="inline-flex" role="group">
            <fwb-button :disabled="data.loadingButton" :loading="data.loadingButton" type="submit" class="rounded-none bg-brand-500 hover:bg-brand-600 rounded-l-lg">Save</fwb-button>
            <fwb-dropdown close-inside placement="top">
              <template #trigger>
                <fwb-button class="rounded-none rounded-r-lg border-l-[1px] p-1 bg-brand-500 hover:bg-brand-600">
                  <div class="h-8 w-5 flex items-center justify-center">
                    <angleDownIcon class="h-3 w-3" />
                  </div>
                </fwb-button>
              </template>
              <fwb-list-group>
                <fwb-list-group-item @click="submit('saveAndEdit')">Save and edit</fwb-list-group-item>
                <fwb-list-group-item @click="submit('saveAndAddAnother')">Save and add another</fwb-list-group-item>
              </fwb-list-group>
            </fwb-dropdown>
          </div>
          <fwb-button
            class="border border-brand-500 hover:border-brand-600 text-brand-500 hover:text-brand-600 rounded-lg hover:bg-transparent"
            outline @click="router.back()">Cancel</fwb-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from '@/stores/data';
import { FwbInput, FwbTextarea, FwbButton, FwbImg, FwbDropdown, FwbListGroup, FwbListGroupItem, FwbAutocomplete, FwbCheckbox, FwbFileInput } from 'flowbite-vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePreferenceStore } from '@/stores/preference';
import angleDownIcon from '@/components/icons/outline/angleDownIcon.vue';
import router from '@/router'
import closeIcon from '@/components/icons/outline/closeIcon.vue'
import noImage from '@/assets/images/no-image.png';

const currentRoute = ref(router.currentRoute)
const data = useDataStore()
const preference = usePreferenceStore()
const routerQuery = ref(router.currentRoute.value.query)
const loading = ref(false)
const error = ref(false)

const deleteImage = (form) => {
  data.params.dataForm.forEach((item) => {
    if (item.field === form.field) {
      item.value = null
    }
  })
}

const imageSrc = (source) => {
  if (!source) return null;

  if (typeof source === 'string') {
    return source;
  }

  if (source instanceof File || source instanceof Blob) {
    return URL.createObjectURL(source);
  }

  return null;
}

const visibleFormFields = computed(() => {
  if (!index.params.formData) return []

  return index.params.formData.filter(item => {
    if (!item.form || item.form.fieldType?.toLowerCase() === 'readonly') return false

    if (typeof item.form.showIf === 'function') {
      const isVisible = item.form.showIf(index.params.formData)

      if (!isVisible) {
        item.form.value = null
      }

      return isVisible
    }

    return true
  })
})

const submit = async(state) => {
  const formData = new FormData();
  error.value = false;
  
  // 1. Validasi Input
  data.params.dataForm.forEach((form) => {
    // HANDLE AUTOCOMPLATE
    if (form.type === 'autocomplete') {
      console.log('FORM = ', form)
      if (form.relativeSelected) {
        console.log('relative selected = ', form.relativeSelected[form.relativeValue])
        form.value = form.relativeSelected[form.relativeValue]
      } else {
        value = ''
      }
    }

    form.error = null;
    // Mengelompokkan kondisi nilai kosong dengan tanda kurung ()
    if (form.required && (form.value === '' || form.value === null)) {
      error.value = true;
      form.error = 'This field cannot be empty';
    }
  });

  if (!error.value) {
    const isCreateMode = currentRoute.value.query.state === 'create';

    // 2. Penyusunan FormData
    data.params.dataForm.forEach((form) => {
      if (form.type !== 'image') {
        // Tipe data non-gambar (teks, angka, dll)
        formData.append(form.field, form.value);
      } else if (form.value instanceof File || (typeof form.value === 'object' && form.value !== null)) {
        // Jika form.value berisi file gambar asli dari input file
        formData.append(form.field, form.value);
      } else if (!isCreateMode && (form.value === '' || form.value === null)) {
        // Sesuai diskusi backend sebelumnya: kirim string kosong untuk hapus gambar di mode UPDATE
        formData.append(form.field, "");
      }
      // Jika mode create dan gambarnya kosong/string url lama, dilewati (tidak di-append)
    });

    // 3. Perubahan dari 'const' menjadi 'let' agar nilainya bisa diisi ulang
    let response = null;

    try {
      if (isCreateMode) {
        response = await data.createData(formData);
      } else {
        response = await data.updateData({
          id: currentRoute.value.query.id,
          data: formData
        });
      }

      console.log('RESPONSE = ', response);

      // 4. Pengecekan Respons & Navigasi Kembali
      // Catatan: Pastikan API backend Anda mengembalikan properti 'status' di dalam objek response
      if (response && (response.status === 200 || response.status === 201 || response.data?.status === true)) {
        if (state === 'saveAndEdit') {
          router.push({
            query: { 
              ...routerQuery,
              state: 'update',
            }
          })
        } else {
          router.replace({// Tetap di halaman/path yang sama
            query: {}         // Mengosongkan seluruh query params
          })
        }
      } else if (response && response.status !== 500) {
        data.error = 'Invalid data input';
      } else {
        data.error = 'Server Error';
      }
    } catch (err) {
      console.error(err);
      data.error = 'Server Error';
    }
  }
}

const search = async (event, model) => {
  loading.value = true
  if (typeof (model) !== 'string') {
    model = model.targetPath || model.field;
  }
  await data.getRelativeOptions({
    query: event,
    model: model
  })
  loading.value = false
}

onMounted(async () => {
  if (routerQuery.value.state === 'update') {
    await data.getData(routerQuery.value.id)
  }
})

onUnmounted(() => {
  data.params.dataForm.forEach((form) => {
    form.value = null
    form.error = null
  })
})
</script>

<style>
.form-input {
  font-size: 14px;
  position: relative;
  padding: 1.5px 0px;
  color: #6A7282;
}

.form-input::file-selector-button {
  color: var(--color-body) !important;
  background: #F3F4F6 !important;
  cursor: pointer !important;
  border: 0 !important;
  margin-inline: -1rem 1rem !important;
  padding: .625rem 1rem .625rem 2rem !important;
  font-size: .875rem !important;
  font-weight: 500 !important;
}

.form-input::file-selector-button:hover {
  background: #f1f1f2;
}
</style>