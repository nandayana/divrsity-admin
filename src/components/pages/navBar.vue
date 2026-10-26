<template>
  <header class="h-16 flex gap-4 justify-between px-8 items-center border-b bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
		<div class="flex gap-8 items-center">
			<div class="flex justify-center gap-4 items-center w-48">
				<img src="@/assets/logo/brand.png" alt="logo" class="h-10 object-contain">
        <div class="text-xl text-gray-600 dark:text-gray-300">Divrsity</div>
			</div>
			<div>
				<barsIcon class="h-8 text-gray-600 dark:text-gray-400 cursor-pointer" @click="preference.showMenu = !preference.showMenu"/>
			</div>
		</div>
		<div class="flex items-center gap-4">
			<div>
				<bellIcon class="h-8 text-gray-600 dark:text-gray-400" />
			</div>
			<div>
				<fwb-dropdown contentWrapperClass="z-20 absolute -ml-32 w-40" class="cursor-pointer">
					<template #trigger>
						<fwb-avatar  rounded />
					</template>
					<div class="flex flex-col gap-2 p-2">
						<div>Settings</div>
						<div>Log Out</div>
					</div>
				</fwb-dropdown>
			</div>
		</div>
  </header>
</template>

<script setup>
import closeSidebarIcon from '../icons/solid/closeSidebarIcon.vue';
import bellIcon from '../icons/solid/bellIcon.vue';
import searchIcon from '../icons/outline/searchIcon.vue';
import barsIcon from '../icons/solid/barsIcon.vue';
import { FwbAvatar, FwbInput, FwbDropdown } from 'flowbite-vue'
import { usePreferenceStore } from '@/stores/preference.js';

const preference = usePreferenceStore()
</script>