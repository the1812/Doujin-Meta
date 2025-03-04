const withDarkMode = (updater: (isDarkMode: boolean) => void | Promise<void>) => {
  return () => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    void updater(query.matches)
    query.addEventListener('change', e => {
      void updater(e.matches)
    })
  }
}

export const initAppIcon = withDarkMode(isDarkMode => {
  const iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  iconLink.href = `/images/Logo${isDarkMode ? '.White' : ''}.svg`
})

// export const initAppTheme = withDarkMode(async isDarkMode=> {
//   const styleElement = document.getElementById('theme-styles') as HTMLStyleElement
//   if (isDarkMode) {
//     const { default: style } = await import('primevue/resources/themes/lara-dark-purple/theme.css')
//     styleElement.dataset.theme = 'dark'
//     styleElement.innerHTML = style
//   } else {
//     const { default: style } = await import('primevue/resources/themes/lara-light-indigo/theme.css')
//     styleElement.dataset.theme = 'light'
//     styleElement.innerHTML = style
//   }
// })
