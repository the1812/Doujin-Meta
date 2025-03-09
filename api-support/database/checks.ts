export const checkMutationAllowed = (): boolean => {
  return process.env.IS_LOCAL === '1'
}
