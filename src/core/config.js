import {
  identity,
  no
} from '../shared/util'
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
  parsePlatformTagName: identity
})