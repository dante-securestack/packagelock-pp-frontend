<template>
  <div class="w-full flex flex-wrap justify-between items-center">
    <div class="flex items-center cursor-pointer" @click.stop="toggleCollapse()"> 
      <span 
        class="mr-1 -ml-1 material-icons material-symbols-sharp text-slate-400 flex-none transition-all transform  text-2xl"
        :class="isCollapsed ? 'rotate-90' : 'closed rotate-0'"
      >
        chevron_right
      </span>
      <div class="w-full flex flex-col">
        <slot name="header-left"></slot>
      </div>
    </div>

    <div class="ml-auto flex space-x-2">
      <slot name="header-right"></slot>
    </div>

    <slot name="sub-header"></slot>

    <slot name="content" v-if="isCollapsed"></slot>

  </div>
</template>
<script setup>

  import { useSlots } from "vue"

  const slots = useSlots()

  const isCollapsed = ref(false)

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

</script>