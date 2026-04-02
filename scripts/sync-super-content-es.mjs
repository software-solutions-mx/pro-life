import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const SUPER_CONTENT_PATH = path.join(root, 'documents/data/super_content_es.json')
const ES_COMMON_PATH = path.join(root, 'public/locales/es/common.json')
const STORIES_DATA_PATH = path.join(root, 'src/data/stories/stories.sample.json')
const RESOURCES_DATA_PATH = path.join(root, 'src/data/resources/resources.sample.json')
const FAQ_ITEMS_PATH = path.join(root, 'src/data/faq/faqItems.js')

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function toSlug(value, fallback) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || fallback
}

function asString(value, fallback = '') {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback
}

function labelFromKey(key) {
  const normalized = String(key ?? '')
    .replace(/[_-]+/g, ' ')
    .trim()

  if (normalized.length === 0) {
    return 'Sin categoría'
  }

  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`
}

function firstCardByHref(cards, hrefIncludes, fallbackIndex = 0) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return null
  }

  const directMatch = cards.find((card) =>
    asString(card?.href).toLowerCase().includes(hrefIncludes.toLowerCase()),
  )

  return directMatch ?? cards[fallbackIndex] ?? null
}

function mapCtaLabel(cta, fallback = '') {
  return asString(cta?.label, fallback)
}

function buildCountriesLookup(superContent) {
  const lookup = new Map()

  const supported = Array.isArray(superContent?.countries?.supported)
    ? superContent.countries.supported
    : []

  for (const country of supported) {
    const code = asString(country?.code).toUpperCase()
    const label = asString(country?.label)
    if (/^[A-Z]{2}$/.test(code) && label) {
      lookup.set(code, label)
    }
  }

  const codeMap = superContent?.countries?.codeMap ?? {}
  for (const [rawCode, rawLabel] of Object.entries(codeMap)) {
    const code = asString(rawCode).toUpperCase()
    const label = asString(rawLabel)
    if (code && label) {
      lookup.set(code, label)
    }
  }

  return lookup
}

function applyCommonTranslations(baseLocale, superContent) {
  const next = JSON.parse(JSON.stringify(baseLocale))

  const homeCards = superContent?.home?.supportPaths?.cards ?? []
  const homeResourceCards = superContent?.home?.resourceSpotlight?.cards ?? []
  const optionPathwayCards = superContent?.optionsPage?.pathwaysGrid?.cards ?? []
  const optionFrameworkCards = superContent?.optionsPage?.frameworkGrid?.cards ?? []
  const aboutValues = superContent?.about?.valuesGrid?.items ?? []
  const aboutTrustItems = superContent?.about?.trustPanel?.items ?? []
  const legalPages = superContent?.legal?.pages ?? {}
  const seoPages = superContent?.seo?.pages ?? {}

  const homeParenting = firstCardByHref(homeCards, '/parenting', 0)
  const homeAdoption = firstCardByHref(homeCards, '/adoption', 1)
  const homeOptions = firstCardByHref(homeCards, '/options', 2)

  const homeLocalHelp = firstCardByHref(homeResourceCards, '/find-local-help', 0)
  const homeHotlines = firstCardByHref(homeResourceCards, '/hotlines', 1)
  const homeSupport = firstCardByHref(homeResourceCards, '/emotional-support', 2)

  const optionContinuing = firstCardByHref(optionPathwayCards, '/options', 0)
  const optionParenting = firstCardByHref(optionPathwayCards, '/parenting', 1)
  const optionAdoption = firstCardByHref(optionPathwayCards, '/adoption', 2)
  const optionAbortion = firstCardByHref(optionPathwayCards, '/faq', 3)

  const aboutDignity =
    aboutValues.find((item) => asString(item?.title).toLowerCase().includes('vida')) ??
    aboutValues[0]
  const aboutClarity =
    aboutValues.find((item) =>
      asString(item?.title).toLowerCase().includes('claridad'),
    ) ?? aboutValues[1]
  const aboutCompassion =
    aboutValues.find((item) => asString(item?.title).toLowerCase().includes('compasi')) ??
    aboutValues[2]
  const aboutConfidentiality =
    aboutValues.find((item) => {
      const title = asString(item?.title).toLowerCase()
      return title.includes('confiden') || title.includes('respeto')
    }) ?? aboutValues[3]

  next.brand.name = asString(superContent?.brand?.name, next.brand.name)
  next.brand.tagline = asString(superContent?.brand?.shortTagline, next.brand.tagline)

  next.navigation.home = asString(superContent?.navigation?.home, next.navigation.home)
  next.navigation.about = asString(superContent?.navigation?.about, next.navigation.about)
  next.navigation.options = asString(
    superContent?.navigation?.options,
    next.navigation.options,
  )
  next.navigation.resources = asString(
    superContent?.navigation?.resources,
    next.navigation.resources,
  )
  next.navigation.stories = asString(
    superContent?.navigation?.stories,
    next.navigation.stories,
  )
  next.navigation.faq = asString(superContent?.navigation?.faq, next.navigation.faq)
  next.navigation.contact = asString(
    superContent?.navigation?.contact,
    next.navigation.contact,
  )
  next.navigation.getHelpNow = asString(
    superContent?.cta?.getHelpNow,
    next.navigation.getHelpNow,
  )
  next.navigation.openMenu = asString(
    superContent?.navigation?.openMenu,
    next.navigation.openMenu,
  )
  next.navigation.closeMenu = asString(
    superContent?.navigation?.closeMenu,
    next.navigation.closeMenu,
  )
  next.navigation.countryLabel = asString(
    superContent?.navigation?.countrySelectorLabel,
    next.navigation.countryLabel,
  )
  next.navigation.languageLabel = asString(
    superContent?.navigation?.languageSelectorLabel,
    next.navigation.languageLabel,
  )

  next.home.hero.eyebrow = asString(
    superContent?.home?.hero?.eyebrow,
    next.home.hero.eyebrow,
  )
  next.home.hero.title = asString(superContent?.home?.hero?.title, next.home.hero.title)
  next.home.hero.description = asString(
    superContent?.home?.hero?.subtitle,
    next.home.hero.description,
  )
  next.home.hero.primaryCta = mapCtaLabel(
    superContent?.home?.hero?.primaryCta,
    next.home.hero.primaryCta,
  )
  next.home.hero.secondaryCta = mapCtaLabel(
    superContent?.home?.hero?.secondaryCta,
    next.home.hero.secondaryCta,
  )
  next.home.hero.trustLine = asString(
    superContent?.home?.hero?.trustLine,
    next.home.hero.trustLine,
  )

  next.home.mission.title = asString(
    superContent?.home?.mission?.title,
    next.home.mission.title,
  )
  next.home.mission.body = asString(
    superContent?.home?.mission?.body,
    next.home.mission.body,
  )

  next.home.paths.title = asString(
    superContent?.home?.supportPaths?.title,
    next.home.paths.title,
  )
  next.home.paths.description = asString(
    superContent?.home?.supportPaths?.description,
    next.home.paths.description,
  )
  next.home.paths.parenting.title = asString(
    homeParenting?.title,
    next.home.paths.parenting.title,
  )
  next.home.paths.parenting.body = asString(
    homeParenting?.description,
    next.home.paths.parenting.body,
  )
  next.home.paths.parenting.cta = asString(
    homeParenting?.ctaLabel,
    next.home.paths.parenting.cta,
  )
  next.home.paths.adoption.title = asString(
    homeAdoption?.title,
    next.home.paths.adoption.title,
  )
  next.home.paths.adoption.body = asString(
    homeAdoption?.description,
    next.home.paths.adoption.body,
  )
  next.home.paths.adoption.cta = asString(
    homeAdoption?.ctaLabel,
    next.home.paths.adoption.cta,
  )
  next.home.paths.options.title = asString(
    homeOptions?.title,
    next.home.paths.options.title,
  )
  next.home.paths.options.body = asString(
    homeOptions?.description,
    next.home.paths.options.body,
  )
  next.home.paths.options.cta = asString(
    homeOptions?.ctaLabel,
    next.home.paths.options.cta,
  )

  next.home.resources.title = asString(
    superContent?.home?.resourceSpotlight?.title,
    next.home.resources.title,
  )
  next.home.resources.description = asString(
    superContent?.home?.resourceSpotlight?.description,
    next.home.resources.description,
  )
  next.home.resources.localHelp.title = asString(
    homeLocalHelp?.title,
    next.home.resources.localHelp.title,
  )
  next.home.resources.localHelp.body = asString(
    homeLocalHelp?.description,
    next.home.resources.localHelp.body,
  )
  next.home.resources.localHelp.cta = asString(
    homeLocalHelp?.ctaLabel,
    next.home.resources.localHelp.cta,
  )
  next.home.resources.hotlines.title = asString(
    homeHotlines?.title,
    next.home.resources.hotlines.title,
  )
  next.home.resources.hotlines.body = asString(
    homeHotlines?.description,
    next.home.resources.hotlines.body,
  )
  next.home.resources.hotlines.cta = asString(
    homeHotlines?.ctaLabel,
    next.home.resources.hotlines.cta,
  )
  next.home.resources.support.title = asString(
    homeSupport?.title,
    next.home.resources.support.title,
  )
  next.home.resources.support.body = asString(
    homeSupport?.description,
    next.home.resources.support.body,
  )
  next.home.resources.support.cta = asString(
    homeSupport?.ctaLabel,
    next.home.resources.support.cta,
  )

  next.home.faq.title = asString(
    superContent?.home?.faqPreview?.title,
    next.home.faq.title,
  )
  next.home.faq.description = asString(
    superContent?.home?.faqPreview?.description,
    next.home.faq.description,
  )
  const homeFaqItems = superContent?.home?.faqPreview?.items ?? []
  next.home.faq.items.q1 = asString(homeFaqItems[0]?.question, next.home.faq.items.q1)
  next.home.faq.items.q2 = asString(homeFaqItems[1]?.question, next.home.faq.items.q2)
  next.home.faq.items.q3 = asString(homeFaqItems[2]?.question, next.home.faq.items.q3)
  next.home.faq.cta = asString(
    superContent?.home?.faqPreview?.ctaLabel,
    next.home.faq.cta,
  )

  next.home.finalCta.title = asString(
    superContent?.home?.finalCta?.title,
    next.home.finalCta.title,
  )
  next.home.finalCta.body = asString(
    superContent?.home?.finalCta?.body,
    next.home.finalCta.body,
  )
  next.home.finalCta.cta = mapCtaLabel(
    superContent?.home?.finalCta?.primaryCta,
    next.home.finalCta.cta,
  )

  next.footer.missionTitle = asString(
    superContent?.footer?.missionBlockTitle,
    next.footer.missionTitle,
  )
  next.footer.missionText = asString(
    superContent?.footer?.missionBlockBody,
    next.footer.missionText,
  )
  next.footer.quickLinksTitle = asString(
    superContent?.footer?.quickLinksTitle,
    next.footer.quickLinksTitle,
  )
  next.footer.legalTitle = asString(
    superContent?.footer?.legalLinksTitle,
    next.footer.legalTitle,
  )
  next.footer.helpTitle = asString(superContent?.footer?.helpTitle, next.footer.helpTitle)
  next.footer.helpText = asString(superContent?.footer?.helpBody, next.footer.helpText)
  next.footer.disclaimer = asString(
    superContent?.footer?.disclaimer,
    next.footer.disclaimer,
  )
  next.footer.copyright = asString(
    superContent?.brand?.copyright,
    next.footer.copyright,
  ).replace('©', 'Copyright')

  next.errors.general.title = asString(
    superContent?.errors?.error?.title,
    next.errors.general.title,
  )
  next.errors.general.message = asString(
    superContent?.errors?.error?.body,
    next.errors.general.message,
  )
  next.errors.loading.title = asString(
    superContent?.errors?.loading?.title,
    next.errors.loading.title,
  )
  next.errors.loading.message = asString(
    superContent?.errors?.loading?.body,
    next.errors.loading.message,
  )
  next.errors.notFound.title = asString(
    superContent?.errors?.notFound?.title,
    next.errors.notFound.title,
  )
  next.errors.notFound.message = asString(
    superContent?.errors?.notFound?.body,
    next.errors.notFound.message,
  )
  next.errors.server.title = asString(
    superContent?.errors?.serverError?.title,
    next.errors.server.title,
  )
  next.errors.server.message = asString(
    superContent?.errors?.serverError?.body,
    next.errors.server.message,
  )
  next.errors.actions.retry = mapCtaLabel(
    superContent?.errors?.serverError?.primaryCta,
    next.errors.actions.retry,
  )
  next.errors.actions.backToHome = mapCtaLabel(
    superContent?.errors?.notFound?.primaryCta,
    next.errors.actions.backToHome,
  )

  next.states.empty.title = asString(
    superContent?.errors?.empty?.title,
    next.states.empty.title,
  )
  next.states.empty.message = asString(
    superContent?.errors?.empty?.body,
    next.states.empty.message,
  )

  next.seo.defaults.title = asString(
    superContent?.seo?.defaultTitle,
    next.seo.defaults.title,
  )
  next.seo.defaults.description = asString(
    superContent?.seo?.defaultDescription,
    next.seo.defaults.description,
  )
  next.seo.home.title = asString(seoPages?.home?.title, next.seo.home.title)
  next.seo.home.description = asString(
    seoPages?.home?.description,
    next.seo.home.description,
  )
  next.seo.about.title = asString(seoPages?.about?.title, next.seo.about.title)
  next.seo.about.description = asString(
    seoPages?.about?.description,
    next.seo.about.description,
  )
  next.seo.options.title = asString(seoPages?.options?.title, next.seo.options.title)
  next.seo.options.description = asString(
    seoPages?.options?.description,
    next.seo.options.description,
  )
  next.seo.resources.title = asString(
    seoPages?.resources?.title,
    next.seo.resources.title,
  )
  next.seo.resources.description = asString(
    seoPages?.resources?.description,
    next.seo.resources.description,
  )
  next.seo.stories.title = asString(seoPages?.stories?.title, next.seo.stories.title)
  next.seo.stories.description = asString(
    seoPages?.stories?.description,
    next.seo.stories.description,
  )
  next.seo.faq.title = asString(seoPages?.faq?.title, next.seo.faq.title)
  next.seo.faq.description = asString(
    seoPages?.faq?.description,
    next.seo.faq.description,
  )
  next.seo.contact.title = asString(seoPages?.contact?.title, next.seo.contact.title)
  next.seo.contact.description = asString(
    seoPages?.contact?.description,
    next.seo.contact.description,
  )

  next.about.hero.eyebrow = asString(
    superContent?.about?.hero?.eyebrow,
    next.about.hero.eyebrow,
  )
  next.about.hero.title = asString(
    superContent?.about?.hero?.title,
    next.about.hero.title,
  )
  next.about.hero.description = asString(
    superContent?.about?.hero?.subtitle,
    next.about.hero.description,
  )
  next.about.hero.primaryCta = mapCtaLabel(
    superContent?.about?.hero?.primaryCta,
    next.about.hero.primaryCta,
  )
  next.about.hero.secondaryCta = mapCtaLabel(
    superContent?.about?.hero?.secondaryCta,
    next.about.hero.secondaryCta,
  )

  next.about.mission.title = asString(
    superContent?.about?.missionVisionCards?.[0]?.title,
    next.about.mission.title,
  )
  next.about.mission.body = asString(
    superContent?.about?.missionVisionCards?.[0]?.body,
    next.about.mission.body,
  )
  next.about.vision.title = asString(
    superContent?.about?.missionVisionCards?.[1]?.title,
    next.about.vision.title,
  )
  next.about.vision.body = asString(
    superContent?.about?.missionVisionCards?.[1]?.body,
    next.about.vision.body,
  )

  next.about.values.title = asString(
    superContent?.about?.valuesGrid?.title,
    next.about.values.title,
  )
  next.about.values.description = asString(
    superContent?.about?.hero?.subheadline,
    next.about.values.description,
  )

  next.about.values.items.dignity.title = asString(
    aboutDignity?.title,
    next.about.values.items.dignity.title,
  )
  next.about.values.items.dignity.body = asString(
    aboutDignity?.body,
    next.about.values.items.dignity.body,
  )
  next.about.values.items.clarity.title = asString(
    aboutClarity?.title,
    next.about.values.items.clarity.title,
  )
  next.about.values.items.clarity.body = asString(
    aboutClarity?.body,
    next.about.values.items.clarity.body,
  )
  next.about.values.items.compassion.title = asString(
    aboutCompassion?.title,
    next.about.values.items.compassion.title,
  )
  next.about.values.items.compassion.body = asString(
    aboutCompassion?.body,
    next.about.values.items.compassion.body,
  )
  next.about.values.items.confidentiality.title = asString(
    aboutConfidentiality?.title,
    next.about.values.items.confidentiality.title,
  )
  next.about.values.items.confidentiality.body = asString(
    aboutConfidentiality?.body,
    next.about.values.items.confidentiality.body,
  )

  next.about.story.title = asString(
    superContent?.about?.storyPanel?.title,
    next.about.story.title,
  )
  next.about.story.bodyOne = asString(
    superContent?.about?.storyPanel?.body,
    next.about.story.bodyOne,
  )
  next.about.story.bodyTwo = asString(
    superContent?.about?.storyPanel?.quote,
    next.about.story.bodyTwo,
  )
  next.about.story.cta = asString(superContent?.cta?.contactUs, next.about.story.cta)

  next.about.trust.title = asString(
    superContent?.about?.trustPanel?.title,
    next.about.trust.title,
  )
  next.about.trust.description = asString(
    superContent?.about?.trustPanel?.subtitle,
    next.about.trust.description,
  )
  next.about.trust.items.confidentialCare.title = asString(
    aboutTrustItems[0]?.title,
    next.about.trust.items.confidentialCare.title,
  )
  next.about.trust.items.confidentialCare.body = asString(
    aboutTrustItems[0]?.description,
    next.about.trust.items.confidentialCare.body,
  )
  next.about.trust.items.practicalResources.title = asString(
    aboutTrustItems[1]?.title,
    next.about.trust.items.practicalResources.title,
  )
  next.about.trust.items.practicalResources.body = asString(
    aboutTrustItems[1]?.description,
    next.about.trust.items.practicalResources.body,
  )
  next.about.trust.items.transparentInformation.title = asString(
    aboutTrustItems[2]?.title,
    next.about.trust.items.transparentInformation.title,
  )
  next.about.trust.items.transparentInformation.body = asString(
    aboutTrustItems[2]?.description,
    next.about.trust.items.transparentInformation.body,
  )

  next.about.closing.title = asString(
    superContent?.about?.closingCta?.title,
    next.about.closing.title,
  )
  next.about.closing.body = asString(
    superContent?.about?.closingCta?.subtitle,
    next.about.closing.body,
  )
  next.about.closing.cta = asString(
    superContent?.about?.closingCta?.ctaPrimary,
    next.about.closing.cta,
  )

  next.optionsPage.hero.eyebrow = asString(
    superContent?.optionsPage?.hero?.eyebrow,
    next.optionsPage.hero.eyebrow,
  )
  next.optionsPage.hero.title = asString(
    superContent?.optionsPage?.hero?.title,
    next.optionsPage.hero.title,
  )
  next.optionsPage.hero.description = asString(
    superContent?.optionsPage?.hero?.subtitle,
    next.optionsPage.hero.description,
  )
  next.optionsPage.hero.primaryCta = mapCtaLabel(
    superContent?.optionsPage?.hero?.primaryCta,
    next.optionsPage.hero.primaryCta,
  )
  next.optionsPage.hero.secondaryCta = mapCtaLabel(
    superContent?.optionsPage?.hero?.secondaryCta,
    next.optionsPage.hero.secondaryCta,
  )

  const optionCountryLegendLabel = asString(
    superContent?.optionsPage?.hero?.countryLegendLabel,
    '',
  )
  if (optionCountryLegendLabel) {
    next.optionsPage.countryLoadingLegend = `${optionCountryLegendLabel} {{country}}`
    next.optionsPage.countrySummary = `${optionCountryLegendLabel} {{country}}`
  }

  next.optionsPage.orientation.title = asString(
    superContent?.optionsPage?.orientation?.title,
    next.optionsPage.orientation.title,
  )
  next.optionsPage.orientation.bodyOne = asString(
    superContent?.optionsPage?.orientation?.body,
    next.optionsPage.orientation.bodyOne,
  )
  next.optionsPage.orientation.bodyTwo = asString(
    superContent?.optionsPage?.orientation?.note,
    next.optionsPage.orientation.bodyTwo,
  )

  next.optionsPage.pathways.title = asString(
    superContent?.optionsPage?.pathwaysGrid?.title,
    next.optionsPage.pathways.title,
  )
  next.optionsPage.pathways.description = asString(
    superContent?.optionsPage?.orientation?.body,
    next.optionsPage.pathways.description,
  )

  next.optionsPage.pathways.items.continuingPregnancy.title = asString(
    optionContinuing?.title,
    next.optionsPage.pathways.items.continuingPregnancy.title,
  )
  next.optionsPage.pathways.items.continuingPregnancy.body = asString(
    optionContinuing?.description,
    next.optionsPage.pathways.items.continuingPregnancy.body,
  )
  next.optionsPage.pathways.items.continuingPregnancy.cta = asString(
    optionContinuing?.ctaLabel,
    next.optionsPage.pathways.items.continuingPregnancy.cta,
  )

  next.optionsPage.pathways.items.parenting.title = asString(
    optionParenting?.title,
    next.optionsPage.pathways.items.parenting.title,
  )
  next.optionsPage.pathways.items.parenting.body = asString(
    optionParenting?.description,
    next.optionsPage.pathways.items.parenting.body,
  )
  next.optionsPage.pathways.items.parenting.cta = asString(
    optionParenting?.ctaLabel,
    next.optionsPage.pathways.items.parenting.cta,
  )

  next.optionsPage.pathways.items.adoption.title = asString(
    optionAdoption?.title,
    next.optionsPage.pathways.items.adoption.title,
  )
  next.optionsPage.pathways.items.adoption.body = asString(
    optionAdoption?.description,
    next.optionsPage.pathways.items.adoption.body,
  )
  next.optionsPage.pathways.items.adoption.cta = asString(
    optionAdoption?.ctaLabel,
    next.optionsPage.pathways.items.adoption.cta,
  )

  next.optionsPage.pathways.items.understandingAbortion.title = asString(
    optionAbortion?.title,
    next.optionsPage.pathways.items.understandingAbortion.title,
  )
  next.optionsPage.pathways.items.understandingAbortion.body = asString(
    optionAbortion?.description,
    next.optionsPage.pathways.items.understandingAbortion.body,
  )
  next.optionsPage.pathways.items.understandingAbortion.cta = asString(
    optionAbortion?.ctaLabel,
    next.optionsPage.pathways.items.understandingAbortion.cta,
  )

  next.optionsPage.framework.title = asString(
    superContent?.optionsPage?.frameworkGrid?.title,
    next.optionsPage.framework.title,
  )
  next.optionsPage.framework.description = asString(
    superContent?.optionsPage?.hero?.subheadline,
    next.optionsPage.framework.description,
  )
  next.optionsPage.framework.items.biologicalFacts.title = asString(
    optionFrameworkCards[0]?.title,
    next.optionsPage.framework.items.biologicalFacts.title,
  )
  next.optionsPage.framework.items.biologicalFacts.body = asString(
    optionFrameworkCards[0]?.body,
    next.optionsPage.framework.items.biologicalFacts.body,
  )
  next.optionsPage.framework.items.ethicalPerspective.title = asString(
    optionFrameworkCards[1]?.title,
    next.optionsPage.framework.items.ethicalPerspective.title,
  )
  next.optionsPage.framework.items.ethicalPerspective.body = asString(
    optionFrameworkCards[1]?.body,
    next.optionsPage.framework.items.ethicalPerspective.body,
  )
  next.optionsPage.framework.items.faithBeliefs.title = asString(
    optionFrameworkCards[2]?.title,
    next.optionsPage.framework.items.faithBeliefs.title,
  )
  next.optionsPage.framework.items.faithBeliefs.body = asString(
    optionFrameworkCards[2]?.body,
    next.optionsPage.framework.items.faithBeliefs.body,
  )

  next.optionsPage.commitments.title = asString(
    superContent?.optionsPage?.commitmentsPanel?.title,
    next.optionsPage.commitments.title,
  )
  next.optionsPage.commitments.description = asString(
    superContent?.optionsPage?.commitmentsExtended?.[0]?.title,
    next.optionsPage.commitments.description,
  )
  next.optionsPage.commitments.items.nonJudgment = asString(
    superContent?.optionsPage?.commitmentsExtended?.[0]?.description,
    next.optionsPage.commitments.items.nonJudgment,
  )
  next.optionsPage.commitments.items.confidentiality = asString(
    superContent?.optionsPage?.commitmentsExtended?.[1]?.description,
    next.optionsPage.commitments.items.confidentiality,
  )
  next.optionsPage.commitments.items.medicalNotice = asString(
    superContent?.optionsPage?.commitmentsExtended?.[2]?.description,
    next.optionsPage.commitments.items.medicalNotice,
  )

  next.optionsPage.closing.title = asString(
    superContent?.optionsPage?.closingCta?.title,
    next.optionsPage.closing.title,
  )
  next.optionsPage.closing.body = asString(
    superContent?.optionsPage?.closingCta?.body,
    next.optionsPage.closing.body,
  )
  next.optionsPage.closing.primaryCta = mapCtaLabel(
    superContent?.optionsPage?.closingCta?.primaryCta,
    next.optionsPage.closing.primaryCta,
  )
  next.optionsPage.closing.secondaryCta = mapCtaLabel(
    superContent?.optionsPage?.closingCta?.secondaryCta,
    next.optionsPage.closing.secondaryCta,
  )

  next.resourcesPage.hero.eyebrow = asString(
    superContent?.resourcesPage?.hero?.eyebrow,
    next.resourcesPage.hero.eyebrow,
  )
  next.resourcesPage.hero.title = asString(
    superContent?.resourcesPage?.hero?.title,
    next.resourcesPage.hero.title,
  )
  next.resourcesPage.hero.description = asString(
    superContent?.resourcesPage?.hero?.subtitle,
    next.resourcesPage.hero.description,
  )
  next.resourcesPage.hero.primaryCta = mapCtaLabel(
    superContent?.resourcesPage?.hero?.primaryCta,
    next.resourcesPage.hero.primaryCta,
  )
  next.resourcesPage.hero.secondaryCta = mapCtaLabel(
    superContent?.resourcesPage?.hero?.secondaryCta,
    next.resourcesPage.hero.secondaryCta,
  )

  const resourcesCountryLegendLabel = asString(
    superContent?.resourcesPage?.hero?.countryLegendLabel,
    '',
  )
  if (resourcesCountryLegendLabel) {
    next.resourcesPage.countryLoadingLegend = `${resourcesCountryLegendLabel} {{country}}`
    next.resourcesPage.countrySummary = `${resourcesCountryLegendLabel} {{country}}`
  }

  next.resourcesPage.gallery.title = asString(
    superContent?.resourcesPage?.gallery?.title,
    next.resourcesPage.gallery.title,
  )
  next.resourcesPage.gallery.description = asString(
    superContent?.resourcesPage?.intro?.body,
    next.resourcesPage.gallery.description,
  )
  next.resourcesPage.empty = asString(
    superContent?.resourcesPage?.gallery?.noResults,
    next.resourcesPage.empty,
  )
  next.resourcesPage.actions.visitWebsite = asString(
    superContent?.resourcesPage?.gallery?.actionLabel,
    next.resourcesPage.actions.visitWebsite,
  )
  next.resourcesPage.closing.title = asString(
    superContent?.resourcesPage?.closingCta?.title,
    next.resourcesPage.closing.title,
  )
  next.resourcesPage.closing.body = asString(
    superContent?.resourcesPage?.closingCta?.body,
    next.resourcesPage.closing.body,
  )
  next.resourcesPage.closing.cta = mapCtaLabel(
    superContent?.resourcesPage?.closingCta?.primaryCta,
    next.resourcesPage.closing.cta,
  )

  next.storiesPage.hero.eyebrow = asString(
    superContent?.storiesPage?.hero?.eyebrow,
    next.storiesPage.hero.eyebrow,
  )
  next.storiesPage.hero.title = asString(
    superContent?.storiesPage?.hero?.title,
    next.storiesPage.hero.title,
  )
  next.storiesPage.hero.description = asString(
    superContent?.storiesPage?.hero?.subtitle,
    next.storiesPage.hero.description,
  )
  next.storiesPage.hero.primaryCta = mapCtaLabel(
    superContent?.storiesPage?.hero?.primaryCta,
    next.storiesPage.hero.primaryCta,
  )
  next.storiesPage.hero.secondaryCta = mapCtaLabel(
    superContent?.storiesPage?.hero?.secondaryCta,
    next.storiesPage.hero.secondaryCta,
  )

  const storiesCountryLegendLabel = asString(
    superContent?.storiesPage?.hero?.countryNoteLabel,
    '',
  )
  if (storiesCountryLegendLabel) {
    next.storiesPage.countrySummary = `${storiesCountryLegendLabel} {{country}}`
  }

  next.storiesPage.gallery.title = asString(
    superContent?.storiesPage?.gallery?.title,
    next.storiesPage.gallery.title,
  )
  next.storiesPage.gallery.description = asString(
    superContent?.storiesPage?.gallery?.description,
    next.storiesPage.gallery.description,
  )
  next.storiesPage.gallery.readStoryCta = asString(
    superContent?.storiesPage?.gallery?.readFullStoryLabel,
    next.storiesPage.gallery.readStoryCta,
  )
  next.storiesPage.empty = asString(
    superContent?.storiesPage?.gallery?.noResults,
    next.storiesPage.empty,
  )

  next.storiesPage.submit.title = asString(
    superContent?.storiesPage?.submissionExperience?.title,
    next.storiesPage.submit.title,
  )
  next.storiesPage.submit.description = asString(
    superContent?.storiesPage?.submissionExperience?.description,
    next.storiesPage.submit.description,
  )
  next.storiesPage.submit.countryNote = 'Mostrando formulario para {{country}}.'
  next.storiesPage.submit.status.success = asString(
    superContent?.forms?.storySubmission?.success?.message,
    next.storiesPage.submit.status.success,
  )
  next.storiesPage.submit.status.error = asString(
    superContent?.forms?.storySubmission?.error?.message,
    next.storiesPage.submit.status.error,
  )

  next.storiesPage.submit.form.fields.title.label = asString(
    superContent?.forms?.storySubmission?.fields?.title?.label,
    next.storiesPage.submit.form.fields.title.label,
  )
  next.storiesPage.submit.form.fields.authorName.label = asString(
    superContent?.forms?.storySubmission?.fields?.author?.label,
    next.storiesPage.submit.form.fields.authorName.label,
  )
  next.storiesPage.submit.form.fields.email.label = asString(
    superContent?.forms?.storySubmission?.fields?.email?.label,
    next.storiesPage.submit.form.fields.email.label,
  )
  next.storiesPage.submit.form.fields.publicationPreference.label = asString(
    superContent?.forms?.storySubmission?.fields?.publicationPreference?.label,
    next.storiesPage.submit.form.fields.publicationPreference.label,
  )
  next.storiesPage.submit.form.fields.storyBody.label = asString(
    superContent?.forms?.storySubmission?.fields?.storyBody?.label,
    next.storiesPage.submit.form.fields.storyBody.label,
  )
  next.storiesPage.submit.form.fields.allowFollowUp.label =
    'Acepto recibir seguimiento por correo si es necesario.'
  next.storiesPage.submit.form.fields.consentAccepted.label = asString(
    superContent?.forms?.storySubmission?.fields?.consent?.label,
    next.storiesPage.submit.form.fields.consentAccepted.label,
  )

  next.storiesPage.submit.form.publicationOptions.anonymous = asString(
    superContent?.forms?.storySubmission?.fields?.publicationPreference?.options
      ?.anonymous,
    next.storiesPage.submit.form.publicationOptions.anonymous,
  )
  next.storiesPage.submit.form.publicationOptions.firstName = asString(
    superContent?.forms?.storySubmission?.fields?.publicationPreference?.options
      ?.first_name_only,
    next.storiesPage.submit.form.publicationOptions.firstName,
  )
  next.storiesPage.submit.form.publicationOptions.initials = 'Publicar con iniciales'

  next.storiesPage.submit.form.characterCount = 'Caracteres: {{count}}'

  next.storiesPage.submit.form.errors.title = asString(
    superContent?.forms?.storySubmission?.validation?.required,
    next.storiesPage.submit.form.errors.title,
  )
  next.storiesPage.submit.form.errors.authorName = asString(
    superContent?.forms?.storySubmission?.validation?.required,
    next.storiesPage.submit.form.errors.authorName,
  )
  next.storiesPage.submit.form.errors.email = asString(
    superContent?.forms?.storySubmission?.validation?.emailInvalid,
    next.storiesPage.submit.form.errors.email,
  )
  next.storiesPage.submit.form.errors.storyBody = asString(
    superContent?.forms?.storySubmission?.validation?.minStoryLength,
    next.storiesPage.submit.form.errors.storyBody,
  )
  next.storiesPage.submit.form.errors.consentAccepted = asString(
    superContent?.forms?.storySubmission?.validation?.consentRequired,
    next.storiesPage.submit.form.errors.consentAccepted,
  )
  next.storiesPage.submit.form.disclaimer = asString(
    superContent?.storiesPage?.submissionExperience?.consentHelp,
    next.storiesPage.submit.form.disclaimer,
  )
  next.storiesPage.submit.form.submit.idle = asString(
    superContent?.storiesPage?.submissionExperience?.form?.submitButton,
    next.storiesPage.submit.form.submit.idle,
  )
  next.storiesPage.submit.form.submit.pending = 'Enviando historia...'

  next.storiesPage.submit.preview.eyebrow = asString(
    superContent?.storiesPage?.submissionExperience?.previewTitle,
    next.storiesPage.submit.preview.eyebrow,
  )
  next.storiesPage.submit.preview.titleFallback = asString(
    superContent?.storiesPage?.submissionExperience?.form?.titlePlaceholder,
    next.storiesPage.submit.preview.titleFallback,
  )
  next.storiesPage.submit.preview.bodyFallback = asString(
    superContent?.storiesPage?.submissionExperience?.form?.storyPlaceholder,
    next.storiesPage.submit.preview.bodyFallback,
  )
  next.storiesPage.submit.preview.authorAnonymous = asString(
    next.storiesPage.submit.form.publicationOptions.anonymous,
    next.storiesPage.submit.preview.authorAnonymous,
  )
  next.storiesPage.submit.preview.authorFallback = 'Autora por confirmar'
  next.storiesPage.submit.preview.initialsFallback = 'A.'
  next.storiesPage.submit.preview.meta =
    'País: {{country}} · Publicación: {{publication}}'

  next.storiesPage.detail.eyebrow = 'Historia completa'
  next.storiesPage.detail.backToStories = asString(
    superContent?.storiesPage?.detailPage?.backLabel,
    next.storiesPage.detail.backToStories,
  )
  next.storiesPage.detail.bodyTitle = 'Relato'
  next.storiesPage.detail.meta.authorLabel = asString(
    superContent?.storiesPage?.detailPage?.metadataLabels?.author,
    next.storiesPage.detail.meta.authorLabel,
  )
  next.storiesPage.detail.meta.countryLabel = asString(
    superContent?.storiesPage?.detailPage?.metadataLabels?.country,
    next.storiesPage.detail.meta.countryLabel,
  )
  next.storiesPage.detail.meta.publishedLabel = asString(
    superContent?.storiesPage?.detailPage?.metadataLabels?.date,
    next.storiesPage.detail.meta.publishedLabel,
  )
  next.storiesPage.detail.meta.readTimeLabel = asString(
    superContent?.storiesPage?.detailPage?.metadataLabels?.readTime,
    next.storiesPage.detail.meta.readTimeLabel,
  )
  next.storiesPage.detail.meta.readTimeValue = '{{minutes}} min'
  next.storiesPage.detail.relatedActions.title = asString(
    superContent?.storyDetailPage?.relatedActions?.title,
    next.storiesPage.detail.relatedActions.title,
  )
  next.storiesPage.detail.relatedActions.resources = asString(
    superContent?.storyDetailPage?.relatedActionsAlt?.resources,
    next.storiesPage.detail.relatedActions.resources,
  )
  next.storiesPage.detail.relatedActions.contact = asString(
    superContent?.storyDetailPage?.relatedActionsAlt?.contact,
    next.storiesPage.detail.relatedActions.contact,
  )
  next.storiesPage.detail.relatedActions.allStories = asString(
    superContent?.storyDetailPage?.relatedActionsAlt?.allStories,
    next.storiesPage.detail.relatedActions.allStories,
  )

  next.contactPage.hero.eyebrow = asString(
    superContent?.contactPage?.hero?.eyebrow,
    next.contactPage.hero.eyebrow,
  )
  next.contactPage.hero.title = asString(
    superContent?.contactPage?.hero?.title,
    next.contactPage.hero.title,
  )
  next.contactPage.hero.description = asString(
    superContent?.contactPage?.hero?.subtitle,
    next.contactPage.hero.description,
  )
  next.contactPage.hero.primaryCta = mapCtaLabel(
    superContent?.contactPage?.hero?.primaryCta,
    next.contactPage.hero.primaryCta,
  )
  next.contactPage.hero.secondaryCta = mapCtaLabel(
    superContent?.contactPage?.hero?.secondaryCta,
    next.contactPage.hero.secondaryCta,
  )
  const contactCountryLegendLabel = asString(
    superContent?.contactPage?.hero?.countryLegendLabel,
    '',
  )
  if (contactCountryLegendLabel) {
    next.contactPage.hero.countryLegend = `${contactCountryLegendLabel} {{country}}`
  }

  next.contactPage.form.title = asString(
    superContent?.contactPage?.formSection?.title,
    next.contactPage.form.title,
  )
  next.contactPage.form.description = asString(
    superContent?.contactPage?.formSection?.description,
    next.contactPage.form.description,
  )
  next.contactPage.form.fields.name.label = asString(
    superContent?.forms?.contactForm?.fields?.name?.label,
    next.contactPage.form.fields.name.label,
  )
  next.contactPage.form.fields.email.label = asString(
    superContent?.forms?.contactForm?.fields?.email?.label,
    next.contactPage.form.fields.email.label,
  )
  next.contactPage.form.fields.phone.label = asString(
    superContent?.forms?.contactForm?.fields?.phone?.label,
    next.contactPage.form.fields.phone.label,
  )
  next.contactPage.form.fields.reason.label = asString(
    superContent?.forms?.contactForm?.fields?.reason?.label,
    next.contactPage.form.fields.reason.label,
  )
  next.contactPage.form.fields.message.label = asString(
    superContent?.forms?.contactForm?.fields?.message?.label,
    next.contactPage.form.fields.message.label,
  )

  next.contactPage.form.reasons.help = asString(
    superContent?.forms?.contactForm?.fields?.reason?.options?.pregnancy_help,
    next.contactPage.form.reasons.help,
  )
  next.contactPage.form.reasons.general = asString(
    superContent?.forms?.contactForm?.fields?.reason?.options?.resources,
    next.contactPage.form.reasons.general,
  )
  next.contactPage.form.reasons.media = asString(
    superContent?.forms?.contactForm?.fields?.reason?.options?.media,
    next.contactPage.form.reasons.media,
  )
  next.contactPage.form.reasons.partner = 'Alianzas y colaboraciones'

  next.contactPage.form.errors.name = asString(
    superContent?.forms?.contactForm?.validation?.required,
    next.contactPage.form.errors.name,
  )
  next.contactPage.form.errors.email = asString(
    superContent?.forms?.contactForm?.validation?.emailInvalid,
    next.contactPage.form.errors.email,
  )
  next.contactPage.form.errors.phone = asString(
    superContent?.forms?.contactForm?.validation?.required,
    next.contactPage.form.errors.phone,
  )
  next.contactPage.form.errors.message = asString(
    superContent?.forms?.contactForm?.validation?.messageTooShort,
    next.contactPage.form.errors.message,
  )
  next.contactPage.form.disclaimer = asString(
    superContent?.contactPage?.formSection?.description,
    next.contactPage.form.disclaimer,
  )
  next.contactPage.form.submit.idle = 'Enviar mensaje'
  next.contactPage.form.submit.pending = 'Enviando mensaje...'
  next.contactPage.form.status.success = asString(
    superContent?.forms?.contactForm?.success?.message,
    next.contactPage.form.status.success,
  )
  next.contactPage.form.status.error = asString(
    superContent?.forms?.contactForm?.error?.message,
    next.contactPage.form.status.error,
  )

  next.contactPage.support.title = asString(
    superContent?.contactPage?.supportAside?.title,
    next.contactPage.support.title,
  )
  next.contactPage.support.description = asString(
    superContent?.contactPage?.supportAside?.body,
    next.contactPage.support.description,
  )
  next.contactPage.support.responseTimeLabel = asString(
    superContent?.contactPage?.supportAside?.responseWindowTitle,
    next.contactPage.support.responseTimeLabel,
  )
  next.contactPage.support.responseTimeValue = asString(
    superContent?.contactPage?.supportAside?.responseWindowBody,
    next.contactPage.support.responseTimeValue,
  )
  next.contactPage.support.hotlineCta = asString(
    superContent?.contactPage?.supportAside?.actions?.[0]?.label,
    next.contactPage.support.hotlineCta,
  )
  next.contactPage.support.storyCta = asString(
    superContent?.contactPage?.supportAside?.actions?.[1]?.label,
    next.contactPage.support.storyCta,
  )
  next.contactPage.support.storyConsent = asString(
    superContent?.contactPage?.supportAside?.confidentialityNote,
    next.contactPage.support.storyConsent,
  )

  next.faqPage.hero.eyebrow = asString(
    superContent?.faqPage?.hero?.eyebrow,
    next.faqPage.hero.eyebrow,
  )
  next.faqPage.hero.title = asString(
    superContent?.faqPage?.hero?.title,
    next.faqPage.hero.title,
  )
  next.faqPage.hero.description = asString(
    superContent?.faqPage?.hero?.subtitle,
    next.faqPage.hero.description,
  )
  next.faqPage.search.label = asString(
    superContent?.faqPage?.hero?.categoryLabel,
    next.faqPage.search.label,
  )
  next.faqPage.search.placeholder = asString(
    superContent?.faqPage?.hero?.searchPlaceholder,
    next.faqPage.search.placeholder,
  )
  next.faqPage.search.surprise = asString(
    superContent?.faqPage?.hero?.surpriseQuestionLabel,
    next.faqPage.search.surprise,
  )
  next.faqPage.filters.label = asString(
    superContent?.faqPage?.hero?.categoryLabel,
    next.faqPage.filters.label,
  )
  next.faqPage.metrics.questionsLabel = asString(
    superContent?.faqPage?.hero?.metricsLabels?.totalQuestions,
    next.faqPage.metrics.questionsLabel,
  )
  next.faqPage.metrics.questionsValue = '{{count}}'
  next.faqPage.metrics.countryLabel = asString(
    superContent?.faqPage?.hero?.metricsLabels?.countryContext,
    next.faqPage.metrics.countryLabel,
  )
  next.faqPage.metrics.countryValue = 'País: {{country}}'

  next.faqPage.questionRail.title = asString(
    superContent?.faqPage?.questionRail?.title,
    next.faqPage.questionRail.title,
  )
  next.faqPage.questionRail.description = asString(
    superContent?.faqPage?.hero?.subheadline,
    next.faqPage.questionRail.description,
  )

  next.faqPage.answer.eyebrow = asString(
    superContent?.faqPage?.answerStage?.title,
    next.faqPage.answer.eyebrow,
  )
  next.faqPage.answer.note = asString(
    superContent?.faqPage?.answerStage?.contextPrefix,
    next.faqPage.answer.note,
  )
  next.faqPage.answer.actionsTitle = asString(
    superContent?.faqPage?.answerStage?.actionsTitle,
    next.faqPage.answer.actionsTitle,
  )

  next.faqPage.empty.title = asString(
    superContent?.faqPage?.emptyState?.title,
    next.faqPage.empty.title,
  )
  next.faqPage.empty.description = asString(
    superContent?.faqPage?.emptyState?.body,
    next.faqPage.empty.description,
  )
  next.faqPage.empty.reset = 'Restablecer filtros'

  const faqCategoryAlias = {
    biology: 'vida_y_biologia',
    biologia_y_ciencia: 'vida_y_biologia',
    science: 'vida_y_biologia',
    'body-autonomy': 'argumentos_comunes',
    autonomia_corporal: 'argumentos_comunes',
    womensRights: 'mujer_y_apoyo',
    ethics: 'etica_y_dignidad',
    'hard-cases': 'casos_dificiles',
    woman: 'mujer_y_apoyo',
    faith: 'fe_y_conciencia',
    religion: 'fe_y_conciencia',
    post_abortion: 'post_aborto',
    options: 'adopcion_y_crianza',
    practical: 'sitio_y_recursos',
    support: 'sitio_y_recursos',
    apoyo_practico: 'sitio_y_recursos',
    society: 'presion_y_entorno',
  }

  const faqCategoryLabelMap = new Map()
  const preferredFaqCategoryOrder = []

  const registerFaqCategory = (rawId, rawLabel) => {
    const normalizedRaw = asString(rawId)
    if (!normalizedRaw) {
      return
    }
    const aliasTarget = faqCategoryAlias[normalizedRaw] ?? normalizedRaw
    if (!preferredFaqCategoryOrder.includes(aliasTarget)) {
      preferredFaqCategoryOrder.push(aliasTarget)
    }
    const label = asString(rawLabel)
    if (label && !faqCategoryLabelMap.has(aliasTarget)) {
      faqCategoryLabelMap.set(aliasTarget, label)
    }
  }

  registerFaqCategory('all', 'Todas')

  for (const category of superContent?.faqPage?.questionRail?.categories ?? []) {
    registerFaqCategory(category?.id, category?.label)
  }

  for (const category of superContent?.faqPage?.categories ?? []) {
    registerFaqCategory(category?.id, category?.label)
  }

  const faqItems = []
  const faqItemTranslations = {}
  const faqItemIdUsage = new Set()

  for (const [index, item] of (superContent?.data?.faq ?? []).entries()) {
    const baseId = toSlug(item?.id ?? item?.question, `faq-${index + 1}`)
    let uniqueId = baseId
    let duplicateIndex = 2
    while (faqItemIdUsage.has(uniqueId)) {
      uniqueId = `${baseId}-${duplicateIndex}`
      duplicateIndex += 1
    }
    faqItemIdUsage.add(uniqueId)

    const rawCategory = asString(item?.category, 'sitio_y_recursos')
    const category = faqCategoryAlias[rawCategory] ?? rawCategory

    registerFaqCategory(category, item?.categoryLabel)

    const question = asString(item?.question, 'Pregunta pendiente')
    const answerParts = [asString(item?.answer), asString(item?.contextNote)].filter(
      Boolean,
    )
    const answer = answerParts.join(' ')
    const keywords = [
      asString(item?.categoryLabel),
      category,
      ...(Array.isArray(item?.tags) ? item.tags.map((tag) => asString(tag)) : []),
    ]
      .filter(Boolean)
      .join(', ')

    faqItems.push({ id: uniqueId, category })
    faqItemTranslations[uniqueId] = {
      question,
      answer,
      keywords,
    }
  }

  const orderedFaqCategories = ['all']

  for (const key of preferredFaqCategoryOrder) {
    if (key !== 'all' && !orderedFaqCategories.includes(key)) {
      orderedFaqCategories.push(key)
    }
  }

  for (const item of faqItems) {
    if (!orderedFaqCategories.includes(item.category)) {
      orderedFaqCategories.push(item.category)
    }
  }

  next.faqPage.categories = {}
  for (const categoryKey of orderedFaqCategories) {
    next.faqPage.categories[categoryKey] =
      faqCategoryLabelMap.get(categoryKey) ?? labelFromKey(categoryKey)
  }
  next.faqPage.items = faqItemTranslations

  const countriesLookup = buildCountriesLookup(superContent)
  const mergedCountryEntries = {
    ...next.countries,
  }
  for (const [countryCode, countryLabel] of countriesLookup.entries()) {
    mergedCountryEntries[countryCode] = countryLabel
  }
  next.countries = mergedCountryEntries

  next.legal.privacy = asString(legalPages?.privacyPolicy?.title, next.legal.privacy)
  next.legal.terms = asString(legalPages?.termsOfUse?.title, next.legal.terms)
  next.legal.disclaimer = asString(legalPages?.disclaimer?.title, next.legal.disclaimer)
  next.legal.medical = asString(legalPages?.medicalDisclaimer?.title, next.legal.medical)
  next.legal.crisis = asString(
    legalPages?.mentalHealthCrisisDisclaimer?.title,
    next.legal.crisis,
  )
  next.legal.cookies = asString(legalPages?.cookiePolicy?.title, next.legal.cookies)

  const legalPageKeyMap = {
    privacy: 'privacyPolicy',
    terms: 'termsOfUse',
    disclaimer: 'disclaimer',
    medical: 'medicalDisclaimer',
    crisis: 'mentalHealthCrisisDisclaimer',
    cookies: 'cookiePolicy',
  }

  const generatedAt = asString(superContent?.siteMetadata?.generatedAt, '2026-03-30')

  for (const [targetKey, sourceKey] of Object.entries(legalPageKeyMap)) {
    const sourcePage = legalPages?.[sourceKey]
    if (!sourcePage) {
      continue
    }

    next.legalPages[targetKey].intro = asString(
      sourcePage?.summary,
      next.legalPages[targetKey].intro,
    )
    next.legalPages[targetKey].updatedValue = generatedAt
    next.legalPages[targetKey].sectionsTitle = 'Puntos clave'

    const sourceSections = Array.isArray(sourcePage?.sections) ? sourcePage.sections : []
    const sectionKeys = ['one', 'two', 'three']

    for (const [index, sectionKey] of sectionKeys.entries()) {
      const sourceSection = sourceSections[index]
      if (!sourceSection) {
        continue
      }

      next.legalPages[targetKey].sections[sectionKey].title = asString(
        sourceSection?.title,
        next.legalPages[targetKey].sections[sectionKey].title,
      )
      next.legalPages[targetKey].sections[sectionKey].body = asString(
        sourceSection?.body,
        next.legalPages[targetKey].sections[sectionKey].body,
      )
    }
  }

  next.seo.legalPages.privacy.title = asString(
    seoPages?.legalPrivacy?.title,
    next.seo.legalPages.privacy.title,
  )
  next.seo.legalPages.privacy.description = asString(
    seoPages?.legalPrivacy?.description,
    next.seo.legalPages.privacy.description,
  )
  next.seo.legalPages.terms.title = asString(
    seoPages?.legalTerms?.title,
    next.seo.legalPages.terms.title,
  )
  next.seo.legalPages.terms.description = asString(
    seoPages?.legalTerms?.description,
    next.seo.legalPages.terms.description,
  )
  next.seo.legalPages.disclaimer.title = asString(
    seoPages?.legalDisclaimer?.title,
    next.seo.legalPages.disclaimer.title,
  )
  next.seo.legalPages.disclaimer.description = asString(
    seoPages?.legalDisclaimer?.description,
    next.seo.legalPages.disclaimer.description,
  )
  next.seo.legalPages.medical.title = asString(
    seoPages?.legalMedical?.title,
    next.seo.legalPages.medical.title,
  )
  next.seo.legalPages.medical.description = asString(
    seoPages?.legalMedical?.description,
    next.seo.legalPages.medical.description,
  )
  next.seo.legalPages.crisis.title = asString(
    seoPages?.legalMentalHealth?.title,
    next.seo.legalPages.crisis.title,
  )
  next.seo.legalPages.crisis.description = asString(
    seoPages?.legalMentalHealth?.description,
    next.seo.legalPages.crisis.description,
  )
  next.seo.legalPages.cookies.title = asString(
    seoPages?.legalCookies?.title,
    next.seo.legalPages.cookies.title,
  )
  next.seo.legalPages.cookies.description = asString(
    seoPages?.legalCookies?.description,
    next.seo.legalPages.cookies.description,
  )

  next.resourceTopics.hotlines.title = asString(
    superContent?.resourcesPage?.modules?.hotlines?.title,
    next.resourceTopics.hotlines.title,
  )
  next.resourceTopics.hotlines.description = asString(
    superContent?.resourcesPage?.modules?.hotlines?.subtitle,
    next.resourceTopics.hotlines.description,
  )
  next.resourceTopics.hotlines.countryLegend = 'Mostrando información para {{country}}'
  next.resourceTopics.hotlines.resultsTitle = 'Líneas y recursos sugeridos · {{country}}'
  next.resourceTopics.hotlines.empty = asString(
    superContent?.resourcesPage?.gallery?.emptyStateBody,
    next.resourceTopics.hotlines.empty,
  )

  next.resourceTopics.findLocalHelp.title = asString(
    superContent?.resourcesPage?.modules?.findLocalHelp?.title,
    next.resourceTopics.findLocalHelp.title,
  )
  next.resourceTopics.findLocalHelp.description = asString(
    superContent?.resourcesPage?.modules?.findLocalHelp?.subtitle,
    next.resourceTopics.findLocalHelp.description,
  )
  next.resourceTopics.findLocalHelp.countryLegend =
    'Mostrando información para {{country}}'
  next.resourceTopics.findLocalHelp.resultsTitle = 'Ayuda local sugerida · {{country}}'
  next.resourceTopics.findLocalHelp.empty = asString(
    superContent?.resourcesPage?.gallery?.emptyStateBody,
    next.resourceTopics.findLocalHelp.empty,
  )

  next.resourceTopics.emotionalSupport.title = asString(
    superContent?.resourcesPage?.modules?.emotionalSupport?.title,
    next.resourceTopics.emotionalSupport.title,
  )
  next.resourceTopics.emotionalSupport.description = asString(
    superContent?.resourcesPage?.modules?.emotionalSupport?.subtitle,
    next.resourceTopics.emotionalSupport.description,
  )
  next.resourceTopics.emotionalSupport.countryLegend =
    'Mostrando información para {{country}}'
  next.resourceTopics.emotionalSupport.resultsTitle =
    'Apoyo emocional sugerido · {{country}}'
  next.resourceTopics.emotionalSupport.empty = asString(
    superContent?.resourcesPage?.gallery?.emptyStateBody,
    next.resourceTopics.emotionalSupport.empty,
  )

  next.seo.resourceTopics.hotlines.title = asString(
    superContent?.resourcesPage?.modules?.hotlines?.seo?.title,
    next.seo.resourceTopics.hotlines.title,
  )
  next.seo.resourceTopics.hotlines.description = asString(
    superContent?.resourcesPage?.modules?.hotlines?.seo?.description,
    next.seo.resourceTopics.hotlines.description,
  )
  next.seo.resourceTopics.findLocalHelp.title = asString(
    superContent?.resourcesPage?.modules?.findLocalHelp?.seo?.title,
    next.seo.resourceTopics.findLocalHelp.title,
  )
  next.seo.resourceTopics.findLocalHelp.description = asString(
    superContent?.resourcesPage?.modules?.findLocalHelp?.seo?.description,
    next.seo.resourceTopics.findLocalHelp.description,
  )
  next.seo.resourceTopics.emotionalSupport.title = asString(
    superContent?.resourcesPage?.modules?.emotionalSupport?.seo?.title,
    next.seo.resourceTopics.emotionalSupport.title,
  )
  next.seo.resourceTopics.emotionalSupport.description = asString(
    superContent?.resourcesPage?.modules?.emotionalSupport?.seo?.description,
    next.seo.resourceTopics.emotionalSupport.description,
  )

  return {
    locale: next,
    faqCategoryKeys: orderedFaqCategories,
    faqItems,
  }
}

function buildStoriesData(superContent) {
  const existingStoriesCatalog = readJson(STORIES_DATA_PATH)
  const countriesLookup = buildCountriesLookup(superContent)

  const imageKeys = ['newborn', 'hopeHand', 'babyHand', 'glow']
  let imageIndex = 0

  const existingStories = Array.isArray(existingStoriesCatalog?.stories)
    ? existingStoriesCatalog.stories
    : []

  const superStories = Array.isArray(superContent?.data?.stories)
    ? superContent.data.stories
    : []

  const transformedSuperStories = superStories
    .map((story, index) => {
      const countryCode = asString(story?.country).toUpperCase()
      if (!/^[A-Z]{2}$/.test(countryCode)) {
        return null
      }

      const storyId = toSlug(story?.id, `story-${index + 1}`)

      const body = Array.isArray(story?.body)
        ? story.body.map((paragraph) => asString(paragraph)).filter(Boolean)
        : []

      const readingMinutes = Number.isFinite(story?.readTimeMinutes)
        ? Number(story.readTimeMinutes)
        : 5

      const publishedAt = asString(story?.date, '')

      const nextImageKey = imageKeys[imageIndex % imageKeys.length]
      imageIndex += 1

      return {
        id: storyId,
        countryCode,
        title: asString(story?.title, 'Historia sin título'),
        author: asString(story?.author, 'Anónima'),
        imageKey: nextImageKey,
        summary: asString(story?.summary),
        body,
        readingMinutes,
        publishedAt,
      }
    })
    .filter(Boolean)

  const mergedStoriesById = new Map()

  for (const story of existingStories) {
    mergedStoriesById.set(asString(story?.id), story)
  }

  for (const story of transformedSuperStories) {
    if (!mergedStoriesById.has(story.id)) {
      mergedStoriesById.set(story.id, story)
    }
  }

  const mergedStories = [...mergedStoriesById.values()]

  const countryCodes = [
    ...new Set(mergedStories.map((story) => story.countryCode)),
  ].sort()

  const existingCountryNames = new Map(
    (existingStoriesCatalog?.countries ?? []).map((country) => [
      asString(country?.code).toUpperCase(),
      asString(country?.name),
    ]),
  )

  const countries = countryCodes.map((code) => ({
    code,
    name: countriesLookup.get(code) ?? existingCountryNames.get(code) ?? code,
  }))

  return {
    countries,
    stories: mergedStories,
  }
}

function buildResourcesData(superContent) {
  const existingResourcesCatalog = readJson(RESOURCES_DATA_PATH)
  const countriesLookup = buildCountriesLookup(superContent)

  const existingResources = Array.isArray(existingResourcesCatalog?.resources)
    ? existingResourcesCatalog.resources
    : []

  const imageKeys = ['beams', 'lake', 'babyFace', 'babyFeet']
  let imageIndex = 0

  const superResources = Array.isArray(superContent?.data?.resources)
    ? superContent.data.resources
    : []

  const transformedSuperResources = superResources
    .map((resource, index) => {
      const countryCode = asString(resource?.country).toUpperCase()
      if (!/^[A-Z]{2}$/.test(countryCode)) {
        return null
      }

      const sourceType = asString(resource?.type, 'url').toLowerCase()
      const resourceType = ['phone', 'url', 'address'].includes(sourceType)
        ? sourceType
        : 'url'

      const resourceValue =
        resourceType === 'phone'
          ? asString(resource?.phone || resource?.value || resource?.website)
          : resourceType === 'address'
            ? asString(resource?.address || resource?.location || resource?.website)
            : asString(resource?.website || resource?.url || resource?.value)

      if (!resourceValue) {
        return null
      }

      const resourceId = toSlug(resource?.id, `resource-${index + 1}`)
      const nextImageKey = imageKeys[imageIndex % imageKeys.length]
      imageIndex += 1

      return {
        id: resourceId,
        countryCode,
        title: asString(resource?.name || resource?.title, 'Recurso'),
        description: asString(
          resource?.description || resource?.supportType || resource?.mission,
          'Recurso de apoyo',
        ),
        resourceType,
        resourceValue,
        imageKey: nextImageKey,
        category: asString(resource?.category),
      }
    })
    .filter(Boolean)

  const mergedResourcesById = new Map()
  for (const resource of existingResources) {
    mergedResourcesById.set(asString(resource?.id), resource)
  }
  for (const resource of transformedSuperResources) {
    if (!mergedResourcesById.has(resource.id)) {
      mergedResourcesById.set(resource.id, resource)
    }
  }

  const mergedResources = [...mergedResourcesById.values()]

  const countryCodes = [
    ...new Set(mergedResources.map((resource) => resource.countryCode)),
  ].sort()

  const existingCountryNames = new Map(
    (existingResourcesCatalog?.countries ?? []).map((country) => [
      asString(country?.code).toUpperCase(),
      asString(country?.name),
    ]),
  )

  const countries = countryCodes.map((code) => ({
    code,
    name: countriesLookup.get(code) ?? existingCountryNames.get(code) ?? code,
  }))

  return {
    countries,
    resources: mergedResources,
  }
}

function writeFaqItemsFile(categoryKeys, faqItems) {
  const lines = []
  lines.push('export const FAQ_CATEGORY_KEYS = [')
  for (const categoryKey of categoryKeys) {
    lines.push(`  '${categoryKey}',`)
  }
  lines.push(']')
  lines.push('')
  lines.push('export const FAQ_ITEMS = [')
  for (const item of faqItems) {
    lines.push(`  { id: '${item.id}', category: '${item.category}' },`)
  }
  lines.push(']')
  lines.push('')

  fs.writeFileSync(FAQ_ITEMS_PATH, lines.join('\n'), 'utf8')
}

function main() {
  const superContent = readJson(SUPER_CONTENT_PATH)
  const baseEsLocale = readJson(ES_COMMON_PATH)

  const { locale, faqCategoryKeys, faqItems } = applyCommonTranslations(
    baseEsLocale,
    superContent,
  )

  const storiesData = buildStoriesData(superContent)
  const resourcesData = buildResourcesData(superContent)

  writeJson(ES_COMMON_PATH, locale)
  writeJson(STORIES_DATA_PATH, storiesData)
  writeJson(RESOURCES_DATA_PATH, resourcesData)
  writeFaqItemsFile(faqCategoryKeys, faqItems)

  console.log(
    [
      `Updated locale: ${ES_COMMON_PATH}`,
      `Updated stories: ${STORIES_DATA_PATH}`,
      `Updated resources: ${RESOURCES_DATA_PATH}`,
      `Updated FAQ keys/items: ${FAQ_ITEMS_PATH}`,
      `FAQ items: ${faqItems.length}`,
      `FAQ categories: ${faqCategoryKeys.length}`,
      `Stories: ${storiesData.stories.length}`,
      `Resources: ${resourcesData.resources.length}`,
    ].join('\n'),
  )
}

main()
