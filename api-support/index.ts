import type { VercelResponse } from '@vercel/node'
import Axios, { AxiosResponse } from 'axios'
import { basename } from 'path'
import { ContentsResponse, GitTreeNode } from './types.js'
import childProcess from 'child_process'

export const owner = 'the1812'
export const repo = 'Doujin-Meta'
export const githubHost = 'https://api.github.com'
export const githubApi = Axios.create({
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  },
  responseType: 'json',
})
export const inheritHeaders = (githubResponse: AxiosResponse, vercelResponse: VercelResponse) => {
  Object.entries(githubResponse.headers).forEach(([key, value]) => {
    if (key.toLowerCase().startsWith('x-') && !vercelResponse.hasHeader(key)) {
      vercelResponse.setHeader(key, value)
    }
  })
  return vercelResponse
}

const branch = childProcess.execSync('git branch --show').toString().trim() || 'main'
export const getDataFolder = async () => {
  const ref = branch
  console.log('current ref:', ref)
  const publicTreeApi = `${githubHost}/repos/${owner}/${repo}/contents/public?ref=${ref}`
  const { data: publicContents } = await githubApi.get<ContentsResponse>(publicTreeApi)
  const dataUrl = publicContents.find(it => it.name === 'data')?.git_url
  return dataUrl
}
export const findCover = (nodes: GitTreeNode[]) => {
  const allowedExtensions = ['.jpg', '.png']
  const result = nodes.find(it =>
    allowedExtensions.some(extension => basename(it.path) === `cover${extension}`),
  )
  if (!result) {
    return ''
  }
  return result.path
}

export * from './types.js'
