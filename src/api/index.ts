import Axios from 'axios'
import { AlbumApiItem, AlbumDetail } from './types'

export const api = Axios.create({
  responseType: 'json',
})

export const searchAlbums = async (keyword: string) => {
  const response = await api.get<AlbumApiItem[]>(`/api/albums/search/${encodeURIComponent(keyword)}`)
  return response.data
}
export const getAlbumDetail = async (name: string, id: string) => {
  const response = await api.get<AlbumDetail>(
    `/api/albums/detail/${encodeURIComponent(name)}/${id}`,
  )
  return response.data
}
