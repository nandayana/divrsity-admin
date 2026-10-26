<template>
  <div :class="{dark: preferences.theme}" class="text-gray-600 dark:text-gray-400">
    <router-view />
  </div>
</template>

<script setup>
import { usePreferenceStore } from './stores/preference';

const preferences = usePreferenceStore()
</script>