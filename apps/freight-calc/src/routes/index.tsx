import { createFileRoute } from '@tanstack/react-router'
import { QuoteForm } from '@/components/quote/QuoteForm'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return <QuoteForm />
}
