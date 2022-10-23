
export default (vueInstance) => {
  
  // Click outside some element
  vueInstance.directive('click-outside', {
    created(el, binding, vnode, prevVnode) {
      el.clickOutsideEvent = function (event) {
        if (!(el == event.target || el.contains(event.target))) {
          if(typeof(binding.value) == 'function') {
            binding.value(event)
          }
        }
      }

      document.body.addEventListener('click', el.clickOutsideEvent)
    },
    beforeUnmount(el, binding, vnode, prevVnode) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
    }
  })
  

}