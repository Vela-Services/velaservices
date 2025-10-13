import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/cart/',
        '/orders/',
        '/payment/',
        '/dashboard/',
        '/onboarding/',
        '/providerFaq/',
        '/providerServices/',
        '/ProviderStripeSetup/',
        '/profile/',
        '/password/',
        '/customerServices/',
        '/unauthorized/',
      ],
    },
    sitemap: 'https://vela-services.netlify.app/sitemap.xml',
  }
}
