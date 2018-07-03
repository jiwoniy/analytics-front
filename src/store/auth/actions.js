import { i18n } from '@/plugins/vue-i18n'

export default {
  setLocale: async ({ commit, state }, locale = 'en_us') => {
    i18n.locale = locale
    commit('SET_LOCALE', locale)
  }
}
