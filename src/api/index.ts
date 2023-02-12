import Axios from 'axios'
import { AlbumApiItem } from './types'

export const api = Axios.create({
  responseType: 'json',
})

export const searchAlbums = async (keyword: string) => {
  const response = await api.get<AlbumApiItem[]>(`/api/albums/search?keyword=${encodeURIComponent(keyword)}`)
}
