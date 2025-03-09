import { basename } from 'path'

export const useLocalApiHandler = process.env.IS_LOCAL === '1'

export const findCover = <T>(nodes: T[], getPath: (node: T) => string) => {
  const allowedExtensions = ['.jpg', '.png']
  const result = nodes.find(it =>
    allowedExtensions.some(extension => basename(getPath(it)) === `cover${extension}`),
  )
  if (!result) {
    return ''
  }
  return basename(getPath(result))
}

export * from './types.js'
