import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initLifecycle } from './lifecycle'
import { mergeOptions } from '../util/index'
export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    initProxy(vm)

    initLifecycle(vm) 
    initRender(vm)
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

export function initInternalComponent (vm, options) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  const parentVnode = options._parentVnode //父组件vnode
  opts.parent = options.parent //父组件实例
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor) {
  let options = Ctor.options
  //TODO
  return options
}
