<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center space-y-4 border-b">
      <AppTitle>{{ typeLabel }} Artigo</AppTitle>
    </div>

    <div class="mt-6 flex flex-col space-y-4">
      
      <AppSelectInput
        v-model:value="categorySelected"
        :items="getCategoriesToSelect"
        keyValue="id"
        keyLabel="title"
        label="Categoria"
        @update:value="setCategory"
        :hasError="formAdminArticle.tried && formAdminArticle.validateInput('categories')"
      >
        Selecione ao menos uma categoria
      </AppSelectInput>

      <div class="w-full flex flex-wrap space-x-2 -mt-4">
        <AppPill bg="bg-zinc-300 relative pr-8" v-for="(category, index) in formAdminArticle.categories" :key="category.id">
          <span>{{ category.title }}</span>
          <AppButton class="absolute top-o right-0 mt-0 mr-0" @click="formAdminArticle.categories.splice(index, 1)">
            <AppIcons icon="close" size="18"/>
          </AppButton>
        </AppPill>
      </div>

      <AppInputWithIcon 
        v-model:value="formAdminArticle.title" 
        label="Título" 
        placeholder="Insira o título do artigo" 
        :hasError="formAdminArticle.tried && formAdminArticle.validateInput('title')"
      >
        Preencha o título
      </AppInputWithIcon>
      
      <AppTextEditorInput 
        input_id="article-editor" 
        v-model:value="formAdminArticle.content" 
        label="Conteúdo do artigo"
        :hasError="formAdminArticle.tried && formAdminArticle.validateInput('content')"
      >
        Preencha o conteúdo
      </AppTextEditorInput>

      <AppSelectInput
        v-model:value="formAdminArticle.userId"
        :items="users"
        keyValue="id"
        keyLabel="name"
        label="Autor"
        :hasError="formAdminArticle.tried && formAdminArticle.validateInput('userId')"
        placeholder="Selecione o autor" 
      >
        Selecione um autor
      </AppSelectInput>

      <AppInputWithIcon 
        v-model:value="formAdminArticle.publishedAt" 
        icon="today"
        label="Data da publicação"
        :mask="'##/##/####'"
        type="tel"
        placeholder="Data da publicação" 
        :hasError="formAdminArticle.tried && formAdminArticle.validateInput('publishedAt')"
      >
        Preencha a data de publicação corretamente
      </AppInputWithIcon>

      <AppCheckBox
        v-model:value="formAdminArticle.isPublished"
      >
        Esta publicado?
      </AppCheckBox>
      
      <AppCheckBox
        v-model:value="formAdminArticle.hidePublishedAt"
      >
        Esconder data
      </AppCheckBox>
      
      <AppCheckBox
        v-model:value="formAdminArticle.hideAuthor"
      >
        Esconder autor
      </AppCheckBox>

      <AppUploadInput 
        placeholder="Clique ou arraste uma imagem de capa"
        v-model="formAdminArticle.file" 
        accept="images/*"
        label="Imagem de capa"
      />

      <div v-if="formAdminArticle.pathUrl" class="w-full flex">
        <AppIcons iconClasses="aspect-ratio h-20" :icon="formAdminArticle.pathUrl" />
      </div>

      <div class="w-full flex">
        <AppButton
          class="bg-brand-gradient text-white px-5"
          @click="updateOrCreate()"
        >
          <AppIcons icon="save" />
          <span  class="ml-1">Salvar</span>
        </AppButton>
      </div>
    </div>

  </div>

</template>

<script setup>

import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
import FormAdminArticle from '@/forms/admin/FormAdminArticle'
import Api from '@/util/Api'
import GraphQL from '@/util/GraphQL'
import { ArrayHelpers } from '@igortrindade/lazyfy'

  const router = useRouter()
  const route = useRoute()
  const formAdminArticle = ref(new FormAdminArticle())
  const users = ref([])
  const categories = ref([])
  const categorySelected = ref(null)
  const { articleId } = route.params
  const typeLabel = computed(() => {
    return articleId ? 'Editar' : 'Adicionar'
  })

  const hasError = computed(() => {
    return !formAdminArticle.value.title || !formAdminArticle.value.content
  })

  const getCategoriesToSelect = computed(() => {
    if(!formAdminArticle.value) return []
    const articleCategoriesIds = formAdminArticle.value.categories.map((category) => category.id)
    return ArrayHelpers.removeAll(categories.value, { id: articleCategoriesIds })
  })

  onMounted(() => {
    getResources()
    if(articleId) getArticle()
  })

  const getArticle = () => {
    const query = `
      {
        articles (
          where: [
            { column: "id", value: "${articleId}" }
          ]
        ) {
          key
          id
          userId
          title
          slug
          content
          pathUrl
          isPublished
          hidePublishedAt
          hideAuthor
          publishedAt
          categories {
            id
            title
          }
        }
      }
    `
    GraphQL({ query, caller: 'AdminArticle' })
      .then(({ data }) => {
        if(data.articles[0]) formAdminArticle.value = new FormAdminArticle(data.articles[0])
      })
  }

  const getResources = () => {
    const query = `
      {
        users {
          id
          name
        }
        categories {
          id
          title
        }
      }
    `
    GraphQL({ query, caller: 'AdminArticle' })
      .then(({ data }) => {
        users.value = data.users
        categories.value = data.categories
      })
  }

  const updateOrCreate = () => {

    if(formAdminArticle.value.hasError) {
      formAdminArticle.value.tried = true
      return
    }
    AdminGeneralApiService.updateOrCreate('Article', { ...formAdminArticle.value }, '/admin/article/updateOrCreate')
      .then((response) => {
        alert('Artigo atualizado com sucesso')
        router.push(`/admin/articles`)
      })
      .catch((err) => {
        alert('Erro ao atualizar artigo')
        console.log(err)
      })
  }

  const setCategory = (id) => {
    const category = ArrayHelpers.find(categories.value, { id })
    if(category) {
      formAdminArticle.value.categories.push(category)
    }
  }
  
</script>
