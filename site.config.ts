import type { SiteConfig } from "@/lib/types";
import { stock } from "@/stock.config";

// SHOWCASE DEMO: Atelier Petale is a fictional Mississauga florist invented for the
// ClaudAura premium kit second showcase. All details are demo placeholders.
// Stock photos via Openverse CC0; footer credits them. Not a real business.

export const site: SiteConfig = {
  name: "Atelier Petale",
  shortName: "Atelier Petale",
  tagline: "Seasonal bouquets and event florals for Mississauga and the west GTA.",
  category: "Florist",
  schemaType: "Florist",
  area: "Mississauga, ON",
  siteUrl: "https://atelierpetale.vercel.app",

  theme: {
    preset: "floral-luxe",
    wordmark: "script",
  },
  motion: { enabled: true, smoothScroll: true, intensity: "subtle", pin: true },

  logo: "/images/logo.png",
  showNameWithLogo: true,

  hero: {
    variant: "editorial",
    depth: true,
    eyebrow: "Mississauga floral studio",
    headline: "Flowers, arranged with care",
    subhead:
      "Seasonal bouquets, wedding florals, and thoughtful arrangements for Mississauga and nearby. Message us on Instagram to enquire about your date.",
    images: [
      { ...stock("openverse-aeb2ae0491.jpg"), alt: "Sunflowers and wildflowers in glass jars on a wooden stool" },
      { ...stock("openverse-6982db0bdd.jpg"), alt: "Hand tied floral arrangement with soft pink blooms" },
      { ...stock("openverse-74b1d0d001.jpg"), alt: "Fresh cut flowers ready for arranging" },
    ],
    secondaryCta: { label: "See our work", href: "#gallery" },
  },

  highlights: ["Seasonal bouquets", "Wedding florals", "Same week when possible", "Pickup in Mississauga", "Orders by Instagram DM"],

  about: {
    title: "A quiet studio for thoughtful florals",
    statement: "We favour seasonal stems, soft colour stories, and arrangements that feel personal rather than mass made.",
    body: [
      "Atelier Petale is a sample Mississauga floral studio built to showcase the ClaudAura premium kit. In a real build we would rewrite this from the florist's own story, posts, and bio.",
      "The look is calm and editorial: ivory, moss, and dusty rose, with room for photography to lead. Message the demo Instagram handle to see how the DM to order flow works.",
    ],
    image: { ...stock("openverse-cafc333fba.jpg"), alt: "Florist flat lay with shears, a garden book, and pink zinnias" },
  },

  menu: {
    label: "Services",
    title: "What we offer",
    intro: "Sample services for this demo site. Real builds use only what the florist posts. Message for a quote on your date and flowers.",
    variant: "list",
    layout: "stacked",
    showPrices: false,
    priceNote: "Demo sample list. Pricing is quoted by DM for your date, stems, and size.",
    groups: [
      {
        title: "Bouquets",
        note: "Wrapped for pickup or gift delivery within Mississauga when available",
        items: [
          { name: "Seasonal wrapped bouquet", description: "A mixed hand tied bunch in the week's best stems.", tag: "Most requested" },
          { name: "Compact vase arrangement", description: "A low, giftable arrangement in a simple vessel." },
          { name: "Grand statement bouquet", description: "Larger scale for anniversaries and celebrations." },
        ],
      },
      {
        title: "Weddings and events",
        note: "Consultations by Instagram DM",
        items: [
          { name: "Bridal bouquet", description: "Designed around your palette and dress.", duration: "Consult" },
          { name: "Bridesmaid bouquets", description: "Matching or complementary smaller bunches." },
          { name: "Ceremony and table florals", description: "Altar pieces, aisle, and guest tables." },
          { name: "Corporate and private events", description: "Welcome arrangements and tablescapes." },
        ],
      },
      {
        title: "Subscriptions",
        items: [
          { name: "Weekly desk blooms", description: "A small fresh bunch for home or office." },
          { name: "Monthly studio subscription", description: "One arrangement a month, seasonal and rotating." },
        ],
      },
    ],
    footnote: "This is a fictional demo florist. Do not place real orders here.",
  },

  gallery: {
    title: "From the studio bench",
    intro: "License free stock used for this showcase. A live build would use the florist's own posts.",
    layout: "strip",
    items: [
      { ...stock("openverse-aeb2ae0491.jpg"), alt: "Sunflowers and wildflowers in jars", caption: "Studio jars" },
      { ...stock("openverse-6982db0bdd.jpg"), alt: "Pink floral arrangement", caption: "Seasonal bunch" },
      { ...stock("openverse-74b1d0d001.jpg"), alt: "Fresh cut flowers", caption: "Cut stems" },
      { ...stock("openverse-b522dbd559.jpg"), alt: "Soft floral still life", caption: "Still life" },
      { ...stock("openverse-da23701d81.jpg"), alt: "Flower arrangement on a table", caption: "Table piece" },
      { ...stock("openverse-6e7d5fad68.jpg"), alt: "Florist workbench flat lay", caption: "Workbench" },
      { ...stock("openverse-b9019770f7.jpg"), alt: "Romantic floral composition", caption: "Soft palette" },
      { ...stock("openverse-52af2a9181.jpg"), alt: "Garden flowers in soft light", caption: "Garden light" },
      { ...stock("openverse-7d59e00fd7.jpg"), alt: "Bouquet detail", caption: "Detail" },
      { ...stock("openverse-5773ebecea.jpg"), alt: "Books and blooms flat lay", caption: "Flat lay" },
      { ...stock("openverse-cafc333fba.jpg"), alt: "Shears and pink zinnias", caption: "Tools and stems" },
    ],
  },

  instagram: { handle: "atelierpetale_demo" },

  order: {
    label: "How to order",
    headerCtaLabel: "DM to order",
    title: "Order by Instagram DM",
    intro: "This is a demo site. The button copies a starter message and opens Instagram so you can see the flow a real florist would use.",
    dmMessage:
      "Hi Atelier Petale! I would like to enquire about flowers.\nOccasion:\nDate needed:\nPickup or delivery (Mississauga area):\nColour preferences:\nBudget range:",
    note: "Demo only. Phone and hours below are placeholders, not a real shop.",
  },

  reviews: { items: [] },

  faq: [
    { q: "Is this a real florist?", a: "No. Atelier Petale is a fictional Mississauga studio built to showcase the ClaudAura premium website kit." },
    { q: "How would ordering work on a real site?", a: "Guests tap DM to order, a starter message is copied, and Instagram opens so they can paste it and finish the details with the florist." },
    { q: "Do you deliver across the GTA?", a: "On a real build we would only list delivery areas the florist confirms. This demo mentions Mississauga and nearby as sample copy." },
    { q: "Can I book a wedding consult?", a: "On a live site, yes, by DM with your date and venue. Here the flow is demonstration only." },
  ],

  contact: {
    title: "Contact",
    area: "Mississauga, Ontario (demo)",
    phone: "(905) 555-0184",
    hours: [
      { days: "Tue to Sat (demo)", time: "10 AM to 6 PM" },
      { days: "Sun and Mon (demo)", time: "Closed" },
    ],
  },

  seo: {
    title: "Atelier Petale | Florist in Mississauga (demo)",
    description:
      "Demo premium florist site for ClaudAura: seasonal bouquets and event florals in Mississauga. Sample studio, not a real business.",
    keywords: ["florist Mississauga", "bouquets Mississauga", "wedding florals GTA", "ClaudAura demo"],
    ogPhoto: "/images/og-photo.jpg",
  },
};
