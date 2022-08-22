import { Lang } from 'i18n'
import i18n from 'i18n-js'
import React, { ReactChild } from 'react'

// eslint-disable-next-line func-call-spacing
const LanguageContext = React.createContext<[Lang, (lang: Lang) => void]>([
  'en',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
])

export function LanguageProvider({
  initialState = 'en',
  children,
}: {
  initialState: Lang
  children: ReactChild
}) {
  const [lang, setLang] = React.useState(initialState)
  const saveLang = (lang: Lang) => {
    i18n.locale = lang
    window.localStorage.setItem('lang', lang)
    setLang(lang)
  }

  return <LanguageContext.Provider value={[lang, saveLang]}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
