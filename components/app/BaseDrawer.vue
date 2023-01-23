<template>
  <teleport to="body">
    <transition name="fade">
      <div 
        v-if="showDrawer"
        @click="close()"
        class="w-screen h-screen fixed inset-0 bg-slate-800 bg-opacity-50 z-10"
      ></div>
    </transition>
    <transition
      enter-active-class="translate-x-full"
      enter-class=""
      enter-to-class=""
      leave-active-class=""
      leave-class=""
      leave-to-class="translate-x-full"
      mode="out-in"
    >
      <div 
        v-if="showDrawer" 
        ref="baseDrawer"
        class="base-drawer-dialog transition-all duration-200 easy-in-out transform"
        :class="dialogClasses"
      >
        <button
          @click="close()"
          class="
            absolute
            top-0
            right-0
            text-ash-500
            pr-4
            pt-5
            focus:outline-none
          "
        >
          <AppIcons icon="close" size="32" />
        </button>

        <div class="flex flex-col h-full overflow-y-auto">
          <div class="p-10 mb-24">
            <slot />
          </div>
        </div>

      </div>
    </transition>
  </teleport>
</template>

<script setup>
  
  const emit = defineEmits(['close', 'open'])

  const props = defineProps({
    showDrawer: {
      type: Boolean,
      default: false
    },
    dialogClasses: {
      type: String,
      default: 'w-full lg:w-1/2'
    }
  })

  const close = () => {
    emit('close')
  }

  watch(() => props.showDrawer, (newValue) => {
    if(newValue) {
      emit('open')
      document.addEventListener("keyup", handleEsc)
    } else {
      document.removeEventListener("keyup", handleEsc)
    }
  })

  const handleEsc = (event) => {
    if (props.showDrawer && event.keyCode === 27) close()
  }
    
  
</script>

<style lang="scss">
  .base-drawer-dialog {
    @apply border fixed top-0 right-0 h-screen bg-white shadow-lg flex flex-col z-40 overflow-hidden mt-24
  }
</style>
