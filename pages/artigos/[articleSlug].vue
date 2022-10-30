<template>

  <div class="w-full flex flex-col space-y-6">

    <AppLoaderPlaceholder :quantity="3" v-if="!article"/>

    <AppCard v-else>
      <template v-slot:header>
        <h2 class="h2">{{ article.title }}</h2>
        <p v-if="!article.hideAuthor" >Por: {{ article.user.name }}</p>
        <p v-if="!article.hidePublishedAt" class="text-zinc-400 text-xs">{{ article.publishedAt }}</p>
      </template>
      <template v-slot:content>
        <div class="py-4 leading-loose article-content" v-html="article.content" />

        <div v-if="!article.hideAuthor" class="border-t border-zinc-100 lg:p-12 flex flex-wrap md:flex-nowrap">

          <img class="w-20 h-20 object-cover rounded-full flex-none mt-2" :src="article.user.pathUrl" />

          <div class="w-full pl-0 md:pl-6 flex flex-col">
            <h3 class="font-semibold">{{ article.user.name }}</h3>
            <p class="text-sm">{{ article.user.description }}</p>
          </div>
        </div>

      </template>
    </AppCard>

    <HomeArticleContactCard />

    <div class="w-full border-b border-zinc-200 mt-4"></div>

    <ArticleShowLastArticles />    

  </div>
</template>

<script setup>

  import GraphQL from '@/util/GraphQL'
  import HomeArticleContactCard from '@/modules/app/home/HomeArticleContactCard.vue'
  import ArticleShowLastArticles from '@/modules/app/article/ArticleShowLastArticles.vue'

  const route = useRoute()
  const router = useRouter()
  const article = ref(false)

  const query = `
    {
      articles (
        where: [
          { column: "slug", value: "${route.params.articleSlug}" }
        ]
      ) {
        id
        title
        content
        pathUrl
        publishedAt
        hidePublishedAt
        hideAuthor
        isPublished
        user {
          name
          pathUrl
          description
        }
      }
    }
  
  `

  const { data } = await useFetchGraphQL({ query, caller: 'ShowArticles' })

  if(!data.articles.length) {
    router.push(`/artigos?skip=0&search=${route.params.articleSlug}`)
  }

  article.value = data.articles[0]

  useHead({
    title: article.value.title + " - ",
  })

</script>