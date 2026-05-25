import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllUsers, updateUserRole,desactivateUser } from '@/services/users.service'
import type { User, UserType } from '@/services/users.service'


export const useUsersStore = defineStore('users', () => {
  // Estado
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Acciones
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await getAllUsers()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }
  const changeRole = async (id: number, newRole: UserType) => {
    const update = await updateUserRole(id, newRole)
    users.value = users.value.map((user) => (user.id === id ? update : user))
  }
  const removeUser = async (id: number) => {
    //llamada a funcion de desactivar usuario
    await desactivateUser(id)
    //marcado como desde el array local
    users.value = users.value.map((user) => (user.id === id ? { ...user, isActive: false } : user))
  }

  return { users, loading, error, fetchAll, changeRole, removeUser } // ← fetchAll en el return
})
