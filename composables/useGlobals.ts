import emitter from '@/util/emitter'
import Api from '@/util/Api'
import { GraphQLInputInterface, default as  GraphQL}  from '@/util/GraphQL'
import Dates from '@/services/Dates'
import config from '@/config'

export const useVueInstance = () => {
  const nuxtApp = useNuxtApp()
  return nuxtApp.vueApp
}

export const useEmitter = () => {
  return emitter
}

export const useApi = () => {
  return Api
}

export const useGraphQL = (payload: GraphQLInputInterface) => {
  return GraphQL(payload)
}

export const useDates = () => {
  return Dates
}

export const useConfig = () => {
  return config[process.env.NODE_ENV]
}

export const useFetchGraphQL = async (payload) => {
  const { query, caller = '' } = payload
  let url = `/graphql/query`
  if(caller) url += `?caller=${caller}`

  const config = useConfig()

  const graphqlUrl = config['API_BASE_URL'] + url

  return $fetch(graphqlUrl, {
    method: 'POST',
    body: { query }
  })
}