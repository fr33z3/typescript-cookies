<h1 align="center">
  typescript-cookies
</h1>

I've got tired of using all those cookie packages with no or wrong type declarations. Say hello to <b>typescript-cookies</b>. 

## Basic usage

```js
import cookies from 'typescript-cookies'

cookies.set('cookie-name', 'cookie-value')
const cookie = cookies.get('cookie-name')
console.log(cookie)
# => cookie-value
cookies.remove('cookie-name')

```

## Setter options
For better understanding of options read [MDM Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie).
### Expiration
Specify either ```number``` or ```Date```.
For ```number``` package will set up cookie expiration by number of specified dates.
For ```Date``` - exact time of expiration.

```js
cookies.set('cookie-name', 'cookie-value', { expires: 1 })
cookies.set('cookie-name', 'cookie-value', { expires: new Date() })
```

### Max Age
Set up max-age parameter. Read [MDM docs](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) for more.
```js
cookies.set('cookie-name', 'cookie-value', { maxAge: 1000 })
```

### Path
This parameter defaults to '/'. So no need to set it up if that is what you need.
```js
cookies.set('cookie-name', 'cookie-value', { path: '/some/path' })
```

### Domain
```js
cookies.set('cookie-name', 'cookie-value', { domain: 'www.example.com' })
```

### Secure
```js
cookies.set('cookie-name', 'cookie-value', { secure: true })
```

### Samesite
Accepts 'lax', 'strict' or 'none'
```js
cookies.set('cookie-name', 'cookie-value', { samesite: 'lax' })
```

### Example
```js
cookies.set('cookie-name', 'cookie-value', {
  expires: 7,
  path: '/',
  domain: 'www.google.com',
  secure: true,
  samesite: 'none',
})
```
