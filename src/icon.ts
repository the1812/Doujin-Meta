export const initAppIcon = () => {
  const iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const updateIcon = (isDarkMode: boolean) => {
    iconLink.href = `/images/Logo${isDarkMode ? '.White' : ''}.svg`
  }
  updateIcon(query.matches)
  query.addEventListener('change', (e) => {
    updateIcon(e.matches)
  })
}
