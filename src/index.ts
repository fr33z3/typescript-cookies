const daysPower = 24 * 60 * 60 * 1000

type SetOptions = {
  expires?: number | Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  samesite?: 'lax' | 'strict' | 'none'
}

export class Cookies {
  doc: Document

  constructor(doc: Document) {
    this.doc = doc
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

  set(name: string, value: string, options: SetOptions = {}) {
    const { expires, maxAge, path = '/', domain, secure, samesite } = options
    let cookieString = `${name}=${encodeURIComponent(value)}`

    cookieString = `${cookieString};path=${path}`
    if (domain) cookieString = `${cookieString};domain=${domain}`
    if (maxAge) cookieString = `${cookieString};max-age=${maxAge}`
    if (expires) {
      const date =
        typeof expires === 'number' ? new Date(Date.now() + expires * daysPower) : expires
      cookieString = `${cookieString};expires=${date.toUTCString()}`
    }
    if (secure) cookieString = `${cookieString};secure`
    if (samesite) cookieString = `${cookieString};samesite=${samesite}`
    this.doc.cookie = cookieString
  }

  remove(name: string) {
    this.doc.cookie = `${name}=;expires=${new Date(0).toUTCString()};max-age=-99999999`
  }
}

const documentCookies = new Cookies(window.document)
export default documentCookies
