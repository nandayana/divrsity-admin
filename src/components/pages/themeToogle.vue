<template>
  <div class="relative w-12 h-8 rounded-full flex items-center px-0.5 border border-gray-300 bg-gray-200 dark:bg-gray-600 dark:border-gray-500 cursor-pointer transition-colors duration-300" @click="changeTheme()">
    <div class="absolute h-7 w-7 bg-gray-100 dark:bg-gray-800 rounded-full p-1 border border-gray-300 dark:border-gray-500 transform transition-transform duration-300 ease-in-out flex items-center justify-center" :class="preference.theme ? 'translate-x-3.5' : 'translate-x-0'">
      <sunIcon v-if="!preference.theme" class="text-yellow-500 w-full h-full" />
      <moonIcon v-else class="text-yellow-300 w-full h-full" />
    </div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/stores/preference';
import sunIcon from '../icons/solid/sunIcon.vue';
import moonIcon from '../icons/solid/moonIcon.vue';

const preference = usePreferenceStore()

const changeTheme = () => {
  preference.theme = !preference.theme
  localStorage.setItem('theme', preference.theme ? 'dark' : 'light')
}
</script>