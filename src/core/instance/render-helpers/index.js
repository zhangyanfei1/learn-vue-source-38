import { createTextVNode} from '../../../core/vdom/vnode'
import { toString } from '../../../shared/util'

export function installRenderHelpers (target) {
  target._s = toString
  target._v = createTextVNode
}