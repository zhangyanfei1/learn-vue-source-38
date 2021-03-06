export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA))

// Firefox has a "watch" function on Object.prototype...
export const nativeWatch = ({}).watch //fix

export function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

let _isServer
export const isServerRendering = () => {
  _isServer = false
  return _isServer
}