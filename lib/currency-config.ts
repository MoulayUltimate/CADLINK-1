export interface CurrencyInfo {
    currency: string
    symbol: string
    rate: number
    stripeLink: string
    locale: string
}

export const CURRENCY_CONFIG: Record<string, CurrencyInfo> = {
    gb: {
        currency: 'GBP',
        symbol: '£',
        rate: 1.0, // Fixed prices for simplicity or use a conversion rate
        stripeLink: 'https://buy.stripe.com/00w4gy0uffWyelu19h5wI00',
        locale: 'en-GB'
    },
    fr: {
        currency: 'EUR',
        symbol: '€',
        rate: 1.07, // Example: $75.19 -> ~80€ or similar, user-defined prices are better
        stripeLink: 'https://buy.stripe.com/00w4gy0uffWyelu19h5wI00?locale=fr',
        locale: 'fr-FR'
    },
    de: {
        currency: 'EUR',
        symbol: '€',
        rate: 1.07,
        stripeLink: 'https://buy.stripe.com/00w4gy0uffWyelu19h5wI00?locale=de',
        locale: 'de-DE'
    },
    pl: {
        currency: 'PLN',
        symbol: 'zł',
        rate: 3.95,
        stripeLink: 'https://buy.stripe.com/00w4gy0uffWyelu19h5wI00?locale=pl',
        locale: 'pl-PL'
    },
    us: {
        currency: 'USD',
        symbol: '$',
        rate: 1.0,
        stripeLink: 'https://buy.stripe.com/00w4gy0uffWyelu19h5wI00',
        locale: 'en-US'
    }
}

export const DEFAULT_CURRENCY = CURRENCY_CONFIG.us
