/**
 * Google Merchant Center Structured Data
 * Uses JSON-LD (application/ld+json) schema to help Google crawl
 * and add CADLINK products to Google Shopping / Merchant Center.
 *
 * Schema types used:
 *  - SoftwareApplication  → for each pricing plan
 *  - Organization         → brand info
 *  - WebSite              → sitelinks search box
 */

const BASE_URL = "https://cadlink.store"

const products = [
  {
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#product-starter`,
    name: "CADLINK V11 – Starter",
    description:
      "Single workstation CAD/RIP license for small sign-making shops. Includes core RIP functionality, basic device support, email support, and quarterly updates.",
    url: `${BASE_URL}/`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Windows",
    softwareVersion: "11",
    offers: {
      "@type": "Offer",
      price: "25.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/`,
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: "CADLINK",
      },
    },
    brand: {
      "@type": "Brand",
      name: "CADLINK",
    },
    image: `${BASE_URL}/icon.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "128",
    },
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#product-professional`,
    name: "CADLINK V11 – Professional",
    description:
      "Up to 5 workstation licenses with advanced workflow automation, 700+ device support, priority support, monthly updates, and color management tools.",
    url: `${BASE_URL}/`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Windows",
    softwareVersion: "11",
    offers: {
      "@type": "Offer",
      price: "75.19",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/`,
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: "CADLINK",
      },
    },
    brand: {
      "@type": "Brand",
      name: "CADLINK",
    },
    image: `${BASE_URL}/icon.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "214",
    },
  },
  {
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#product-enterprise`,
    name: "CADLINK V11 – Enterprise",
    description:
      "Unlimited workstations, full automation suite, multi-site management, 24/7 dedicated support, custom integrations, and on-site training.",
    url: `${BASE_URL}/`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Windows",
    softwareVersion: "11",
    offers: {
      "@type": "Offer",
      price: "150.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/`,
      priceValidUntil: "2026-12-31",
      seller: {
        "@type": "Organization",
        name: "CADLINK",
      },
    },
    brand: {
      "@type": "Brand",
      name: "CADLINK",
    },
    image: `${BASE_URL}/icon.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "87",
    },
  },
]

const organizationSchema = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "CADLINK",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/icon.webp`,
  },
  sameAs: [],
}

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "CADLINK – Professional Sign Making Software",
  description:
    "Industry-leading CAD software for vinyl cutting, sign making, and digital printing.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, websiteSchema, ...products],
}

export function MerchantStructuredData() {
  return (
    <script
      id="merchant-structured-data"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
