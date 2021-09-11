import {
  emptyObject
} from '../util/index'
import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'
import { resolveSlots } from './render-helpers/resolve-slots'

export function initRender (vm) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  const parentData = parentVnode && parentVnode.data
  if (true) {

  } else {

  }
}
export function renderMixin (Vue) {
  installRenderHelpers(Vue.prototype)

  Vue.prototype._render = function () {
    const vm = this
    const { render, _parentVnode } = vm.$options
    if (_parentVnode) {

    }

    vm.$vnode = _parentVnode

    let vnode
    vnode = render.call(vm._renderProxy, vm.$createElement)
    vnode.parent = _parentVnode
    return vnode
  }
}