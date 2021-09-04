export function noop (a, b, c) {}

export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isTrue (v) {
  return v === true
}

export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Always return false.
 */
 export const no = (a, b, c) => {
   return (a === 'div' || a === 'h1')
 }

 /**
 * Return the same value.
 */
export const identity = (_) => _


const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}


/**
 * Camelize a hyphen-delimited string.
 */
//  const camelizeRE = /-(\w)/g
//  export const camelize = cached((str) => {
//    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
//  })

 /**
 * Capitalize a string.
 */
// export const capitalize = cached((str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// })

export function isObject (obj){
  return obj !== null && typeof obj === 'object'
}