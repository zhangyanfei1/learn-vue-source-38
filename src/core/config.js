import {
  identity,
  no
} from '../shared/util'

import { LIFECYCLE_HOOKS } from '../shared/constants'

export default ({
  optionMergeStrategies: Object.create(null),
  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
   isReservedTag: no,
     /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,
  warnHandler: null,
  silent: false,
  _lifecycleHooks: LIFECYCLE_HOOKS,
  performance: false
})