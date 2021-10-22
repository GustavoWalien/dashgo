import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue = []

export const apiAuth = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['dashgo.token']}`
  }
})

apiAuth.interceptors.response.use(response => {
  return response
}, (error: AxiosError) => {
  if (error.response.status === 401) {
    if (error.response.data?.code === 'token.expired') {
      cookies = parseCookies()

      const { 'dashgo.refreshToken': refreshToken } = cookies
      const originalConfig = error.config

      if (!isRefreshing) {
        isRefreshing = true

        apiAuth.post('/refresh', {
          refreshToken,
        }).then(response => {
          const { token } = response.data

          setCookie(undefined, 'dashgo.token', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
          })

          setCookie(undefined, 'dashgo.refreshToken', response.data.refreshToken, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
          })

          apiAuth.defaults.headers['Authorization'] = `Bearer ${token}`

          failedRequestsQueue.forEach(request => request.onSuccess(token))
          failedRequestsQueue = []
        }).catch(err => {
          failedRequestsQueue.forEach(request => request.onFailure(err))
          failedRequestsQueue = []
        }).finally(() => {
          isRefreshing = false
        })        
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers['Authorization'] = `Bearer ${token}`

            resolve(apiAuth(originalConfig))
          },
          onFailure: (err: AxiosError) => {
            reject(err)
          }
        })
      }) 
    } else {
      signOut()
    }
  }

  return Promise.reject(error)
})