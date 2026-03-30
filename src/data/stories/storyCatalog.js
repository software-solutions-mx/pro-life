import storiesCatalog from './stories.sample.json'

const STORY_CONTEXT_BY_COUNTRY = {
  US: {
    summary:
      'In a season of fear, she found calm support, practical guidance, and space to make an informed next step.',
    body: [
      'At first, everything felt urgent and heavy. I could not think clearly, and every conversation sounded like pressure. What I needed most was a place where I could breathe and process.',
      'When I reached out, I found people who listened before advising. They helped me organize my thoughts, understand my options, and create a plan one small step at a time.',
      'This story, {{title}}, reminds me that courage does not appear all at once. It grows through safe conversations, practical support, and people who treat your dignity as non-negotiable.',
    ],
  },
  MX: {
    summary:
      'En medio del miedo, encontro acompanamiento respetuoso, informacion clara y una ruta practica para su siguiente paso.',
    body: [
      'Al inicio me sentia sola y confundida. Todo parecia urgente y no sabia por donde empezar. Necesitaba una voz tranquila que me ayudara a pensar con claridad.',
      'Recibi escucha sin juicio, informacion ordenada y pasos concretos para avanzar. Poco a poco pude recuperar calma y confianza para decidir con responsabilidad.',
      'Esta historia, {{title}}, me recuerda que la esperanza puede volver cuando hay respeto, verdad y apoyo real en los momentos mas dificiles.',
    ],
  },
  FR: {
    summary:
      'Dans une periode difficile, elle a trouve une ecoute respectueuse, des reperes clairs et des ressources concretes.',
    body: [
      'Au debut, je me sentais depassee et isolee. J avais besoin d un espace sans pression pour comprendre ma situation et poser les bonnes questions.',
      'J ai trouve une equipe qui ecoute avec respect, explique avec clarte et propose des etapes realistes. Cela m a aidee a retrouver de la stabilite et de l espoir.',
      'Cette histoire, {{title}}, montre que la confiance revient quand on avance avec verite, dignite et accompagnement humain.',
    ],
  },
  BR: {
    summary:
      'Em um momento de incerteza, ela encontrou acolhimento, informacao clara e apoio pratico para seguir com seguranca.',
    body: [
      'No comeco, eu estava sobrecarregada e sem direcao. Precisava de um espaco seguro para pensar com calma e sem pressao.',
      'Com escuta atenta e orientacao clara, consegui entender melhor minhas opcoes e montar um plano com passos possiveis para minha realidade.',
      'Esta historia, {{title}}, me lembra que esperanca cresce quando somos tratadas com respeito e recebemos apoio verdadeiro.',
    ],
  },
}

const DEFAULT_STORY_CONTEXT = STORY_CONTEXT_BY_COUNTRY.US

function buildStoryDate(index) {
  const month = String((index % 12) + 1).padStart(2, '0')
  const day = String((index % 27) + 1).padStart(2, '0')
  return `2025-${month}-${day}`
}

function withStoryDetails(story, index) {
  const countryContext =
    STORY_CONTEXT_BY_COUNTRY[story.countryCode] ?? DEFAULT_STORY_CONTEXT
  return {
    ...story,
    summary: countryContext.summary,
    body: countryContext.body.map((paragraph) =>
      paragraph.replace('{{title}}', story.title),
    ),
    readingMinutes: 4 + (index % 4),
    publishedAt: buildStoryDate(index),
  }
}

export const storiesWithDetails = storiesCatalog.stories.map(withStoryDetails)

export function getStoriesByCountry(countryCode) {
  return storiesWithDetails.filter((story) => story.countryCode === countryCode)
}

export function getStoryById(storyId) {
  return storiesWithDetails.find((story) => story.id === storyId) ?? null
}
