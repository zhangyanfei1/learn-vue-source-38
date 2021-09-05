(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

let initProxy;

initProxy = function initProxy (vm) {
  vm._renderProxy = vm;
};

function noop (a, b, c) {}

function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Always return false.
 */
 const no = (a, b, c) => {
   return (a === 'div' || a === 'h1')
 };

 /**
 * Return the same value.
 */
const identity = (_) => _;


const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}


/**
 * Camelize a hyphen-delimited string.
 */
//  const camelizeRE = /-(\w)/g
//  export const camelize = cached((str) => {
//    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
//  })

 /**
 * Capitalize a string.
 */
// export const capitalize = cached((str) => {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// })

function isObject (obj){
  return obj !== null && typeof obj === 'object'
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
 function makeMap (
  str,
  expectsLowerCase
) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

const _toString = Object.prototype.toString;

function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

function isReserved (str) {
  const c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

const inBrowser = typeof window !== 'undefined';

var config = ({
  optionMergeStrategies: Object.create(null),
  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
   isReservedTag: no,
     /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity
})

function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  // const camelizedId = camelize(id)
  // if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  // const PascalCaseId = capitalize(camelizedId)
  // if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // // fallback to prototype chain
  // const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  // return res
}


const strats = config.optionMergeStrategies;

/**
 * Default strategy.
 */
 const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

function mergeOptions (
  parent,
  child,
  vm
) {
  const options = {};
  let key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);   //当 子的options中的key没有的话就取父元素的
  }
  return options
}

function handleError (err, vm, info) {
  console.log('handleError');
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}


function initState (vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
}

function initData (vm) {
  let data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
  const keys = Object.keys(data);
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (!isReserved(key)) {
      proxy(vm, `_data`, key);
    }
  }

}

function getData (data, vm){
  // #7573 disable dep collection when invoking data getters
  // pushTarget()
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`);
    return {}
  } finally {
    // popTarget()
  }
}

class VNode {
  constructor (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.componentOptions = componentOptions;
    this.asyncFactory = asyncFactory;
  }
}

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
 class Watcher {
  constructor (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    expOrFn();
  }
 }

let activeInstance = null;

function setActiveInstance(vm) {
  const prevActiveInstance = activeInstance;
  activeInstance = vm;
  return () => {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  const options = vm.$options;
  let parent = options.parent;
  if (parent && !options.abstract) {
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    const vm = this;
    const prevEl = vm.$el;
    const prevVnode = vm._vnode;
    const restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  let updateComponent;
  updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };

  new Watcher(vm, updateComponent, noop, {}, true);
  return vm
}

const componentVNodeHooks = {
  init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      // const mountedNode = vnode // work around flow
      // componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  prepatch (oldVnode, vnode) {

  },

  insert (vnode) {

  },

  destroy (vnode) {

  }
    
};

const hooksToMerge = Object.keys(componentVNodeHooks);

function installComponentHooks (data) {
  const hooks = data.hook || (data.hook = {});
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i];
    const existing = hooks[key];
    const toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = toMerge;
    }
  }
}

// function mergeHook (f1, f2) {
//   const merged = (a, b) => {
//     // flow complains about extra args which is why we use any
//     f1(a, b)
//     f2(a, b)
//   }
//   merged._merged = true
//   return merged
// }

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }
  const baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  data = data || {};
  const propsData = '';
  const listeners = data.on;

  let asyncFactory;
  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // resolveConstructorOptions(Ctor)

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  const name = Ctor.options.name || tag;
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    {Ctor, propsData, listeners, tag, children},
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (vnode, parent){
  const options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  };
  //TODO
  

  return new vnode.componentOptions.Ctor(options)
}

function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function normalizeArrayChildren (children, nestedIndex) {
  const res = [];
  let i, c;
  for (i = 0; i < children.length; i++) {
    c = children[i];

    if (Array.isArray(c)) {

    } else if (isPrimitive(c)) {

    } else {
      res.push(c);
    }
  }
  return res
}

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;

function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
){
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {

  }

  let vnode;
  if (typeof tag === 'string') {
    let Ctor;
    if (config.isReservedTag(tag)) {
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
    return vnode
  }
}

function installRenderHelpers (target) {
  target._s = toString;
  target._v = createTextVNode;
}

function initRender (vm) {
  const options = vm.$options;

  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}
function renderMixin (Vue) {
  installRenderHelpers(Vue.prototype);

  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;
    vm.$vnode = _parentVnode;

    let vnode;
    vnode = render.call(vm._renderProxy, vm.$createElement);
    debugger
    vnode.parent = _parentVnode;
    return vnode
  };
}

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    if (options && options._isComponent) {
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    initProxy(vm);

    initLifecycle(vm); 
    initRender(vm);

    initState(vm);

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  const opts = vm.$options = Object.create(vm.constructor.options);
  const parentVnode = options._parentVnode; //父组件vnode
  opts.parent = options.parent; //父组件实例
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  let options = Ctor.options;
  //TODO
  return options
}

function Vue (options) {
  this._init(options);
}

initMixin(Vue); //原型上挂载_init 方法
// stateMixin(Vue)
// eventsMixin(Vue) //原型上挂载 $on $once $off $emit
lifecycleMixin(Vue); //挂载 _update  $forceUpdate   $destroy   方法
renderMixin(Vue); //挂载 $nextTick  _render  方法

function initExtend (Vue) {

  Vue.cid = 0;
  let cid = 1;

  Vue.extend = function (extendOptions){
    extendOptions = extendOptions || {};
    const Super = this;
    const SuperId = Super.cid;
    // const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    // if (cachedCtors[SuperId]) {
    //   return cachedCtors[SuperId]
    // }

    const Sub = function VueComponent (options) {
      this._init(options);
    };

    //相当于构建一个子类
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );

    return Sub
  };
}

function initGlobalAPI (Vue) {
  Vue.options = Object.create(null);
  Vue.options._base = Vue;

  initExtend(Vue);
}

initGlobalAPI(Vue);

function createElement$1 (tagName, vnode) {
  const elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  return elm
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function tagName (node) {
  return node.tagName
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function appendChild (node, child) {
  node.appendChild(child);
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

var nodeOps = Object.freeze({
	createElement: createElement$1,
	createTextNode: createTextNode,
	tagName: tagName,
	parentNode: parentNode,
	nextSibling: nextSibling,
	appendChild: appendChild,
	insertBefore: insertBefore
});

function sameVnode (a, b) {
  
}

function createPatchFunction (backend) {

  const { modules, nodeOps } = backend;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {

    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }
    const data = vnode.data;
    const children = vnode.children;
    const tag = vnode.tag;
    if (isDef(tag)) {
      vnode.elm = nodeOps.createElement(tag, vnode);
      createChildren(vnode, children, insertedVnodeQueue);
      insert(parentElm, vnode.elm, refElm);
    } else if (isTrue(vnode.isComment)) {

    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data;
    if (isDef(i)) {
      const isReactivated = isDef(vnode.componentInstance);
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      //TODO
    }
    vnode.elm = vnode.componentInstance.$el;
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (nodeOps.parentNode(ref) === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      return
    }

    const insertedVnodeQueue = [];
    if (isUndef(oldVnode)) {
      createElm(vnode, insertedVnodeQueue);
    } else {
      const isRealElement = isDef(oldVnode.nodeType);
      // 新 旧 节点相同
      if (!isRealElement && sameVnode(oldVnode, vnode)) {

      } else {
        if (isRealElement) {
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        const oldElm = oldVnode.elm;
        const parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          parentElm,
          nodeOps.nextSibling(oldElm)
        );
      }
    }
    return vnode.elm
  }
}

const modules = '';

const patch = createPatchFunction({ nodeOps, modules });

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
){
  return mountComponent(this, el, hydrating)
};

/**
 * Query an element selector if it's not an element already.
 */
 function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el);
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

const isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

function baseWarn (msg, range) {
  console.error(`[Vue compiler]: ${msg}`);
}

function pluckModuleFunction (
  modules,
  key
){
  return modules
    ? modules.map(m => m[key]).filter(_ => _)
    : []
}


function getAndRemoveAttr (
  el,
  name,
  removeFromMap
){
  let val;
  if ((val = el.attrsMap[name]) != null) {
    const list = el.attrsList;
    for (let i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

function transformNode (el, options) {
  const warn = options.warn || baseWarn;
  const staticClass = getAndRemoveAttr(el, 'class');
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
}

function genData (el) {
  let data = '';
  if (el.staticClass) {
    data += `staticClass:${el.staticClass},`;
  }
  if (el.classBinding) {
    data += `class:${el.classBinding},`;
  }
  return data
}

var klass = {
  transformNode,
  genData
}

function genData$1 (el) {
  let data = '';
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`;
  }
  if (el.styleBinding) {
    data += `style:(${el.styleBinding}),`;
  }
  return data
}
var style = {
  genData: genData$1
}

var model = {
  
}

var modules$1 = [
  klass,
  style,
  model
]

const baseOptions = {
  modules: modules$1,
  isUnaryTag
};

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  //entry-runtime  中的  compileToFunctions，（生成render、staticRenderFns函数）
  return function compileToFunctions (template, options, vm){
    const compiled = compile(template, options);
    const res = {};
    const fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = {}; // TODO
    return res
  }
}

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (template, options){
      const finalOptions = Object.create(baseOptions);
      if (options) {
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }
      const compiled = baseCompile(template.trim(), finalOptions);
      return compiled
    }
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;
// Special Elements (can contain anything)
const isPlainTextElement = makeMap('script,style,textarea', true);

const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, match => decodingMap[match])
}

function parseHTML (html, options) {
  const stack = [];
  const expectHTML = options.expectHTML;
  const isUnaryTag = options.isUnaryTag || no;
  let index = 0;
  let last, lastTag;
  while (html) {
    last = html;
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }
            advance(commentEnd + 3);
            continue
          }
        }

        if (conditionalComment.test(html)) {
          const conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          } 
        }

        // Doctype:
        const doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        const endTagMatch = html.match(endTag);
        if (endTagMatch) {
          const curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        const startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      let text, rest, next;
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) break
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }
      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {

    }
    if (html === last) {
      options.chars && options.chars(html);
      if (!stack.length && options.warn) {
        options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length });
      }
      break
    }
  }

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      let end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    const tagName = match.tagName;
    const unarySlash = match.unarySlash;

    const unary = isUnaryTag(tagName) || !!unarySlash;

    const l = match.attrs.length;
    const attrs = new Array(l);
    for (let i = 0; i < l; i++) {
      const args = match.attrs[i];
      const value = args[3] || args[4] || args[5] || '';
      const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
      if (options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }
    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    let pos, lowerCasedTagName;
    if (start == null) start = index;
    if (end == null) end = index;

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if ((i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            `tag <${stack[i].tag}> has no matching end tag.`,
            { start: stack[i].start, end: stack[i].end }
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

function parseFilters (exp){
  return exp
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const buildRegex = function () {

};

function parseText (
  text,
  delimiters
){
  const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  const tokens = [];
  const rawTokens = [];
  let lastIndex = tagRE.lastIndex = 0;
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    const exp = parseFilters(match[1].trim());
    tokens.push(`_s(${exp})`);
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/**
 * Convert HTML string to AST.
 */

 let warn;
 let delimiters;
 let transforms;

 function createASTElement (
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
  const map = {};
  for (let i = 0, l = attrs.length; i < l; i++) {
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

 function parse (template, options){
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  delimiters = options.delimiters;
  const stack = [];
  warn = options.warn || baseWarn;
  let root;
  let currentParent;
  let inVPre = false;

  function closeElement (element) {
    if (!inVPre && !element.processed) {
      element = processElement(element, options);
    }
  }
  parseHTML(template, {
    warn,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    shouldKeepComment: options.comments,
    start (tag, attrs, unary, start, end) {
      let element = createASTElement(tag, attrs, currentParent);
      if (!root) {
        root = element;
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },
    end (tag, start, end) {
      const element = stack[stack.length - 1];
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      if (options.outputSourceRange) {
        element.end = end;
      }
      closeElement(element);
    },
    chars (text, start, end) {
      const children = currentParent.children;
      if (text) {
        let res;
        let child;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text
          };
        } else if (text !== ' ' || !children.length) {
          child = {
            type: 3,
            text
          };
        }
        if (child) {
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          children.push(child);
        }
      }
    },
    comment (text, start, end) {
      if (currentParent) {
        const child = {
          type: 3,
          text,
          isComment: true
        };
        // if (options.outputSourceRange) {
        //   child.start = start
        //   child.end = end
        // }
        currentParent.children.push(child);
      }
    }
  });
  return root
 }

 function processElement (
  element,
  options
) {
  for (let i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  return element
}

class CodegenState {
  constructor (options) {
    this.options = options;
    this.transforms = pluckModuleFunction(options.modules, 'transformCode');
    this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  }
}

function generate (ast, options){
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  {
    let code;
    if (el.component) {

    } else {
      let data;
      {
        data = genData$2(el, state);
        console.log(data);
      }
      const children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`;
    }
    for (let i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
}

function genComment (comment) {
  return `_e(${JSON.stringify(comment.text)})`
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
){
  const children = el.children;
  if (children.length) {
    const el = children[0];
    const gen = altGenNode || genNode;
    return `[${children.map(c => gen(c, state)).join(',')}]`
  }
}

function genData$2 (el, state) {
  let data = '{';
  for (let i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  data = data.replace(/,$/, '') + '}';
  return data
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

const createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  const ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    //优化，静态化
    
  }
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

const { compile, compileToFunctions } = createCompiler(baseOptions);

let div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
){
  el = el && query(el);
  const options = this.$options;
  if (options._componentTag) {
    let render = function (h) {
      return h('div', '我是子组件')
    };
    options.render = render;
  }

  if (!options.render) { //只有在没有传入render的时候，才考虑使用模板
    let template = options.template;
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
        delimiters: options.delimiters
      }, this);
      options.render = render;
      options.staticRenderFns = staticRenderFns;
    }
  }
  return mount.call(this, el, hydrating)
};

return Vue;

})));
