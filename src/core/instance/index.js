import {initMixin} from './init'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
function Vue (options) {
  this._init(options)
}

initMixin(Vue) //原型上挂载_init 方法
// stateMixin(Vue)
eventsMixin(Vue) //原型上挂载 $on $once $off $emit
lifecycleMixin(Vue) //挂载 _update  $forceUpdate   $destroy   方法
renderMixin(Vue) //挂载 $nextTick  _render  方法

export default Vue