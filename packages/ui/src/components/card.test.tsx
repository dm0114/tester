import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renders card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    render(<Card className="custom-card" data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toHaveClass('custom-card')
  })

  it('renders CardTitle with correct styling', () => {
    render(<CardTitle>My Title</CardTitle>)
    expect(screen.getByText('My Title')).toHaveClass('font-semibold')
  })

  it('renders CardDescription with muted styling', () => {
    render(<CardDescription>My Description</CardDescription>)
    expect(screen.getByText('My Description')).toHaveClass('text-muted-foreground')
  })

  it('composes as HR dashboard card', () => {
    render(
      <Card data-testid="employee-card">
        <CardHeader>
          <CardTitle>Employee Count</CardTitle>
          <CardDescription>Total active employees</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="text-3xl font-bold">1,234</span>
        </CardContent>
      </Card>,
    )

    const card = screen.getByTestId('employee-card')
    expect(card).toHaveClass('rounded-xl', 'border', 'shadow-sm')
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })
})
