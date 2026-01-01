import { siteConfig } from './seo-config'

// Person 구조화 데이터 (개발자 프로필)
export function getPersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.siteUrl,
    sameAs: [siteConfig.social.github],
    jobTitle: 'Full-Stack Developer',
    knowsAbout: [
      'React',
      'TypeScript',
      'Next.js',
      'Supabase',
      'Node.js',
      'PostgreSQL',
      'Tailwind CSS',
    ],
  }
}

// WebSite 구조화 데이터
export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.defaultDescription,
    inLanguage: siteConfig.language,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  }
}

// ProfilePage 구조화 데이터 (홈페이지용)
export function getProfilePageStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: getPersonStructuredData(),
    name: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    url: siteConfig.siteUrl,
  }
}

// ContactPage 구조화 데이터
export function getContactPageStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: '문의하기',
    description: '프로젝트 문의 및 협업 제안',
    url: `${siteConfig.siteUrl}/contact`,
    mainEntity: {
      '@type': 'Person',
      name: siteConfig.author.name,
      email: siteConfig.author.email,
    },
  }
}

// BreadcrumbList 구조화 데이터
export function getBreadcrumbStructuredData(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.path}`,
    })),
  }
}
