// import he from 'he'
import { parseHTML } from './html-parser'
import { parseText } from './text-parser'
import { no, extend, cached } from '../../shared/util'
import { isIE, isServerRendering } from '../../core/util/env'
import {
  addAttr,
  getBindingAttr,
  getAndRemoveAttr,
  baseWarn,
  pluckModuleFunction
} from '../helpers'
/**
 * Convert HTML string to AST.
 */

 export const dirRE = /^v-|^@|^:|^\.|^#/

//  const decodeHTMLCached = cached(he.decode)

 const lineBreakRE = /[\r\n]/

 const invalidAttributeRE = /[\s"'<>\/=]/

 export let warn
 let platformIsPreTag
 let platformMustUseProp
 let preTransforms
 let postTransforms
 let platformGetTagNamespace
 let maybeComponent
 let delimiters
 let transforms

 export function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent,
    children: []
  }
}

function makeAttrsMap (attrs) {
  const map = {}
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value
  }
  return map
}

function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}


 export function parse (template, options){
  platformIsPreTag = options.isPreTag || no
  platformMustUseProp = options.mustUseProp || no
  platformGetTagNamespace = options.getTagNamespace || no
  const isReservedTag = options.isReservedTag || no

  maybeComponent = (el) => !!(
    el.component ||
    el.attrsMap[':is'] ||
    el.attrsMap['v-bind:is'] ||
    !(el.attrsMap.is ? isReservedTag(el.attrsMap.is) : isReservedTag(el.tag))
  )



  transforms = pluckModuleFunction(options.modules, 'transformNode')
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')
  delimiters = options.delimiters
  const stack = []
  const preserveWhitespace = options.preserveWhitespace !== false //去掉空格
  const whitespaceOption = options.whitespace
  warn = options.warn || baseWarn
  let root
  let currentParent
  let inVPre = false
  let inPre = false
  let warned = false

  function warnOnce (msg, range) {
    if (!warned) {
      warned = true
      warn(msg, range)
    }
  }

  function closeElement (element) {
    trimEndingWhitespace(element)
    if (!inVPre && !element.processed) {
      element = processElement(element, options)
    }

    if (!stack.length && element !== root) { 
      // allow root elements with v-if, v-else-if and v-else
      if (root.if && (element.elseif || element.else)) {
        if (true) {
          checkRootConstraints(element)
        }
        addIfCondition(root, {
          exp: element.elseif,
          block: element
        })
      } else if (true) {
        warnOnce(
          `Component template should contain exactly one root element. ` +
          `If you are using v-if on multiple elements, ` +
          `use v-else-if to chain them instead.`,
          { start: element.start }
        )
      }
    }

    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent)
      } else {
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          const name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
        }
        currentParent.children.push(element)
        element.parent = currentParent
      }
    }

    element.children = element.children.filter(c => !(c).slotScope)
    // remove trailing whitespace node again
    trimEndingWhitespace(element)

    // check pre state
    if (element.pre) {
      inVPre = false
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false
    }
    // apply post-transforms
    for (let i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options)
    }
  }

  function trimEndingWhitespace (el) {
    // remove trailing whitespace node
    if (!inPre) {
      let lastNode
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop()
      }
    }
  }

  function checkRootConstraints (el) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        `Cannot use <${el.tag}> as component root element because it may ` +
        'contain multiple nodes.',
        { start: el.start }
      )
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' +
        'it renders multiple elements.',
        el.rawAttrsMap['v-for']
      )
    }
  }

  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start (tag, attrs, unary, start, end) {
      const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs)
      }
      let element = createASTElement(tag, attrs, currentParent)
      if (ns) {
        element.ns = ns
      }

      if (true) {
        if (options.outputSourceRange) {
          element.start = start
          element.end = end
          element.rawAttrsMap = element.attrsList.reduce((cumulated, attr) => {
            cumulated[attr.name] = attr
            return cumulated
          }, {})
        }
        attrs.forEach(attr => {
          if (invalidAttributeRE.test(attr.name)) {
            warn(
              `Invalid dynamic argument expression: attribute names cannot contain ` +
              `spaces, quotes, <, >, / or =.`,
              {
                start: attr.start + attr.name.indexOf(`[`),
                end: attr.start + attr.name.length
              }
            )
          }
        })
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true
        warn(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          `<${tag}>` + ', as they will not be parsed.',
          { start: element.start }
        )
      }

      for (let i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element
      }

      if (!inVPre) {
        processPre(element)
        if (element.pre) {
          inVPre = true
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true
      }
      if (inVPre) {
        processRawAttrs(element)
      } else if (!element.processed) {
        // structural directives
        processFor(element)
        processIf(element)
        processOnce(element)
      }


      if (!root) {
        root = element
        if (true) {
          checkRootConstraints(root)
        }
      }
      if (!unary) {
        currentParent = element
        stack.push(element)
      } else {
        closeElement(element)
      }
    },
    end (tag, start, end) {
      const element = stack[stack.length - 1]
      // pop stack
      stack.length -= 1
      currentParent = stack[stack.length - 1]
      if (options.outputSourceRange) {
        element.end = end
      }
      closeElement(element)
    },
    chars (text, start, end) {
      if (!currentParent) {
        if (true) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start }
            )
          } else if ((text = text.trim())) {
            warnOnce(
              `text "${text}" outside root element will be ignored.`,
              { start }
            )
          }
        }
        return
      }

      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }

      const children = currentParent.children
      if (inPre || text.trim()) {
        //TODO
        // text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
        text = text
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = ''
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' '
        } else {
          text = ' '
        }
      } else {
        text = preserveWhitespace ? ' ' : ''
      }


      if (text) {
        let res
        let child
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          }
        } else if (text !== ' ' || !children.length) {
          child = {
            type: 3,
            text
          }
        }
        if (child) {
          if (options.outputSourceRange) {
            child.start = start
            child.end = end
          }
          children.push(child)
        }
      }
    },
    comment (text, start, end) {
      if (currentParent) {
        const child = {
          type: 3,
          text,
          isComment: true
        }
        if (true && options.outputSourceRange) {
          child.start = start
          child.end = end
        }
        currentParent.children.push(child)
      }
    }
  })
  return root
 }

 export function processElement (
  element,
  options
) {
  processKey(element)

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  )

  processRef(element)
  processSlotContent(element)
  processSlotOutlet(element)
  processComponent(element)
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element
  }
  processAttrs(element)
  return element
}

function guardIESVGBug (attrs) {
  const res = []
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '')
      res.push(attr)
    }
  }
  return res
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true
  }
}

function processRawAttrs (el) {
  const list = el.attrsList
  const len = list.length
  if (len) {
    const attrs = el.attrs = new Array(len)
    for (let i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      }
      if (list[i].start != null) {
        attrs[i].start = list[i].start
        attrs[i].end = list[i].end
      }
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true
  }
}

export function processFor (el) {
  let exp
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    const res = parseFor(exp)
    if (res) {
      extend(el, res)
    } else if (true) {
      warn(
        `Invalid v-for expression: ${exp}`,
        el.rawAttrsMap['v-for']
      )
    }
  }
}

function processIf (el) {
  const exp = getAndRemoveAttr(el, 'v-if')
  if (exp) {
    el.if = exp
    addIfCondition(el, {
      exp: exp,
      block: el
    })
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true
    }
    const elseif = getAndRemoveAttr(el, 'v-else-if')
    if (elseif) {
      el.elseif = elseif
    }
  }
}


function processOnce (el) {
  const once = getAndRemoveAttr(el, 'v-once')
  if (once != null) {
    el.once = true
  }
}

export function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = []
  }
  el.ifConditions.push(condition)
}

function processKey (el) {
  const exp = getBindingAttr(el, 'key')
  if (exp) {
    if (process.env.NODE_ENV !== 'production') {
      if (el.tag === 'template') {
        warn(
          `<template> cannot be keyed. Place the key on real elements instead.`,
          getRawBindingAttr(el, 'key')
        )
      }
      if (el.for) {
        const iterator = el.iterator2 || el.iterator1
        const parent = el.parent
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn(
            `Do not use v-for index as key on <transition-group> children, ` +
            `this is the same as not using keys.`,
            getRawBindingAttr(el, 'key'),
            true /* tip */
          )
        }
      }
    }
    el.key = exp
  }
}


function processRef (el) {
  const ref = getBindingAttr(el, 'ref')
  if (ref) {
    el.ref = ref
    el.refInFor = checkInFor(el)
  }
}

function processIfConditions (el, parent) {
  const prev = findPrevElement(parent.children)
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    })
  } else if (true) {
    warn(
      `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
      `used on element <${el.tag}> without corresponding v-if.`,
      el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
    )
  }
}

function findPrevElement (children){ //找到上一个元素
  let i = children.length
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (true && children[i].text !== ' ') {
        warn(
          `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
          `will be ignored.`,
          children[i]
        )
      }
      children.pop()
    }
  }
}


function processSlotContent (el) {
  let slotScope
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope')
    /* istanbul ignore if */
    if (true && slotScope) {
      warn(
        `the "scope" attribute for scoped slots have been deprecated and ` +
        `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
        `can also be used on plain elements in addition to <template> to ` +
        `denote scoped slots.`,
        el.rawAttrsMap['scope'],
        true
      )
    }
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    /* istanbul ignore if */
    if (true && el.attrsMap['v-for']) {
      warn(
        `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
        `(v-for takes higher priority). Use a wrapper <template> for the ` +
        `scoped slot to make it clearer.`,
        el.rawAttrsMap['slot-scope'],
        true
      )
    }
    el.slotScope = slotScope
  }

  // slot="xxx"
  const slotTarget = getBindingAttr(el, 'slot')
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
    }
  }

  // 2.6 v-slot syntax
  // if (process.env.NEW_SLOT_SYNTAX) {
  //   if (el.tag === 'template') {
  //     // v-slot on <template>
  //     const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
  //     if (slotBinding) {
  //       if (process.env.NODE_ENV !== 'production') {
  //         if (el.slotTarget || el.slotScope) {
  //           warn(
  //             `Unexpected mixed usage of different slot syntaxes.`,
  //             el
  //           )
  //         }
  //         if (el.parent && !maybeComponent(el.parent)) {
  //           warn(
  //             `<template v-slot> can only appear at the root level inside ` +
  //             `the receiving component`,
  //             el
  //           )
  //         }
  //       }
  //       const { name, dynamic } = getSlotName(slotBinding)
  //       el.slotTarget = name
  //       el.slotTargetDynamic = dynamic
  //       el.slotScope = slotBinding.value || emptySlotScopeToken // force it into a scoped slot for perf
  //     }
  //   } else {
  //     // v-slot on component, denotes default slot
  //     const slotBinding = getAndRemoveAttrByRegex(el, slotRE)
  //     if (slotBinding) {
  //       if (process.env.NODE_ENV !== 'production') {
  //         if (!maybeComponent(el)) {
  //           warn(
  //             `v-slot can only be used on components or <template>.`,
  //             slotBinding
  //           )
  //         }
  //         if (el.slotScope || el.slotTarget) {
  //           warn(
  //             `Unexpected mixed usage of different slot syntaxes.`,
  //             el
  //           )
  //         }
  //         if (el.scopedSlots) {
  //           warn(
  //             `To avoid scope ambiguity, the default slot should also use ` +
  //             `<template> syntax when there are other named slots.`,
  //             slotBinding
  //           )
  //         }
  //       }
  //       // add the component's children to its default slot
  //       const slots = el.scopedSlots || (el.scopedSlots = {})
  //       const { name, dynamic } = getSlotName(slotBinding)
  //       const slotContainer = slots[name] = createASTElement('template', [], el)
  //       slotContainer.slotTarget = name
  //       slotContainer.slotTargetDynamic = dynamic
  //       slotContainer.children = el.children.filter((c: any) => {
  //         if (!c.slotScope) {
  //           c.parent = slotContainer
  //           return true
  //         }
  //       })
  //       slotContainer.slotScope = slotBinding.value || emptySlotScopeToken
  //       // remove children as they are returned from scopedSlots now
  //       el.children = []
  //       // mark el non-plain so data gets generated
  //       el.plain = false
  //     }
  //   }
  // }
}


function processSlotOutlet (el) {
  // if (el.tag === 'slot') {
  //   el.slotName = getBindingAttr(el, 'name')
  //   if (true && el.key) {
  //     warn(
  //       `\`key\` does not work on <slot> because slots are abstract outlets ` +
  //       `and can possibly expand into multiple elements. ` +
  //       `Use the key on a wrapping element instead.`,
  //       getRawBindingAttr(el, 'key')
  //     )
  //   }
  // }
}


function processComponent (el) {
  // let binding
  // if ((binding = getBindingAttr(el, 'is'))) {
  //   el.component = binding
  // }
  // if (getAndRemoveAttr(el, 'inline-template') != null) {
  //   el.inlineTemplate = true
  // }
}


function processAttrs (el) {
  const list = el.attrsList
  let i, l, name, rawName, value, modifiers, syncGen, isDynamic
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name
    value = list[i].value
    if (dirRE.test(name)) {
  //     // mark element as dynamic
      // el.hasBindings = true
      // // modifiers
      // modifiers = parseModifiers(name.replace(dirRE, ''))
      // // support .foo shorthand syntax for the .prop modifier
      // if (process.env.VBIND_PROP_SHORTHAND && propBindRE.test(name)) {
      //   (modifiers || (modifiers = {})).prop = true
      //   name = `.` + name.slice(1).replace(modifierRE, '')
      // } else if (modifiers) {
      //   name = name.replace(modifierRE, '')
      // }
      // if (bindRE.test(name)) { // v-bind
      //   name = name.replace(bindRE, '')
      //   value = parseFilters(value)
      //   isDynamic = dynamicArgRE.test(name)
      //   if (isDynamic) {
      //     name = name.slice(1, -1)
      //   }
      //   if (
      //     process.env.NODE_ENV !== 'production' &&
      //     value.trim().length === 0
      //   ) {
      //     warn(
      //       `The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`
      //     )
      //   }
      //   if (modifiers) {
      //     if (modifiers.prop && !isDynamic) {
      //       name = camelize(name)
      //       if (name === 'innerHtml') name = 'innerHTML'
      //     }
      //     if (modifiers.camel && !isDynamic) {
      //       name = camelize(name)
      //     }
      //     if (modifiers.sync) {
      //       syncGen = genAssignmentCode(value, `$event`)
      //       if (!isDynamic) {
      //         addHandler(
      //           el,
      //           `update:${camelize(name)}`,
      //           syncGen,
      //           null,
      //           false,
      //           warn,
      //           list[i]
      //         )
      //         if (hyphenate(name) !== camelize(name)) {
      //           addHandler(
      //             el,
      //             `update:${hyphenate(name)}`,
      //             syncGen,
      //             null,
      //             false,
      //             warn,
      //             list[i]
      //           )
      //         }
      //       } else {
      //         // handler w/ dynamic event name
      //         addHandler(
      //           el,
      //           `"update:"+(${name})`,
      //           syncGen,
      //           null,
      //           false,
      //           warn,
      //           list[i],
      //           true // dynamic
      //         )
      //       }
      //     }
      //   }
      //   if ((modifiers && modifiers.prop) || (
      //     !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
      //   )) {
      //     addProp(el, name, value, list[i], isDynamic)
      //   } else {
      //     addAttr(el, name, value, list[i], isDynamic)
      //   }
      // } else if (onRE.test(name)) { // v-on
      //   name = name.replace(onRE, '')
      //   isDynamic = dynamicArgRE.test(name)
      //   if (isDynamic) {
      //     name = name.slice(1, -1)
      //   }
      //   addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic)
      // } else { // normal directives
      //   name = name.replace(dirRE, '')
      //   // parse arg
      //   const argMatch = name.match(argRE)
      //   let arg = argMatch && argMatch[1]
      //   isDynamic = false
      //   if (arg) {
      //     name = name.slice(0, -(arg.length + 1))
      //     if (dynamicArgRE.test(arg)) {
      //       arg = arg.slice(1, -1)
      //       isDynamic = true
      //     }
      //   }
      //   addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i])
      //   if (process.env.NODE_ENV !== 'production' && name === 'model') {
      //     checkForAliasModel(el, value)
      //   }
      // }
    } else { //属性
      // literal attribute
      // if (true) {
      //   const res = parseText(value, delimiters)
      //   if (res) {
      //     warn(
      //       `${name}="${value}": ` +
      //       'Interpolation inside attributes has been removed. ' +
      //       'Use v-bind or the colon shorthand instead. For example, ' +
      //       'instead of <div id="{{ val }}">, use <div :id="val">.',
      //       list[i]
      //     )
      //   }
      // }
      addAttr(el, name, JSON.stringify(value), list[i])
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      // if (!el.component &&
      //     name === 'muted' &&
      //     platformMustUseProp(el.tag, el.attrsMap.type, name)) {
      //   addProp(el, name, 'true', list[i])
      // }
    }
  }
}
