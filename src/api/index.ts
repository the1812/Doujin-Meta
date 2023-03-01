import Axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { AlbumApiItem, AlbumDetail } from './types'

export const api = Axios.create({
  responseType: 'json',
})

export const searchAlbums = async (keyword: string) => {
  if (!keyword) {
    return []
  }
  const response = await api.get<AlbumApiItem[]>(`/api/albums/search/${encodeURIComponent(keyword)}`)
  return response.data
}
export const getAlbumDetail = async (name: string, id: string) => {
  const response = await api.get<AlbumDetail>(
    `/api/albums/detail/${encodeURIComponent(name)}/${id}`,
  )
  return response.data
}

export const useApi = (onApiCall: () => Promise<unknown>) => {
  const loaded = ref(false)
  const error = ref(false)
  const loading = computed(() => !loaded.value && !error.value)

  const loadApi = () => {
    loaded.value = false
    error.value = false
    onApiCall()
      .then(() => loaded.value = true)
      .catch(() => error.value = true)
  }

  loadApi()

  return reactive({
    loading,
    loaded,
    error,
    reload: loadApi,
  })
}
