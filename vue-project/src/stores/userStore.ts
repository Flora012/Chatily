import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
  profilePicture?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    notifications: [] as any[],
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    getUser: (state): User | null => state.user,
    getNotifications: (state): any[] => state.notifications,
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      try {
        const response = await axios.post('http://localhost:3000/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user

        if (this.token) {
          localStorage.setItem('token', this.token)
        }
        if (this.user?.email) {
          localStorage.setItem('userEmail', this.user.email)
        }
      } catch (error) {
        console.error('Bejelentkezési hiba:', error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.notifications = []
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
    },

    async fetchUserData(): Promise<void> {
      if (!this.token) return
      try {
        const response = await axios.get<User>('http://localhost:3000/user', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch (error) {
        console.error('Nem sikerült lekérni a felhasználói adatokat:', error)
      }
    },

    async fetchNotifications(): Promise<void> {
      if (!this.token) return
      try {
        const response = await axios.get<any[]>('http://localhost:3000/notifications', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.notifications = response.data
      } catch (error) {
        console.error('Nem sikerült lekérni az értesítéseket:', error)
      }
    }
  }
})
