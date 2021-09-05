import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el,
  hydrating
){
  el = el && query(el)
  const options = this.$options
  if (options._componentTag) {
    let render = function (h) {
      return h('div', '我是子组件')
    }
    options.render = render
  }

  if (!options.render) { //只有在没有传入render的时候，才考虑使用模板
    let template = options.template
    if (template) { //template几种不同传入方式处理
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          
        }
      } else if (template.nodeType) {
        
      } else {
        return this
      }
    } else if (el) {
      
    }

    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: true,
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  return mount.call(this, el, hydrating)
}

export default Vue