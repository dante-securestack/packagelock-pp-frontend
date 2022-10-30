<template>
  
  <div class="fixed bottom-0 right-0 mb-12 mr-6 ml-6 z-50">
    <TransitionGroup 
      name="list"
      tag="div"
    >
      <div 
        v-for="(instance, index) in instances"
        :key="instance"
        class="shadow-lg mb-6 flex max-w-screen"
        @click="instances.splice(index, 1)"
        @mouseenter="stopTimeout(instance)"
        @mouseleave="resumeTimeout(instance)"
      >
        <div class="w-3 min-h-full block" :class="[ TYPES_BORDERS[ instance.type ]]"></div>
        <div class="flex flex-col p-6 bg-white">
          <h4 class="w-full font-bold leading-none mb-2" v-if="instance.title">{{instance.title}}</h4>
          <p class="text-center font-semi-bold text-yellow leading-none" v-if="instance.message">{{instance.message}}</p>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>

  import { StringHelpers, ArrayHelpers } from '@igortrindade/lazyfy'
  const emitter = useEmitter()

  const DEFAULT_TIMEOUT = 3000
  const TYPES_BORDERS = ref({
    'warning': 'bg-amber-600',
    'info': 'bg-sky-900',
    'success': 'bg-emerald-700',
    'error': 'bg-red-900',
  })
  const instances = ref([])

  onMounted(() => {
    emitter.on('addToast', ({ title, message, type, timeout }) => {
      addToastInstance({ title, message, type, timeout })
    })
  })

  onBeforeUnmount(() => {
    emitter.off('addToast')
  })

  const addToastInstance = ({ title = '', message = '', type = 'warning', timeout = DEFAULT_TIMEOUT }) => {
    const id = StringHelpers.randomString(64)
    const timeoutId = setTimeout(() => {
      ArrayHelpers.remove(instances.value, { id })
    }, timeout)
    instances.value.unshift({ id, title, message, type, timeout, timeoutId, started: new Date().getTime(), timeRemain: 0 })
  }

  const stopTimeout = (instance) => {
    instance.timeRemain = new Date().getTime() - instance.started
    clearTimeout(instance.timeoutId)
  }

  const resumeTimeout = (instance) => {
    instance.timeoutId = setTimeout(() => {
      ArrayHelpers.remove(instances.value, { id: instance.id })
    }, instance.timeRemain + 100)
  }


  // const addFakeToast = () => {
  //   addToastInstance({ title: 'Title', message: 'someMessage asdasdas dsa das da as das das das dadasas  asas asd as das da' })
  // }

  // if(process.client) document.addEventListener("keyup", addFakeToast)


</script>


<style lang="scss">

  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(20vw);
  }

  /* ensure leaving items are taken out of layout flow so that moving
    animations can be calculated correctly. */
  .list-leave-active {
    position: absolute;
  }
</style>

