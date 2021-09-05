import {
  isPlainObject,
  handleError
} from '../util/index'
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