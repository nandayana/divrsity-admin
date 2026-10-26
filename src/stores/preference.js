import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router/index.js'
import axios from 'axios'
import httpRequest from '../services/httpRequest'

export const usePreferenceStore = defineStore('preference', {
  state: () => ({
    theme: ref(localStorage.getItem('theme') ? localStorage.getItem('theme') === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches),
    windowWidth: window.innerWidth,
    activeMenu: ref(''),
    showMenu: ref(false),
    username: ref(null),
    password: ref(null),
    error: ref(null),
    profile: ref(null)
  }),
  getters: {
    menu: (state) => state.windowWidth >= 1024,
    tabs(state) {
      let tabs = null
      const menus = state.activeMenu.matched[0].children
      const selectedMenu = state.activeMenu.name

      menus.forEach((menu) => {
        menu.children?.forEach((subMenu) => {
          subMenu.children?.forEach((item) => {
            item.isActive = false
            if (item.name === selectedMenu) {
              item.isActive = true
              tabs = subMenu.children
            }
          })
        })
      })
      return tabs
    },
  },
  actions: {
    // Memperbarui data windowWidth di state
    updateWidth() {
      if (this.windowWidth < 1024 && window.innerWidth >= 1024) {
        this.showMenu = true
      } else if (this.windowWidth >= 1024 && window.innerWidth < 1024) {
        this.showMenu = false
      }
      this.windowWidth = window.innerWidth
    },

    // Mengaktifkan pendeteksi resize browser
    initResizeListener() {
      if (window.innerWidth >= 1024) {
        this.showMenu = true
      } else if (window.innerWidth < 1024) {
        this.showMenu = false
      }
      window.addEventListener('resize', this.updateWidth)
    },

    // Membersihkan listener jika diperlukan
    destroyResizeListener() {
      window.removeEventListener('resize', this.updateWidth)
    },

    changeMenuState() {
      this.menu = !this.menu
    },

    async getProfile() {
      try {
        const payload = {
          method: 'GET',
          url: `/api/auth/profile`,
        }

        return await httpRequest.request(payload)
      } catch (error) {
        return null
      }
    }

  }
})
