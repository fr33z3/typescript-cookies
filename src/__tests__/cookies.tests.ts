import { JSDOM } from 'jsdom'
import { Cookies } from '../index'

function getDOM(path: string) {
  const url = new URL('https://example.org/')
  url.pathname = path
  const dom = new JSDOM(``, {
    url: url.toString(),
    referrer: url.toString(),
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
  })

  return dom
}

describe('Cookie', () => {
  it('properly sets cookie', () => {
    const dom = getDOM('/')

    const cookies = new Cookies(dom.window.document)
    cookies.set('key', 'value')
    expect(cookies.get('key')).toEqual('value')
  })

  it('if it set for another path gives undefined', () => {
    const dom = getDOM('/')
    const cookies = new Cookies(dom.window.document)

    cookies.set('key', 'value', { path: '/another-path' })
    expect(cookies.get('key')).toBeUndefined()
  })

  it('if it set for another path and is currently on another path returns value', () => {
    const dom = getDOM('/another-path')
    const cookies = new Cookies(dom.window.document)

    cookies.set('key', 'value', { path: '/another-path' })
    expect(cookies.get('key')).toEqual('value')
  })

  it('properly sets value with special characters', () => {
    const dom = getDOM('/')
    const cookies = new Cookies(dom.window.document)
    const val = "val;'$5%"

    cookies.set('key', val)
    expect(cookies.get('key')).toEqual(val)
  })

  it('deletes key', () => {
    const dom = getDOM('/')
    const cookies = new Cookies(dom.window.document)

    expect(cookies.get('key')).toBeUndefined()
    cookies.set('key', 'val')
    expect(cookies.get('key')).toEqual('val')
    cookies.remove('key')
    expect(cookies.get('key')).toBeUndefined()
  })

  it('properly sets expiration', () => {
    const cookieSetter = jest.fn()
    const dom = getDOM('/')
    const { document } = dom.window
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies(document)

    const expires = new Date('Tue Jun 28 2022 11:07:45 GMT+0200')

    cookies.set('key', 'value', {
      expires,
      maxAge: 1,
      path: '/another-path',
      domain: 'example.com',
      secure: true,
      samesite: 'strict',
    })
    expect(cookieSetter).toHaveBeenCalledWith(
      'key=value;path=/another-path;domain=example.com;max-age=1;expires=Tue, 28 Jun 2022 09:07:45 GMT;secure;samesite=strict'
    )
  })
})
