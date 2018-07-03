import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: 'en_us',
  fallbackLocale: 'en_us'
})

Vue.i18n = i18n

export default i18n
