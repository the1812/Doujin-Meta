import { createI18n, useI18n as useVueI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

export type MessageSchema = typeof zhCN
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
} satisfies Record<string, MessageSchema>

export const useI18n = () => {
  return useVueI18n<{ message: MessageSchema }>()
}
export const i18n = createI18n<[MessageSchema], 'zh-CN' | 'en-US'>({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages,
})
