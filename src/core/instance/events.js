export function initEvents (vm) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}

export function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {

}


export function eventsMixin (Vue) {
  Vue.prototype.$off = function (event, fn) {

  }
}