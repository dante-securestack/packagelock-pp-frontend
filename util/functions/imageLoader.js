export default ({ imageUrl, onProgress = null, returnsBase64 = true }) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    var notifiedNotComputable = false

    xhr.open('GET', imageUrl, true)
    xhr.withCredentials = false
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = (ev) => {
      if (ev.lengthComputable) {
        let progress = parseInt((ev.loaded / ev.total) * 100)
        if(onProgress) onProgress(progress)
      } else {
        if (!notifiedNotComputable) {
          notifiedNotComputable = true
          if(onProgress) onProgress(-1)
        }
      }
    }

    xhr.onloadend = () => {
      if (!RegExp('(image|application/octet-stream)').test(xhr.getResponseHeader('Content-Type'))) {
        reject(xhr)
      } else {
        if (!notifiedNotComputable) {
          if(onProgress) onProgress(100)
        }

        if(!returnsBase64) {
          resolve()
        } else {
          var options = {}
          var headers = xhr.getAllResponseHeaders()
          var mime = headers.match(/^Content-Type\\:\s*(.*?)$/mi)
          if (mime && mime[1]) options.type = mime[1]
          var blob = new Blob([xhr.response], options)
          resolve(window.URL.createObjectURL(blob))
        }
      }
    }

    xhr.onerror = (err) => {
      reject(err)
    }

    xhr.send()
  })
}