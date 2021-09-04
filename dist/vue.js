(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

let initProxy;

initProxy = function initProxy (vm) {
  vm._renderProxy = vm;
};

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
    debugger
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
    console.log('asdvnode', vnode);
    return vnode
  }
}

function initRender (vm) {
  const options = vm.$options;
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);
}
function renderMixin (Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    const { render, _parentVnode } = vm.$options;
    debugger
    vm.$vnode = _parentVnode;

    let vnode;
    vnode = render.call(vm._renderProxy, vm.$createElement);
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
    debugger
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

    
  }
  return mount.call(this, el, hydrating)
};

return Vue;

})));
