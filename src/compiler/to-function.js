import { noop} from '../shared/util'
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}

export function createCompileToFunctionFn (compile) {
  //entry-runtime  中的  compileToFunctions，（生成render、staticRenderFns函数）
  return function compileToFunctions (template, options, vm){
    const compiled = compile(template, options)
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = {} // TODO
    return res
  }
}