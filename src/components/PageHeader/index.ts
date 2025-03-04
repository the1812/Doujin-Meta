import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const usePageHeader = () => {
  const router = useRouter()
  const keyword = ref('')
  const homeNavigate = () => {
    void router.push({ path: '/', query: { home: 'true' } })
  }
  const search = (newKeyword: string) => {
    void router.push({ path: '/', query: { keyword: newKeyword } })
  }

  return {
    keyword,
    homeNavigate,
    search,
  }
}
