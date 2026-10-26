<template>
  <aside :class="preference.showMenu ? 'translate-x-0' : '-translate-x-full'" class="w-72 absolute bg-gray-50 bottom-0 top-16 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 py-2 px-4 left-0 transition-transform duration-300 ease-in-out">
    <div class="flex flex-col justify-between w-full h-full">
      <div class="flex flex-col gap-2 py-2 overflow-auto">
        <div v-for="menu in preference.menus">
          <div v-if="menu.meta.menu" :class="!menu.children?.length && preference.activeMenu.path === menu.identityPath ? 'bg-gray-200 dark:bg-gray-700' : ''" class="flex justify-between gap-2 items-center w-full p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 hover:dark:bg-gray-700 cursor-pointer" @click="menuAction(menu)">
            <div class="flex items-center gap-3">
              <div>
                <component :is="iconMap[menu.meta.menu.icon]" class="h-6 w-6" />
              </div>
              <div>{{ menu.meta.menu.name }}</div>
            </div>
            <div v-if="menu.children?.length">
              <AngleRight class="h-5 w-5 transform transition-transform duration-300 ease-in-out" :class="expandMenus.includes(menu.name) ? 'rotate-90' : 'rotate-0'" />
            </div>
          </div>
          <div :class="menu.children?.length && expandMenus.includes(menu.name) ? 'block' : 'hidden'" class="flex flex-col gap-2 py-2">
            <div v-for="subMenu in menu.children" :key="subMenu.name" :class="menuPath(preference.activeMenu.path) === subMenu.identityPath ? 'bg-brand-200 dark:text-gray-700' : ''" class="flex justify-between gap-2 items-center p-2 ms-8 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-brand-200 hover:dark:text-gray-700 cursor-pointer" @click="subMenuAction(subMenu)">
              <div class="flex items-center gap-3 pl-3">
                <!-- <div>
                  <component :is="iconMap.home" class="h-5 w-5" />
                </div> -->
                <div>{{ subMenu.meta.menu.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 py-2">
        <div class="flex justify-between items-center">
          <div>Theme</div>
          <themeToogle />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref, onBeforeMount } from 'vue';
import { usePreferenceStore } from '../../stores/preference.js';
import router from '../../router/index.js';
import bellIcon from '../icons/solid/bellIcon.vue';
import themeToogle from './themeToogle.vue';
import angleRight from '../icons/outline/angleRightIcon.vue';
import angleDown from '../icons/outline/angleDownIcon.vue';
import AngleRight from '../icons/outline/angleRightIcon.vue';
import chartPieIcon from '../icons/solid/chartPieIcon.vue';
import databaseIcon from '../icons/solid/databseIcon.vue';
import schoolCheckIcon from '../icons/solid/schoolCheckIcon.vue';
import userSettingIcon from '../icons/solid/userSettingIcon.vue';
import filePenIcon from '../icons/solid/filePenIcon.vue';
import userAddIcon from '../icons/solid/userAddIcon.vue';
import bookIcon from '../icons/solid/bookIcon.vue';

const preference = usePreferenceStore()
const expandMenus = ref([])
const currentRoute = ref(router.currentRoute.value)
const iconMap = {
  chartPie: chartPieIcon,
  database: databaseIcon,
  schoolCheck: schoolCheckIcon,
  userSetting: userSettingIcon,
  filePen: filePenIcon,
  userAdd: userAddIcon,
  book: bookIcon
}

const menuPath = (path) => {
  const pathSegments = path.split('/')
  pathSegments.shift()

  return `/${pathSegments.slice(0, 3).join('/')}`
}

const menuAction = (menu) => {
  if (menu.children?.length) {
    if (expandMenus.value.includes(menu.name)) {
      expandMenus.value = expandMenus.value.filter(m => m !== menu.name)
    } else {
      expandMenus.value.push(menu.name)
    }
  } else {
    router.push({ name: menu.name })
    if (!preference.menu) {
      preference.showMenu = false
    }
  }
}

const subMenuAction = (subMenu) => {
  router.push(subMenu.identityPath)
  if (!preference.menu) {
      preference.showMenu = false
    }
}

watch( () => router.currentRoute.value, (newRoute) => {
    currentRoute.value = newRoute
    preference.activeMenu = newRoute
  }
)

onMounted(() => {
  preference.initResizeListener()
})

onUnmounted(() => {
  preference.destroyResizeListener()
})

onBeforeMount(() => {
  if (currentRoute.value.matched.length > 2) {
    expandMenus.value.push(currentRoute.value.matched[1].name)
    preference.activeMenu = currentRoute.value
  } else {
    preference.activeMenu = currentRoute.value
  }
})
</script>