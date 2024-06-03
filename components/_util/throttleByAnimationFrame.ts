import raf from 'rc-util/lib/raf';

function throttleByAnimationFrame<T extends unknown[]>(fn: (...args: T) => void) {
  let requestId: number | null;

  const later = (args: T) => () => {
    requestId = null;
    fn(...args);
  };

  const throttled = (...args: T) => {
    if (requestId == null) {
      requestId = raf(later(args));
    }
  };

  throttled.cancel = () => {
    if (requestId !== null) {
      raf.cancel(requestId);
      requestId = null;
    }
  };

  return throttled;
}

export default throttleByAnimationFrame;
