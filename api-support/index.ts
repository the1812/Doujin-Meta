import { basename } from 'path'

export const isDevelopment = process.env.VERCEL_ENV === 'development'

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
