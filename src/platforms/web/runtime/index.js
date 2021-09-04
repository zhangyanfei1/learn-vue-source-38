import Vue from '../../../core/index'
import { mountComponent } from '../../../core/instance/lifecycle'
import { patch } from './patch'

// install platform patch function
Vue.prototype.__patch__ = patch

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
){
  return mountComponent(this, el, hydrating)
}

export default Vue