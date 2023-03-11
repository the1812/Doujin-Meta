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
  const response = await api.get<AlbumApiItem[]>(
    `/api/albums/search/${encodeURIComponent(keyword)}`,
  )
  return response.data
}
export const getAlbumDetail = async (name: string) => {
  const response = await api.get<AlbumDetail>(
    `/api/albums/detail/${encodeURIComponent(name)}`,
  )
  return response.data
}

export const useApi = (onApiCall: () => Promise<unknown>) => {
  const loading = ref(false)
  const error = ref(false)
  const loaded = ref(false)

  const sendRequest = async () => {
    try {
      loading.value = true
      loaded.value = false
      error.value = false
      await onApiCall()
      loaded.value = true
    } catch (error) {
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return reactive({
    loading,
    loaded: computed(() => loaded.value && !loading.value && !error.value),
    error,
    sendRequest,
  })
}
