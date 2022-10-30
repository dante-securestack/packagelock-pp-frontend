<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center">

      <AppTitle>Artigos</AppTitle>

      <AppSearchBar placeholder="Procurar" v-model:search="search" @search="makeSearch()" /> 
      
      <p class="w-full" v-if="getSearch && !articles.length">Não encontramos nenhum artigo com o termo: {{ getSearch }}</p>
      
      <div class="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        
        <AppArticleCard
          v-for="article in articles" :key="article.id"
          :article="article"
        />

      </div>

      <AppPaginator v-model:skip="skip" :take="take" :length="articles.length" @change="navigate()"/>
    
    </div>
  </div>
</template>

<script setup>
import GraphQL from '@/util/GraphQL'
import Api from '@/util/Api'
const route = useRoute()
const router = useRouter()

const categories = ref([])
const articles = ref(false)
const search = ref('')
const take = ref(12)
const skip = ref(route.query.skip ? parseInt(route.query.skip) : 0)

onMounted(() => {
  getCategories()
})

const getSearch = computed(() => {
  return search.value || route.query.search
})


const navigate = () => {
  router.push({ ...route, query: { ...route.query, skip: skip.value }})
    .then(() => {
      getArticles()
    })
}

const makeSearch = () => {
  skip.value = 0
  router.push({ ...route, query: { ...route.query, skip: skip.value, search: search.value }})
    .then(() => {
      getArticles()
    })
}

const getCategories = () => {
  const query = `
    { 
      categories (
        where: [
          { column: "isList", value: "true" }
        ]
      ) {
        id
        title
      }
    
    }
  `
  GraphQL({ query, caller: 'Articles.getCategories' })
    .then(({ data }) => {
      categories.value = data.categories
      getArticles()
    })
}

const getArticles = () => {

  const query = `
    {
      articleAndCategories (
        skip: ${ route.query.skip ? parseInt(route.query.skip) : 0 }
        take: ${take.value}
        order: [
          { column: "articles.publishedAt", direction: "DESC" }
        ]
        ${
          !search.value ? '' :  `
            joinWhere: [
              { table: "articles", column: "title", operation: "ilike", value: "%${search.value}%" }
            ]
          `
        }
        joinWhereIn: [
          { table: "article_to_category", column: "categoryId", value: [${categories.value.map(c => `"${c.id}"`).join(',')}] }
        ]
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
  
  
  GraphQL({ query, caller: 'Articles' })
    .then(({ data }) => {
      articles.value = data.articleAndCategories
      // if(!data.articleAndCategories.length) {
      //   skip.value = 0
      //   navigate()
      // }
    })
}

const clearSearch = () => {
  search.value = ''
  getArticles()  
}

  
</script>