// SEO 설정 파일

export const siteConfig = {
  siteName: 'Portfolio | Full-Stack Developer',
  siteUrl: 'https://portfolio-landing.vercel.app',
  defaultTitle: 'Full-Stack Developer Portfolio',
  defaultDescription:
    'React, TypeScript, Supabase를 활용한 모던 웹 애플리케이션 개발. 외주 및 프리랜서 프로젝트를 진행합니다.',
  defaultKeywords: [
    'Full-Stack Developer',
    'React',
    'TypeScript',
    'Next.js',
    'Supabase',
    'TanStack',
    'Web Development',
    '웹 개발',
    '프론트엔드',
    '백엔드',
    '프리랜서',
    '외주 개발',
  ],
  author: {
    name: 'Portfolio Developer',
    email: 'contact@portfolio.dev',
  },
  social: {
    github: 'https://github.com',
  },
  locale: 'ko_KR',
  language: 'ko',
} as const

export type SiteConfig = typeof siteConfig
