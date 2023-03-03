import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const usePageHeader = () => {
  const router = useRouter()
  const keyword = ref('')
  const homeNavigate = () => {
    router.push({ path: '/', query: { home: 'true' } })
  }
  const search = (keyword: string) => {
    router.push({ path: '/', query: { keyword } })
  }

  return {
    keyword,
    homeNavigate,
    search,
  }
}
