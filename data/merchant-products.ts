/**
 * CADLINK product definitions for Google Merchant Center.
 * These map directly to the pricing plans shown on the site.
 */

import type { MerchantProduct } from "@/lib/merchant-api"

const BASE_URL = "https://cadlink.com"
const IMAGE_URL = `${BASE_URL}/icon.webp`

// Google Product Taxonomy ID for physical software (boxed/disc)
// 313 = Software (physical media accepted under this category)
const SOFTWARE_CATEGORY = "313"

export const CADLINK_PRODUCTS: MerchantProduct[] = [
  {
    offerId: "cadlink-v11-starter",
    title: "CADLINK V11 Starter – Sign Making Software",
    description:
      "CADLINK V11 Starter is professional sign making and RIP software for Windows. Single workstation license. Includes core RIP functionality, basic device support, email support, and quarterly updates. Ships as a physical software package.",
    link: `${BASE_URL}/`,
    imageLink: IMAGE_URL,
    contentLanguage: "en",
    targetCountry: "US",
    channel: "online",
    availability: "in stock",
    condition: "new",
    price: { value: "25.00", currency: "USD" },
    brand: "CADLINK",
    googleProductCategory: SOFTWARE_CATEGORY,
    productTypes: ["Software", "Sign Making Software", "RIP Software"],
  },
  {
    offerId: "cadlink-v11-professional",
    title: "CADLINK V11 Professional – Sign Making Software",
    description:
      "CADLINK V11 Professional is advanced sign making and RIP software for Windows. Covers up to 5 workstations with workflow automation, 700+ device support, priority support, monthly updates, and color management tools. Ships as a physical software package.",
    link: `${BASE_URL}/`,
    imageLink: IMAGE_URL,
    contentLanguage: "en",
    targetCountry: "US",
    channel: "online",
    availability: "in stock",
    condition: "new",
    price: { value: "75.19", currency: "USD" },
    brand: "CADLINK",
    googleProductCategory: SOFTWARE_CATEGORY,
    productTypes: ["Software", "Sign Making Software", "RIP Software"],
  },
  {
    offerId: "cadlink-v11-enterprise",
    title: "CADLINK V11 Enterprise – Sign Making Software",
    description:
      "CADLINK V11 Enterprise is industrial-grade sign making and RIP software for Windows. Unlimited workstations, full automation suite, multi-site management, 24/7 dedicated support, custom integrations, and on-site training. Ships as a physical software package.",
    link: `${BASE_URL}/`,
    imageLink: IMAGE_URL,
    contentLanguage: "en",
    targetCountry: "US",
    channel: "online",
    availability: "in stock",
    condition: "new",
    price: { value: "150.00", currency: "USD" },
    brand: "CADLINK",
    googleProductCategory: SOFTWARE_CATEGORY,
    productTypes: ["Software", "Sign Making Software", "RIP Software"],
  },
]
