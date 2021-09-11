import Watcher from '../observer/watcher'
import { pushTarget, popTarget } from '../observer/dep'

import {
  noop,
  remove,
  invokeWithErrorHandling
} from '../util/index'

export let activeInstance = null

export function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

export function initLifecycle (vm) {
  const options = vm.$options

  // locate first non-abstract parent
  let parent = options.parent
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent
    }
    parent.$children.push(vm)
  }

  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  vm.$children = []
  vm.$refs = {}

  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    const vm = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
  }

  Vue.prototype.$destroy = function () {
    const vm = this
    if (vm._isBeingDestroyed) { //正在走$destroy逻辑
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) { //如果parent存在，且没有在销毁中，且当前vm
      remove(parent.$children, vm)
    }
    // // teardown watchers
    if (vm._watcher) { //数据监听移除
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // // remove reference from data ob
    // // frozen object may not have observer.
    if (vm._data.__ob__) {
      // vm._data.__ob__.vmCount--
    }
    // // call the last hook...
    vm._isDestroyed = true
    // // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null) //把子组件都销毁
    // // fire destroyed hook

    //解除关联关系：销毁子组件
    callHook(vm, 'destroyed')
    // // turn off all instance listeners.
    vm.$off()
    // // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
    // // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null
    }
  }
}

export function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el
  callHook(vm, 'beforeMount')
  let updateComponent
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true)

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}

export function activateChildComponent (vm, direct) {
  callHook(vm, 'activated')
}

export function deactivateChildComponent (vm, direct) {
  callHook(vm, 'deactivated')
}

export function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget()
  const handlers = vm.$options[hook]
  const info = `${hook} hook`
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info)
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
  popTarget()
}