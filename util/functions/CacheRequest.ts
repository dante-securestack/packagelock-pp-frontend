export const getCache = (config: any) => {

  if(!config.shouldCache) return 

  const cacheKey = `${config.url}:${JSON.stringify(config.data)}`
  const hasCache = window.$memoryCache.get(cacheKey)

  if (hasCache) {
    config.adapter = () => {
      return new Promise((resolve) => {
        const res = {
          data: hasCache,
          status: 200,
          statusText: "OK",
          headers: { "content-type": "application/json; charset=utf-8" },
          config: { ...config, cached: true }
        }
    
        return resolve(res)
      })
    }
  }
  
}

export const setCache = (response: any) => {
  if(!response.config.shouldCache) return
  const cacheKey = `${response.config.url}:${response.config.data}`
  window.$memoryCache.put(cacheKey, response.data)
}