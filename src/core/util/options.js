import {
  hasOwn
  // camelize,
  // capitalize
} from '../../shared/util'
import {
  LIFECYCLE_HOOKS
} from '../../shared/constants'
import config from '../config'
export function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
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


const strats = config.optionMergeStrategies

/**
 * Default strategy.
 */
 const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

export function mergeOptions (
  parent,
  child,
  vm
) {
  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)   //当 子的options中的key没有的话就取父元素的
  }
  return options
}

function mergeHook (
  parentVal,
  childVal
) {
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) { //对hooks的一个去重
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})