"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"

type Dictionary = Record<string, any>

interface TranslationContextType {
    dictionary: Dictionary
    lang: string
}

const TranslationContext = createContext<TranslationContextType>({
    dictionary: {},
    lang: "gb"
})

export function TranslationProvider({
    dictionary,
    lang,
    children,
}: {
    dictionary: Dictionary
    lang: string
    children: ReactNode
}) {
    return (
        <TranslationContext.Provider value={{ dictionary, lang }}>
            {children}
        </TranslationContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(TranslationContext)
    return context.dictionary
}

export function useLang() {
    const context = useContext(TranslationContext)
    return context.lang
}
