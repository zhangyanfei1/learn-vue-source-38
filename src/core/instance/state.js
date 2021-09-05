import {
  noop,
  hasOwn,
  isReserved,
  isPlainObject,
  handleError
} from '../util/index'

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}


export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
}

function initData (vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
    if (!isPlainObject(data)) {
      data = {}
    }
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (false) {

    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }

}

export function getData (data, vm){
  // #7573 disable dep collection when invoking data getters
  // pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    // popTarget()
  }
}