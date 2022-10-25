<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center">

      <AppTitle>Artigos</AppTitle>

      <AppSearchBar placeholder="Procurar" v-model:search="search" @search="get()" /> 
      
      <NuxtLink :to="`/admin/articles/create`" class="ml-auto">
        <AppButton class="bg-brand-gradient text-white px-5">
          <AppIcons icon="edit" />
          <span  class="ml-1">Adicionar artigo</span>
        </AppButton>
      </NuxtLink>
    </div>

    <AdminArticleList
      :articles="articles"
    />

    <AppPaginator v-model:skip="skip" :take="take" :length="articles.length" @change="get()"/>
    
  </div>
</template>

<script setup>
import GraphQL from '@/util/GraphQL'
import Api from '@/util/Api'
import AdminArticleList from '@/modules/admin/article/AdminArticleList.vue'

const articles = ref(false)
const search = ref('')
const skip = ref(0)
const take = ref(12)

onMounted(() => {
  get()
})

const get = () => {
  const query = `
    {
      articles (
        skip: ${skip.value}
        take: ${take.value}
        order: [
          { column: "publishedAt", direction: "DESC" }
        ]
        ${
          !search.value ? '' :  `
            where: [
              { column: "title", operation: "ilike", value: "%${search.value}%" }
            ]
          `
        }
      ) {
        key
        id
        slug
        title
        pathUrl
        isPublished
        publishedAt
        createdAt
        updatedAt
        user {
          id
          name
        }
      }
    }
  `
  
  
  GraphQL({ query })
    .then(({ data }) => {
      articles.value = data.articles
      if(!data.articles.length) skip.value = 0
    })

}

  
</script>