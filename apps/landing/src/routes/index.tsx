import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@portfolio/ui/components/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@portfolio/ui/components/card'
import { ExternalLink, Code, Database, Layout } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const projects = [
  {
    title: 'HR System',
    description: '직원 관리, 급여, 휴가 시스템. Supabase + React + TanStack으로 구축.',
    href: 'https://portfolio-hr-admin.vercel.app',
    tags: ['React', 'Supabase', 'TanStack Router'],
    icon: Database,
  },
  {
    title: 'Freight Calculator',
    description: '화물 운임 계산 도구. 다단계 폼과 실시간 계산 기능.',
    href: 'https://portfolio-freight-calc.vercel.app',
    tags: ['React', 'TanStack Form', 'shadcn/ui'],
    icon: Code,
  },
]

const skills = [
  'React / Next.js',
  'TypeScript',
  'TanStack (Router, Query, Form)',
  'Supabase / PostgreSQL',
  'Tailwind CSS / shadcn/ui',
  'Node.js',
]

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Full-Stack Developer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          React, TypeScript, Supabase를 활용한 모던 웹 애플리케이션 개발.
          외주 및 프리랜서 프로젝트를 진행합니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/contact">문의하기</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Skills</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((project) => (
            <Card key={project.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <project.icon className="h-6 w-6 text-primary" />
                  <CardTitle>{project.title}</CardTitle>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    View Demo <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-muted rounded-lg p-8">
        <Layout className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">프로젝트가 필요하신가요?</h2>
        <p className="text-muted-foreground mb-6">
          웹 애플리케이션 개발, 관리자 시스템, API 구축 등 다양한 프로젝트를 진행합니다.
        </p>
        <Button size="lg" asChild>
          <Link to="/contact">견적 문의하기</Link>
        </Button>
      </section>
    </div>
  )
}
