import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.TextDecoder = TextDecoder
