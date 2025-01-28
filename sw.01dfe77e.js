/**
 * @license bippy
 *
 * Copyright (c) Aiden Bai, Million Software, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// src/sw.ts
(() => {
  try {
    const NO_OP = () => {
    };
    const renderers = /* @__PURE__ */ new Map();
    let id = 0;
    globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      checkDCE: NO_OP,
      supportsFiber: true,
      supportsFlight: true,
      hasUnsupportedRendererAttached: false,
      renderers,
      onCommitFiberRoot: NO_OP,
      onCommitFiberUnmount: NO_OP,
      onPostCommitFiberRoot: NO_OP,
      inject(renderer) {
        const nextID = ++id;
        renderers.set(nextID, renderer);
        globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__._instrumentationIsActive = true;
        return nextID;
      },
      _instrumentationIsActive: false
    };
  } catch {
  }
})();
