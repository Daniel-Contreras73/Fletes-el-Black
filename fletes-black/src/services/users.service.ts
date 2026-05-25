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

export 
