export const isLocal = (): boolean => {
  return process.env.IS_LOCAL === '1'
}
