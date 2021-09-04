import { createTextVNode } from '../../vdom/vnode'
import { isPrimitive } from '../../../shared/util'
export function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function normalizeArrayChildren (children, nestedIndex) {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]

    if (Array.isArray(c)) {

    } else if (isPrimitive(c)) {

    } else {
      res.push(c)
    }
  }
  return res
}