<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md p-6">
      <h1 class="text-2xl font-bold text-center text-gray-900">
        Login
      </h1>

      <p class="text-sm text-gray-500 text-center mt-2">
        Sign in to your account
      </p>

      <form @submit.prevent="login" class="mt-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>

          <input
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-700 focus:ring-primary-700"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary-700 focus:ring-primary-700"
            required
          />
        </div>

        <p
          v-if="errorMessage"
          class="text-sm text-red-500"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-primary-700 py-2.5 text-sm font-medium text-white hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import router from '@/router';

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

async function login() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.post(
      '/api/auth/login',
      form,
      {
        withCredentials: true
      }
    )

    console.log('LOGIN SUCCESS:', response.data)

    // redirect setelah login
    router.push({ name: 'dashboard' })

  } catch (error) {
    console.error('LOGIN ERROR:', error)

    errorMessage.value =
      error.response?.data?.message ||
      'Failed to login'

  } finally {
    loading.value = false
  }
}
</script>