<template>
  <div class="relative inline-block text-left" v-click-outside="close">

    <!-- <div class="fixed inset-0" v-if="value" @click.stop="close()"></div> -->
    <div @click="open()">
      <slot name="trigger"></slot>
    </div>

    <transition
        enter-active-class="transition ease-out duration-100 transform"
        enter-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-100 transform"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
      <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-sm shadow-lg z-10" v-if="value">
        <div class="rounded-sm bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <slot name="items"></slot>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>

  const { emit } = getCurrentInstance()

  defineEmits(['update:value', 'close', 'open'])

  const props = defineProps({
    value: {
      type: Boolean,
      default: false
    }
  })

  const open = () => {
    emit('update:value', true)
  }

  const close = () => {
    emit('update:value', false)
  }

  defineExpose({ close, open })
  
  watch(() => props.value, (newValue) => {
    if(newValue) {
      emit('open')
      document.addEventListener("keyup", handleEsc)
    } else {
      document.removeEventListener("keyup", handleEsc)
    }
  })

  const handleEsc = (event) => {
    if (props.value && event.keyCode === 27) close()
  }
</script>
