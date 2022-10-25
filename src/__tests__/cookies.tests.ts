import { JSDOM } from 'jsdom'
import { Cookies } from '../index'

function getDOMDocument(path: string): Document {
  const url = new URL('https://example.org/')
  url.pathname = path
  const dom = new JSDOM(``, {
    url: url.toString(),
    referrer: url.toString(),
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000,
  })

  return dom.window.document
}

describe('Cookie', () => {
  it('properly sets cookie', () => {
    const document = getDOMDocument('/')

    const cookies = new Cookies({ document })
    cookies.set('key', 'value')
    expect(cookies.get('key')).toEqual('value')
  })

  it('if it set for another path gives undefined', () => {
    const document = getDOMDocument('/')
    const cookies = new Cookies({ document })

    cookies.set('key', 'value', { path: '/another-path' })
    expect(cookies.get('key')).toBeUndefined()
  })

  it('if it set for another path and is currently on another path returns value', () => {
    const document = getDOMDocument('/another-path')
    const cookies = new Cookies({ document })

    cookies.set('key', 'value', { path: '/another-path' })
    expect(cookies.get('key')).toEqual('value')
  })

  it('properly sets value with special characters', () => {
    const document = getDOMDocument('/')
    const cookies = new Cookies({ document })
    const val = "val;'$5%"

    cookies.set('key', val)
    expect(cookies.get('key')).toEqual(val)
  })

  it('deletes key', () => {
    const document = getDOMDocument('/')
    const cookies = new Cookies({ document })

    expect(cookies.get('key')).toBeUndefined()
    cookies.set('key', 'val')
    expect(cookies.get('key')).toEqual('val')
    cookies.remove('key')
    expect(cookies.get('key')).toBeUndefined()
  })

  it('properly sets expiration', () => {
    const cookieSetter = jest.fn()
    const document = getDOMDocument('/')
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies({ document })

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

  it('does not set non specified params', () => {
    const cookieSetter = jest.fn()
    const document = getDOMDocument('/')
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies({ document })

    const expires = new Date('Tue Jun 28 2022 11:07:45 GMT+0200')

    cookies.set('key', 'value', {
      expires,
      path: '/another-path',
      secure: true,
    })
    expect(cookieSetter).toHaveBeenCalledWith(
      'key=value;path=/another-path;expires=Tue, 28 Jun 2022 09:07:45 GMT;secure'
    )
  })

  it('uses global configuration', () => {
    const cookieSetter = jest.fn()
    const expires = new Date('Tue Jun 28 2022 11:07:45 GMT+0200')
    const document = getDOMDocument('/')
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies({
      document,
      path: '/another-path',
      domain: 'example.com',
      maxAge: 1,
      expires,
      secure: true,
      samesite: 'strict',
    })

    cookies.set('key', 'value')
    expect(cookieSetter).toHaveBeenCalledWith(
      'key=value;path=/another-path;domain=example.com;max-age=1;expires=Tue, 28 Jun 2022 09:07:45 GMT;secure;samesite=strict'
    )
  })

  it('does not include secure if secure set to false', () => {
    const cookieSetter = jest.fn()
    const expires = new Date('Tue Jun 28 2022 11:07:45 GMT+0200')
    const document = getDOMDocument('/')
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies({
      document,
      path: '/another-path',
      domain: 'example.com',
      maxAge: 1,
      expires,
      secure: false,
      samesite: 'strict',
    })

    cookies.set('key', 'value')
    expect(cookieSetter).toHaveBeenCalledWith(
      'key=value;path=/another-path;domain=example.com;max-age=1;expires=Tue, 28 Jun 2022 09:07:45 GMT;secure;samesite=strict'
    )
  })

  it('uses global configuration set after initialization', () => {
    const cookieSetter = jest.fn()
    const expires = new Date('Tue Jun 28 2022 11:07:45 GMT+0200')
    const document = getDOMDocument('/')
    Object.defineProperty(document, 'cookie', {
      set: cookieSetter,
    })
    const cookies = new Cookies({ document })
    cookies.options = {
      path: '/another-path',
      domain: 'example.com',
      maxAge: 1,
      expires,
      secure: true,
      samesite: 'strict',
    }

    cookies.set('key', 'value')
    expect(cookieSetter).toHaveBeenCalledWith(
      'key=value;path=/another-path;domain=example.com;max-age=1;expires=Tue, 28 Jun 2022 09:07:45 GMT;secure;samesite=strict'
    )
  })

  it('uses default document if not specified', () => {
    const cookies = new Cookies()
    cookies.set('key', 'value')

    expect(cookies.get('key')).toEqual('value')
  })
})
