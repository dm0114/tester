import { Helmet } from 'react-helmet-async'
import { siteConfig } from './seo-config'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  ogType?: 'website' | 'article' | 'profile'
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image'
  structuredData?: object
}

export function SEO({
  title,
  description = siteConfig.defaultDescription,
  keywords = siteConfig.defaultKeywords,
  canonical,
  noindex = false,
  nofollow = false,
  ogType = 'website',
  ogImage,
  twitterCard = 'summary_large_image',
  structuredData,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.siteName}`
    : siteConfig.siteName

  const canonicalUrl = canonical
    ? `${siteConfig.siteUrl}${canonical}`
    : undefined

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ')

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={siteConfig.author.name} />
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph 메타 태그 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:site_name" content={siteConfig.siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card 메타 태그 */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* 구조화된 데이터 (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  )
}
