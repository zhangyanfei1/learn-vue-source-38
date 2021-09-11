/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
 import {
  handleError
} from '../util/index'
import { queueWatcher } from './scheduler'
 import Dep, { pushTarget, popTarget } from './dep'
 export default class Watcher {
  constructor (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm
    this.deps = []
    this.active = true
    this.newDeps = []
    this.newDepIds = new Set()
    this.depIds = new Set()
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {

    }

    this.value = this.lazy
      ? undefined
      : this.get()

  }

  get () {
    pushTarget(this) //当前渲染watcher
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm) //TODO
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        // traverse(value)
      }
      popTarget()
      // this.cleanupDeps()
    }
    return value
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
   update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }

  addDep (dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  run () {
    if (this.active) {
      const value = this.get()
      // if () {

      // }
    }
  }

  teardown () {
    
  }
 }