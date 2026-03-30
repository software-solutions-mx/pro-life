export const SUPPORTED_COUNTRIES = [
  { code: 'US' },
  { code: 'MX' },
  { code: 'FR' },
  { code: 'BR' },
]

export const SUPPORTED_COUNTRY_CODES = SUPPORTED_COUNTRIES.map((country) => country.code)

export function countryCodeToFlag(code) {
  if (typeof code !== 'string' || code.length !== 2) {
    return ''
  }

  return code
    .toUpperCase()
    .split('')
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join('')
}
