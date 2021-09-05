import { parseHTML } from './html-parser'
import {
  baseWarn
} from '../helpers'
/**
 * Convert HTML string to AST.
 */

 export let warn
 export function parse (template, options){
  warn = options.warn || baseWarn
  let root
  let currentParent
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary, start, end) {
      console.log('start', tag)
    },
    end (tag, start, end) {
      console.log('end', tag)
    },
    chars (text, start, end) {
      console.log('chars', text)
    },
    comment (text, start, end) {
      if (currentParent) {
        const child = {
          type: 3,
          text,
          isComment: true
        }
        // if (options.outputSourceRange) {
        //   child.start = start
        //   child.end = end
        // }
        currentParent.children.push(child)
      }
    }
  })
  return root
 }