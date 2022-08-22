import React, { ReactChild, useState } from 'react'

import { fetchToken, isTokenExpired } from './apis'
import { Logout, useLogout as useLogoutHook } from './hooks/use-logout'

const JwtContext = React.createContext<{
  // eslint-disable-next-line func-call-spacing
  jwt: [undefined | string, (jwt: string) => void ],
  loggedIn: [boolean, (loggedIn: boolean)=>void ],
  logout: () => Promise<any>
    }>({
      jwt: [
        undefined,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      ],
      loggedIn: [
        false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      ],
      logout: () => Promise.resolve()
    })

export function AuthProvider({ initialState = '', children }: {
  initialState: string
  children: ReactChild
}) {
  const [jwt, setJwtValue] = React.useState(initialState)
  const setJwt = (jwt: string) => {
    setJwtValue(jwt)
    localStorage.setItem('jwt', jwt)
  }
  const [loggedIn, setLoggedIn] = useState(false)
  const logout: Logout = useLogoutHook(jwt, setJwt, setLoggedIn)

  const localJwt = localStorage.getItem('jwt')
  if (!jwt && !localJwt) {
    fetchToken(undefined, setJwt, true, setLoggedIn)
  } else if (!jwt && localJwt && !isTokenExpired(localJwt)) {
    setJwt(localJwt)
    setLoggedIn(true)
  }

  return (<JwtContext.Provider
    value={{
      jwt: [jwt, setJwt],
      loggedIn: [loggedIn, setLoggedIn],
      logout: logout
    }}>
    {children}
  </JwtContext.Provider>)
}

export function useJwt() {
  const { jwt } = React.useContext(JwtContext)
  return jwt
}

export function useLoggedIn() {
  const { loggedIn } = React.useContext(JwtContext)
  return loggedIn
}

export function useLogout(): Logout {
  const { logout } = React.useContext(JwtContext)
  return logout
}
