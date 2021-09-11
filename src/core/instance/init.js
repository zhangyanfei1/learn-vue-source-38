import config from '../config'
import { mark, measure } from '../util/perf'
import { initProxy } from './proxy'
import { initState } from './state'
import { initEvents } from './events'
import { initRender } from './render'
import { initProvide, initInjections } from './inject'
import { initLifecycle, callHook } from './lifecycle'
import { mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (true && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }
    if (options && options._isComponent) { //合并配置
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    if (true) { //对vm做代理 TODO
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }

    vm._self = vm //

    initLifecycle(vm) // 初始化 $parent $root $children $refs
    initEvents(vm) //初始化父组件 传递的 监听器
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm) //初始化 data，watch，method， props， computed
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    if (true && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

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
