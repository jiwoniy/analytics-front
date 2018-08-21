import i18n from '@/plugins/vue-i18n'

export default {
  setLocale: ({ commit, state }, locale = 'en') => {
    i18n.locale = locale
    commit('SET_LOCALE', locale)
  }
}
