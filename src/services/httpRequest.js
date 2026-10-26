import axios from 'axios'

const httpRequest = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback)
}

function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback())
  refreshSubscribers = []
}

function onRefreshFailed(error) {
  refreshSubscribers.forEach((callback) => callback(error))
  refreshSubscribers = []
}

// Request interceptor
httpRequest.interceptors.request.use(
  (config) => {

    // Cookie access_token akan otomatis
    // dikirim browser karena withCredentials: true

    return config
  },

  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
httpRequest.interceptors.response.use(

  // Request berhasil
  (response) => {
    return response
  },

  // Request gagal
  async (error) => {

    const originalRequest = error.config

    if (!error.response) {
      return Promise.reject(error)
    }

    // Hanya handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    // Jangan refresh endpoint refresh itu sendiri
    if (
      originalRequest.url?.includes('/api/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    // Jangan retry request yang sama berkali-kali
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // Kalau sedang refresh
    if (isRefreshing) {

      return new Promise((resolve, reject) => {

        subscribeTokenRefresh((refreshError) => {

          if (refreshError) {
            reject(refreshError)
            return
          }

          resolve(
            httpRequest(originalRequest)
          )
        })

      })
    }

    // Mulai refresh
    isRefreshing = true

    try {

      await httpRequest.post(
        '/api/auth/refresh'
      )

      isRefreshing = false

      onRefreshed()

      // Ulangi request sebelumnya
      return httpRequest(originalRequest)

    } catch (refreshError) {

      isRefreshing = false

      onRefreshFailed(refreshError)

      // Refresh gagal → user harus login
      return Promise.reject(refreshError)
    }
  }
)

export default httpRequest