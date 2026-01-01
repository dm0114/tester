import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@portfolio/ui/components/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@portfolio/ui/components/card'
import { ExternalLink, Code, Database, Layout, Github, Mail, ArrowRight, Sparkles } from 'lucide-react'

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
      <section className="relative py-16 md:py-24 mb-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>프리랜서 프로젝트 진행 가능</span>
          </div>

          {/* Greeting */}
          <p className="text-lg md:text-xl text-muted-foreground mb-4">
            안녕하세요, 저는
          </p>

          {/* Name & Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              풀스택 개발자
            </span>
            <br />
            <span className="text-primary">입니다.</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            <strong className="text-foreground">React</strong>, <strong className="text-foreground">TypeScript</strong>, <strong className="text-foreground">Supabase</strong>를 활용해
            <br className="hidden sm:block" />
            사용자 중심의 모던 웹 애플리케이션을 만듭니다.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/contact">
                <Mail className="mr-2 h-5 w-5" />
                프로젝트 문의하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
          </div>

          {/* Tech stack highlight */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['React', 'TypeScript', 'Next.js', 'Supabase', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
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
