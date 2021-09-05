import { createTextVNode} from '../../../core/vdom/vnode'

export function installRenderHelpers (target) {
  target._v = createTextVNode
}