<template>
  <div class="w-full flex flex-col">

    <div class="w-full flex flex-wrap items-center space-y-4 border-b">
      <AppTitle>{{ typeLabel }} Categoria</AppTitle>
    </div>

    <div class="mt-6 flex flex-col space-y-4">
      
      <AppInputWithIcon v-model:value="category.title" label="Título" placeholder="Insira o título da categoria" />
  
      <AppCheckBox
        v-model:value="category.isList"
      >
        É visível? Se sim, será listada nas categorias.
      </AppCheckBox>

      <div class="w-full flex">
        <AppButton 
          :disabled="hasError" 
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

import Category from '@/entities/Category'
import AdminGeneralApiService from '@/services/api/AdminGeneralApiService'
import Api from '@/util/Api'
import GraphQL from '@/util/GraphQL'

  const router = useRouter()
  const route = useRoute()
  const category = ref(new Category())
  const users = ref([])
  const categories = ref([])
  const { type, categoryId } = route.params
  const typeLabel = computed(() => {
    return type == 'edit' ? 'Editar' : 'Adicionar'
  })

  const hasError = computed(() => {
    return !category.value.title
  })

  onMounted(() => {
    if(categoryId) get()
  })

  const get = () => {
    const query = `
      {
        categories (
          where: [
            { column: "id", value: "${categoryId}" }
          ]
        ) {
          key
          id
          title
          isList
        }
      }
    `

    GraphQL({ query, caller: 'AdminCategory' })
      .then(({ data }) => {
        category.value = data.categories[0]
      })
  }

  const updateOrCreate = () => {
    AdminGeneralApiService.updateOrCreate('Category', category.value)
      .then((response) => {
        alert('Categoria atualizada com sucesso')
        router.push(`/admin/categories`)
      })
      .catch((err) => {
        alert('Erro ao atualizar categoria')
        console.log(err)
      })
  }
  
</script>
