/**
 * Global Site Configuration
 * 
 * Contains brand data, contact information, and social links.
 * Change these values here to update them globally across the application.
 */

export const siteConfig = {
  brand: {
    name: "GLYCH",
    location: "New York, NY",
    tagline: "signal / 017 // new york",
    copyrightYear: new Date().getFullYear(),
  },
  contact: {
    email: "signal@glych.studio",
    phone: {
      display: "+1 (000) 000-0000",
      link: "tel:+10000000000"
    },
    address: "New York, NY — signal / 017"
  },
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X / Twitter", href: "https://twitter.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ]
};
