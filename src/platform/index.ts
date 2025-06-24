export { Build } from './testing-build';
export { modeResolutionChain, styles } from './testing-constants';
export { getHostRef, registerHost, registerInstance } from './testing-host-ref';
export { consoleDevError, consoleDevInfo, consoleDevWarn, consoleError, setErrorHandler } from './testing-log';
export { getBuildFeatures } from '../runtime';
export {
  isMemberInElement,
  plt,
  registerComponents,
  registerModule,
  resetPlatform,
  setPlatformHelpers,
  setSupportsShadowDom,
  startAutoApplyChanges,
  stopAutoApplyChanges,
  supportsConstructableStylesheets,
  supportsListenerOptions,
  supportsShadow,
} from './testing-platform';
export { flushAll, flushLoadModule, flushQueue, loadModule, nextTick, readTask, writeTask } from './testing-task-queue';
export { win } from './testing-window';
let scopedSSR: boolean = false;
export const setScopedSSR = (scoped?: boolean) => {
  scopedSSR = !!scoped;
};
export const needsScopedSSR = () => scopedSSR;
