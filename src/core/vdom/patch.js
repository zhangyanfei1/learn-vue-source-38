import VNode from './vnode'
import { SSR_ATTR } from '../../shared/constants'
import {
  isDef,
  isUndef,
  isTrue,
  isPrimitive
} from '../util/index'

function sameVnode (a, b) {
  
}

export function createPatchFunction (backend) {

  const { modules, nodeOps } = backend

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      //TODO
    }

    vnode.isRootInsert = !nested // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    if (isDef(tag)) {
      if (true) {

      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode)
      setScope(vnode)
      if (false) { //TODO

      } else {
        createChildren(vnode, children, insertedVnodeQueue)
        if (isDef(data)) {
          // invokeCreateHooks(vnode, insertedVnodeQueue)
        }
        insert(parentElm, vnode.elm, refElm)
      }
    } else if (isTrue(vnode.isComment)) {

    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text)
      insert(parentElm, vnode.elm, refElm)
    }
  }

  function setScope (vnode) {
    // let i
    // if (isDef(i = vnode.fnScopeId)) {
    //   nodeOps.setStyleScope(vnode.elm, i)
    // } else {
    //   let ancestor = vnode
    //   while (ancestor) {
    //     if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
    //       nodeOps.setStyleScope(vnode.elm, i)
    //     }
    //     ancestor = ancestor.parent
    //   }
    // }
    // // for slot content they should also get the scopeId from the host instance.
    // if (isDef(i = activeInstance) &&
    //   i !== vnode.context &&
    //   i !== vnode.fnContext &&
    //   isDef(i = i.$options._scopeId)
    // ) {
    //   nodeOps.setStyleScope(vnode.elm, i)
    // }
  }
  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance)
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */)
      }
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue)
        insert(parentElm, vnode.elm, refElm)
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      //TODO
    }
    vnode.elm = vnode.componentInstance.$el
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
    }
  }

  function invokeDestroyHook (vnode) {
    // let i, j
    // const data = vnode.data
    // if (isDef(data)) {
    //   if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    //   for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    // }
    // if (isDef(i = vnode.children)) {
    //   for (j = 0; j < vnode.children.length; ++j) {
    //     invokeDestroyHook(vnode.children[j])
    //   }
    // }
  }

  function insert (parent, elm, ref) {
    debugger
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref)
        }
      } else {
        nodeOps.appendChild(parent, elm)
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function patchVnode(
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {

  }

  function removeVnodes (vnodes, startIdx, endIdx) {
    debugger
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx]
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch)
          invokeDestroyHook(ch)
        } else { // Text node
          removeNode(ch.elm)
        }
      }
    }
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      removeNode(childElm)
    }
    // remove.listeners = listeners
    return remove
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      const listeners = []
      if (isDef(rm)) {

      } else {
        debugger
        rm = createRmCb(vnode.elm, listeners)
      }
      rm()
    } else {
      removeNode(vnode.elm)
    }
  }

  function removeNode (el) {
    const parent = nodeOps.parentNode(el)
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    debugger
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    const insertedVnodeQueue = []
    if (isUndef(oldVnode)) {
      createElm(vnode, insertedVnodeQueue)
    } else {
      const isRealElement = isDef(oldVnode.nodeType) //判断 老节点是不是 一个真实的element
      // 新 旧 节点相同
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
      } else {
        if (isRealElement) {
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {

          }
          oldVnode = emptyNodeAt(oldVnode)
        }

        // replacing existing element
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)

        // create new node
        console.log(nodeOps.nextSibling(oldElm))
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          parentElm,
          nodeOps.nextSibling(oldElm)
        )

        if (isDef(vnode.parent)) {
          //TODO
        }

        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode)
        }
      }
    }
    return vnode.elm
  }
}