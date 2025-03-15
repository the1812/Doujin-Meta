import Axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { AlbumItem, AlbumDetail } from './types'

export const api = Axios.create({
  responseType: 'json',
})

export const searchAlbums = async (keyword: string) => {
  if (!keyword) {
    return []
  }
  const response = await api.get<AlbumItem[]>(
    `/api/albums/search/?${new URLSearchParams({
      keyword,
    }).toString()}`,
  )
  return response.data
}
export const getAlbumDetail = async (id: string) => {
  const response = await api.get<AlbumDetail>(`/api/albums/${id}`)
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
    } catch (e) {
      console.error('request failed', e)
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
