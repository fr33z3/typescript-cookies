import { compact } from './utils'

const daysPower = 24 * 60 * 60 * 1000

type Options = {
  expires?: number | Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  samesite?: 'lax' | 'strict' | 'none'
}

function getExpirationDateStr(value: number | Date): string {
  if (typeof value !== 'number') return value.toUTCString()

  return new Date(Date.now() + value * daysPower).toUTCString()
}

export class Cookies {
  doc: Document
  options: Options

  constructor(config?: Options & { document: Document }) {
    const { document, ...options } = config ?? {}
    this.options = options ?? {}
    this.doc = document ?? window.document
  }

  get(name: string): string | undefined {
    const cookieStrings = this.doc.cookie.split(/;\s*/)
    const cookies = cookieStrings.reduce<Record<string, string>>((sum, cookie) => {
      const [cookieName, value] = cookie.split('=')

      return {
        ...sum,
        [cookieName]: decodeURIComponent(value),
      }
    }, {})

    return cookies[name]
  }

  set(name: string, value: string, options: Options = {}) {
    const {
      expires,
      maxAge,
      path = '/',
      domain,
      secure,
      samesite,
    } = { ...this.options, ...options }

    const cookieString = compact([
      `${name}=${encodeURIComponent(value)}`,
      `path=${path}`,
      domain ? `domain=${domain}` : null,
      maxAge ? `max-age=${maxAge}` : null,
      expires ? `expires=${getExpirationDateStr(expires)}` : null,
      secure ? 'secure' : null,
      samesite ? `samesite=${samesite}` : null,
    ]).join(';')

    this.doc.cookie = cookieString
  }

  remove(name: string) {
    this.doc.cookie = `${name}=;expires=${new Date(0).toUTCString()};max-age=-99999999`
  }
}

const documentCookies = new Cookies()
export default documentCookies
