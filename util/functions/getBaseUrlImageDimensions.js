export default (baseUrl) => {
  return new Promise(done => {
    const i = new Image
    i.onload = () => {
      done({ width: i.width, height: i.height })
    }
    i.src = baseUrl
  })
}