import VNode from './vnode'
import {
  isUndef,
  isObject
} from '../util/index'

import { resolveConstructorOptions } from '../../core/instance/init'

import {
  activeInstance
} from '../instance/lifecycle'
const componentVNodeHooks = {
  init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      // const mountedNode = vnode // work around flow
      // componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
  prepatch (oldVnode, vnode) {

  },

  insert (vnode) {

  },

  destroy (vnode) {

  }
    
}

const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = toMerge
    }
  }
}

// function mergeHook (f1, f2) {
//   const merged = (a, b) => {
//     // flow complains about extra args which is why we use any
//     f1(a, b)
//     f2(a, b)
//   }
//   merged._merged = true
//   return merged
// }

export function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }
  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  data = data || {}
  const propsData = ''
  const listeners = data.on

  let asyncFactory
  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // resolveConstructorOptions(Ctor)

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    {Ctor, propsData, listeners, tag, children},
    asyncFactory
  )
  return vnode
}

export function createComponentInstanceForVnode (vnode, parent){
  const options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  //TODO
  

  return new vnode.componentOptions.Ctor(options)
}