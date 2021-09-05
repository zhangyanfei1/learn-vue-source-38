import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'

export function initRender (vm) {
  const options = vm.$options

  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
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