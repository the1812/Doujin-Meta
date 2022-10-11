import Axios from 'axios'

export const owner = 'the1812'
export const repo = 'Doujin-Meta'
export const githubApi = Axios.create({
  headers: {
    Accept: 'application/vnd.github+json',
  },
  responseType: 'json',
})
