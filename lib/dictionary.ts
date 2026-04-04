import 'server-only'

const dictionaries: any = {
  gb: () => import('@/messages/gb.json').then((module) => module.default),
  fr: () => import('@/messages/fr.json').then((module) => module.default),
  de: () => import('@/messages/de.json').then((module) => module.default),
  pl: () => import('@/messages/pl.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]?.() ?? dictionaries.gb()
}
