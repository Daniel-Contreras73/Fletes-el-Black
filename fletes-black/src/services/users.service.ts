import api from './api'

export type UserType = 'ADMIN' | 'CLIENT' | 'TRANSPORTER'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: {userType: UserType }
  isActive: boolean
  createdAt: string
}
//FUNCIONES PARA USUARIOS

export const getAllUsers = async (): Promise<User[]> => {
  const {data} = await api.get('/users')
  return data.users
}

export const getUserById = async (id: number): Promise<User> => {
  const {data} = await api.get(`/users/${id}`)
  return data.user
}

// updateRole y deactivateUser pueden ser funciones de administrador, por lo que no se implementan aquí, pero podrían seguir una estructura similar a las anteriores, utilizando api.put o api.patch según corresponda.
export const updateUserRole = async (id: number, newRole: UserType) => {
  const {data} = await api.put(`/users/${id}/role`, { role: newRole })
  return data.user
}

export const desactivateUser = async (id: number) => {
 await api.delete(`/users/${id}`)
}
