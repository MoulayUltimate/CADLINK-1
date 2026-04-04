"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"

type Dictionary = Record<string, any>

const TranslationContext = createContext<Dictionary>({})

export function TranslationProvider({
    dictionary,
    children,
}: {
    dictionary: Dictionary
    children: ReactNode
}) {
    return (
        <TranslationContext.Provider value={dictionary}>
            {children}
        </TranslationContext.Provider>
    )
}

export function useTranslation() {
    const dict = useContext(TranslationContext)
    return dict
}
