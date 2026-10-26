<template>
  <div class="h-screen relative bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
    <div v-if="!preference.menu && preference.showMenu" class="absolute top-16 bottom-0 right-0 left-0 bg-black opacity-25 dark:opacity-50 z-20" @click="preference.showMenu = !preference.showMenu"></div>
    <navBar />
    <sideBar class="z-20" />
    <div :class="preference.menu ? preference.showMenu ? 'left-72' : 'left-0' : 'left-0'" class="m-4 rounded-lg bg-gray-50 dark:bg-gray-800 absolute top-16 bottom-16 right-0 overflow-auto flex flex-col lg:z-20 z-10">
      <!-- <breadCrumb /> -->
      <router-view />
    </div>
    <footBar :class="preference.menu ? preference.showMenu ? 'left-72' : 'left-0' : 'left-0'" />
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/stores/preference';

import navBar from '@/components/pages/navBar.vue';
import sideBar from '@/components/pages/sideBar.vue';
import footBar from '@/components/pages/footBar.vue';
/* import breadCrumb from '../components/pages/admin_layout/breadCrumb.vue'; */

const preference = usePreferenceStore()
</script>