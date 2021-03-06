import { createCompilerCreator } from './create-compiler'
import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
export const createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  const ast = parse(template.trim(), options)
  console.log('ast', ast)
  if (options.optimize !== false) {
    //优化，静态化
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})