const axios = require('axios')

class Axios {
  constructor (baseURL, token) {
    this.refreshingCookieToken = null
    this.cookieCredentialsHeader = ''
    this.instance = axios.create({
      baseURL,
      params: {
        token
      }
    })
    this.beforeRequestInterceptor()
    this.beforeResponseInterceptor()
  }

  getInstance () {
    return this.instance
  }

  beforeRequestInterceptor () {
    this.instance.interceptors.request.use(config => {
      if (config.url !== '/login/autenticar' && this.cookieCredentialsHeader) {
        config.headers.cookie = this.cookieCredentialsHeader
      }
      return config
    })
  }

  beforeResponseInterceptor () {
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        let returnValue = Promise.reject(error)

        const config = error.config
        const responseStatus = error.response.status
        if (responseStatus === 401 && config.url !== '/login/autenticar' && !config._retry) {
          config._retry = true
          try {
            this.refreshingCookieToken = this.refreshingCookieToken || this.instance.post('/login/autenticar')
            const refreshResponse = await this.refreshingCookieToken
            if (refreshResponse.data) {
              this.cookieCredentialsHeader = refreshResponse.headers.get('set-cookie')
            }
            returnValue = this.instance(config)
          } catch {
            // PASS
          } finally {
            this.refreshingCookieToken = null
          }
        }
        return returnValue
      }
    )
  }
}

module.exports = Axios
