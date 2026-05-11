import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role?.userType === 'ADMIN')
  const isTransporter = computed(() => user.value?.role?.userType === 'TRANSPORTER')
  const isClient = computed(() => user.value?.role?.userType === 'CLIENT')

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    accessToken.value = data.accessToken
    user.value = data.user
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const register = async (payload: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
  }) => {
    const { data } = await api.post('/auth/register', payload)
    accessToken.value = data.accessToken
    user.value = data.user
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }

  const clearSession = () => {
    accessToken.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      clearSession()
    }
  }

  const fetchProfile = async () => {
    const { data } = await api.get('/users/profile')
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isAdmin,
    isTransporter,
    isClient,
    login,
    register,
    logout,
    clearSession,
    fetchProfile
  }
})
