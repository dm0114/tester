import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@portfolio/ui/components/button'
import { Input } from '@portfolio/ui/components/input'
import { Label } from '@portfolio/ui/components/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@portfolio/ui/components/card'
import { useCreateContact } from '@portfolio/api/domains/contact'
import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

const contactSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  subject: z.string().min(5, '제목은 5자 이상이어야 합니다'),
  message: z.string().min(20, '메시지는 20자 이상이어야 합니다'),
})

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const createContact = useCreateContact()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    onSubmit: async ({ value }) => {
      const result = contactSchema.safeParse(value)
      if (!result.success) {
        // Zod 에러를 각 필드에 설정
        for (const error of result.error.errors) {
          const fieldName = error.path[0] as keyof typeof value
          form.setFieldMeta(fieldName, (prev) => ({
            ...prev,
            errors: [error.message],
          }))
        }
        return
      }
      await createContact.mutateAsync(result.data)
      setSubmitted(true)
    },
  })

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Mail className="h-12 w-12 mx-auto text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">문의가 접수되었습니다!</h2>
            <p className="text-muted-foreground">
              빠른 시일 내에 답변 드리겠습니다. 감사합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <CardTitle>문의하기</CardTitle>
          </div>
          <CardDescription>
            프로젝트 관련 문의나 협업 제안을 남겨주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="홍길동"
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="email@example.com"
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="subject">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="subject">제목</Label>
                  <Input
                    id="subject"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="프로젝트 문의"
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="message">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="message">메시지</Label>
                  <textarea
                    id="message"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="프로젝트에 대해 설명해주세요..."
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              className="w-full"
              disabled={createContact.isPending}
            >
              {createContact.isPending ? (
                '전송 중...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  문의 보내기
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
