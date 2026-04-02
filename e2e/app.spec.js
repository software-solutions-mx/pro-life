import { expect, test } from '@playwright/test'

const MAIN_CONTENT_LABEL_PATTERN =
  /^(contenido principal|main content|contenu principal|conteudo principal)$/i
const HOME_SEO_TITLE_PATTERN =
  /^(Compassionate Support and Resources for Every Life|Voces de Esperanza y Apoyo para Cada Vida|Inicio \| Voices Bringing Hope to Life|Soutien Compatissant et Ressources Fiables|Apoio Compassivo e Recursos Confiaveis)$/i

test('renders base shell with SEO title and main landmark', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(HOME_SEO_TITLE_PATTERN)
  const mainLandmark = page.getByRole('main')
  await expect(mainLandmark).toHaveCount(1)
  await expect(mainLandmark).toHaveAttribute('aria-label', MAIN_CONTENT_LABEL_PATTERN)
})
