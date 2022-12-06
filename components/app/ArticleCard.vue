<template>
  <NuxtLink 
    :to="`/artigos/${ article.slug }`"
    class="border border-zinc-200 hover:shadow-lg"
  >
    <img 
      class="aspect-square w-full object-contains bg-zinc-100"
      :src="article.pathUrl"
    />
    <div class="ml-auto p-4 lg: p-6">
      <div class="w-full flex flex-col">
        <p class="p italic">{{ article.user.name }}</p>
        <p class="p text-xs italic">{{ article.publishedAt }}</p>
      </div>
      <h5 class="h5 leading-relaxed mt-1">{{ article.title }}</h5>
    </div>
  </NuxtLink>

</template>

<script setup>
  
  const props = defineProps({
    article: Object
  })

</script>