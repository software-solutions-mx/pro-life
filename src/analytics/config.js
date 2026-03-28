const GTM_PLACEHOLDER = 'GTM-XXXXXXX'
const GA4_PLACEHOLDER = 'G-XXXXXXXXXX'

export const GTM_ID = import.meta.env.VITE_GTM_ID ?? GTM_PLACEHOLDER
export const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID ?? GA4_PLACEHOLDER
export const ANALYTICS_ENV = import.meta.env.MODE

export const IS_GTM_CONFIGURED =
  typeof GTM_ID === 'string' &&
  GTM_ID.length > 0 &&
  GTM_ID !== GTM_PLACEHOLDER

export const IS_GA4_CONFIGURED =
  typeof GA4_MEASUREMENT_ID === 'string' &&
  GA4_MEASUREMENT_ID.length > 0 &&
  GA4_MEASUREMENT_ID !== GA4_PLACEHOLDER

export const IS_ANALYTICS_ENABLED = import.meta.env.PROD && IS_GTM_CONFIGURED
