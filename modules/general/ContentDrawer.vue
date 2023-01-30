<template>
  <AppBaseDrawer :showDrawer="showContentDrawer" @close="close">
    
    <AppLoaderPlaceholder v-if="!contentItem" />

    <div class="flex flex-col space-y-6" v-else>

      <h3 class="h3 border-l-10 border-orange-500 pl-6 leading-normal ">
        <span>{{ contentItem.title }}</span>
      </h3>

      <div class="leading-relaxed" v-html="contentItem.content" />

    </div>
  </AppBaseDrawer>
</template>

<script setup>
  
  const emitter = useEmitter()
  const vueInstance = useVueInstance()

  const showContentDrawer = ref(false)
  const contentItem = ref(false)

  onMounted(() => {
    emitter.on('openContentDrawer', ({ table, id }) => {
      getContent({ table, id })
    })
  })

  onBeforeUnmount(() => {
    emitter.off('openContentDrawer')
  })

  const close = () => {
    showContentDrawer.value = false
  }

  const getContent = ({ table, id }) => {
    const query = `
      {
        ${table} (
          where: [
            { column: "id", value: "${id}" }
          ] 
        ) {
          id
          title
          content
        }
      }
    `
    useGraphQL({ query, caller: 'ContentDrawer' })
      .then(({ data }) => {
        contentItem.value = data[table][0]
        showContentDrawer.value = true
      })
  }

</script>
