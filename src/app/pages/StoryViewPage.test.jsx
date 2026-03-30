import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import StoryViewPage from './StoryViewPage'

function renderStoryViewPage(initialEntry = '/en/stories/us-1') {
  const router = createMemoryRouter(
    [
      { path: '/stories/:storyId', element: <StoryViewPage /> },
      { path: '/:locale/stories/:storyId', element: <StoryViewPage /> },
      { path: '/testimonials/:storyId', element: <StoryViewPage /> },
      { path: '/:locale/testimonials/:storyId', element: <StoryViewPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('StoryViewPage', () => {
  it('renders full story content and localized action links', () => {
    renderStoryViewPage('/en/stories/us-1')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'I Found Courage One Day at a Time',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'storiesPage.detail.bodyTitle' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'storiesPage.detail.backToStories' }),
    ).toHaveAttribute('href', '/en/stories')
    expect(
      screen.getByRole('link', { name: 'storiesPage.detail.relatedActions.resources' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(document.title).toBe('seo.storyDetail.title')
  })

  it('shows not found state for unknown story id', () => {
    renderStoryViewPage('/en/stories/unknown-id')

    expect(screen.getByText('errors.notFound.title')).toBeInTheDocument()
    expect(screen.getByText('errors.notFound.message')).toBeInTheDocument()
  })
})
