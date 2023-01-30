import Api from '@/util/Api'
import{ AxiosRequestConfig } from 'axios'

export interface GraphQLInputInterface extends AxiosRequestConfig {
  query: string
  caller?: string
  shouldCache?: boolean
}
export default async (payload: GraphQLInputInterface) => {

  const { query, caller = '' } = payload
  let url = `/graphql/query`
  if(caller) url += `?caller=${caller}`

  const response = await Api.post(url, {
    query: query
  }, { ...payload })

  return response.data
}