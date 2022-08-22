import { showNotification } from '@mantine/notifications'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../services/api'

export type Logout = (redirectTo?: string) => Promise<any>;

export const useLogout = (jwt: string, setJwt: (jwt: string) => void, setLoggedIn: (loggedIn: boolean) => void): Logout => {
  const navigate = useNavigate()

  return useCallback(async (redirectTo?: string) => {
    try {
      return await api.post<string>(`/users/logout`, null, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then(response => {
          setJwt('')
          setLoggedIn(false)
          showNotification({
            title: `You have logged out successfully!`,
            color: 'teal',
            message: '',
          })

          if (redirectTo) {
            navigate(redirectTo)
          }
          return response
        })
    } catch (error) {
      console.log(error)
      showNotification({
        title: `There is an error when logging out!`,
        message: '',
        color: 'red',
      })
      throw error
    }
  }, [jwt])
}
