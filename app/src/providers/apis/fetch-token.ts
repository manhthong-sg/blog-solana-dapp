import api from 'services/api'

export interface TokenResponse {
  jwt: string
}

function isTokenExpired(token: string) {
  const expiry = (JSON.parse(atob(token.split('.')[1]))).exp
  return (Math.floor((new Date()).getTime() / 1000)) >= expiry
}

const fetchToken = async (localJwt: string | undefined, setJwt: ((jwt: string) => void), loggedIn: boolean, setLoggedIn: ((loggedIn: boolean) => void)) => {
  if (localJwt && !isTokenExpired(localJwt)) {
    return Promise.resolve(localJwt)
  }

  if (!loggedIn) {
    return
  }

  try {
    return await api.get<TokenResponse>(`/wallets/token`, { withCredentials: true })
      .then(jwtResponse => {
        const { jwt } = jwtResponse
        setLoggedIn(true)
        setJwt(jwt)
        return jwt
      })
      .catch(error => {
        if (error.response?.status === 401) {
          setLoggedIn(false)
        }
      })
  } catch (error) {
    console.log(error)
    throw error
  }
}

export { fetchToken, isTokenExpired }
