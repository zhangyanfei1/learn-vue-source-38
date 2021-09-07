import {
  nextTick
} from '../util/index'
const queue = []
let has = {}
let waiting = false
let flushing = false
let index = 0

function flushSchedulerQueue () {
  let watcher, id
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
  }
}
export function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }

    if (!waiting) {
      waiting = true

      //启动异步任务
      nextTick(flushSchedulerQueue)
    }
  }
}