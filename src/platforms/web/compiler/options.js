import { isUnaryTag, canBeLeftOpenTag } from './util'
import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'
import modules from './modules/index'
import directives from './directives/index'
export const baseOptions = {
  modules,
  directives,
  isUnaryTag,
  isReservedTag,
  isPreTag,
  mustUseProp,
  getTagNamespace,
  canBeLeftOpenTag
} 