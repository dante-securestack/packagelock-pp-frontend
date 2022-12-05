<template>
  
  <div class="w-full flex flex-col p-10 footer bg-brand-gradient">

    <div class="border-b border-slate-500 flex md:items-center flex-col md:flex-row justify-between pb-8">
      <nuxt-link to="/">
        <img src="/images/logo/1x/LOGO_2_1_1x.png" class="h-14" alt="Logo Calculo e previdência"/>
      </nuxt-link>

      <div class="md:ml-auto md:space-x-4 flex flex-col md:flex-row items-start space-y-4 md:space-y-0">
        <NuxtLink to="/calcule-sua-aposentadoria">
          <AppButton class="sm:block bg-amber-600 text-white rounded-full px-6">
            Calcule sua aposentadoria
          </AppButton>
        </NuxtLink> 

        <AppButton 
          @click="emitter.emit('openContactModal')"
          class="sm:block w-auto bg-amber-600 text-white rounded-full px-6"
        >
          Revisão da Vida Toda
        </AppButton>
      </div>
    </div>

    <div class="border-b border-slate-500 flex flex-wrap justify-between mt-6 text-zinc-200 ">
      <div class="four-cols-breakdown mb-6">
        <h5 class="h5 font-normal">
          <span class="border-b-4 pb-1 border-orange-500">Acesso</span>
        </h5>
        <ul class="space-y-2 mt-6">
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/calcule-sua-aposentadoria">Calcule sua aposentadoria</NuxtLink>
          </li>
          <li>
            <NuxtLink v-if="loggedUser" to="/minhas-simulacoes">Suas simulações</NuxtLink>
            <NuxtLink v-else to="/calcule-sua-aposentadoria">Suas simulações</NuxtLink>
          </li>
          <li class="cursor-pointer" @click="openAuthModal()">Cadastre-se</li>
          <li class="cursor-pointer" @click="openAuthModal()">Login</li>
        </ul>
      </div>
      <div class="four-cols-breakdown mb-6">
        <h5 class="h5 font-normal">
          <span class="border-b-4 pb-1 border-orange-500">Sobre nós</span>
        </h5>
        <ul class="space-y-2 mt-6">
          <li v-for="article in aboutArticles" :key="article.id">
            <NuxtLink  :to="`/artigos/${ article.slug }`">
              {{ article.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="four-cols-breakdown mb-6">
        <h5 class="h5 font-normal">
          <NuxtLink class="border-b-4 pb-1 border-orange-500" to="/artigos">
            Artigos
          </NuxtLink>
        </h5>
        <ul class="space-y-2 mt-6">
          <li v-for="article in footerArticles" :key="article.id">
            <NuxtLink  :to="`/artigos/${ article.slug }`">
              {{ article.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="four-cols-breakdown mb-6">
        <h5 class="h5 font-normal">
          <span class="border-b-4 pb-1 border-orange-500">Fale conosco</span>
        </h5>
        <ul class="space-y-2 mt-6">
          <li class="cursor-pointer" @click="emitter.emit('openContactModal')">Contato</li>
        </ul>
      </div>
    </div>

    <div class="pt-10 flex flex-wrap justify-between space-y-4 text-zinc-400">

      <div class="w-full md:w-1/2 text-center md:text-left">
        <!-- Calculo e Previdência - CNPJ 10.100.100/0001-01 -->
      </div>
      <div class="w-full md:w-1/2 flex justify-center md:justify-end text-zinc-400 space-x-3 items-center">
        <p class="font-thin italic">Developed by</p>
        <a href="https://igortrindade.dev" target="_blank">
          <img src="/images/partners/logo_igortrindade.png" class="h-8" alt="Logo Igor Trindade"/>
        </a>
        <a href="#" target="_blank">
          Digi3
        </a>
      </div>
    </div>
    
  </div>
</template>


<script setup>
  import GraphQL from '@/util/GraphQL'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from "@/modules/auth/store"

  const authStore = useAuthStore()
  const { loggedUser } = storeToRefs(authStore)
  const emitter = useEmitter()

  const footerArticles = ref([])
  const aboutArticles = ref([])

  onMounted(() => {
    getFooterArticles()
    getAboutArticles()
  })

  const getFooterArticles = () => {

    const query = `
      {
        categories (
          where: [
            { column: "slug", value: "footer" }
          ]
        ) {
          id
          title
          articles (
            take: 4
            joinWhere: [
              { column: "isPublished", table: "articles", value: "true" }
            ]
            order: [
              { column: "article_to_category_order", direction: "ASC" }
            ]
          ) {
            id
            title
            slug
            pathUrl
          }
        }
      }
    
    `

    GraphQL({ query, caller: 'HomeArticles' })
      .then(({ data }) => {
        footerArticles.value = data.categories[0].articles
      })
  }

  const getAboutArticles = () => {

    const query = `
      {
        categories (
          where: [
            { column: "slug", value: "sobre" }
          ]
        ) {
          id
          title
          articles (
            take: 4
            joinWhere: [
              { column: "isPublished", table: "articles", value: "true" }
            ]
            order: [
              { column: "article_to_category_order", direction: "ASC" }
            ]
          ) {
            id
            title
            slug
            pathUrl
          }
        }
      }
    
    `

    GraphQL({ query, caller: 'HomeArticles' })
      .then(({ data }) => {
        aboutArticles.value = data.categories[0].articles
      })
  }

  const openAuthModal = () => {
    emitter.emit('openAuthModal')
  }

</script>

<style lang="scss">

  .footer {
    box-shadow: rgba(0, 0, 0, 0.15) 0px -10px 30px -12px;
  }
</style>