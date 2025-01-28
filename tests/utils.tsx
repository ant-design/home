import type { ReactElement } from 'react';
import React, { createRef, StrictMode } from 'react';
import { _rs as onEsResize } from '@rc-component/resize-observer/es/utils/observerUtil';
import { _rs as onLibResize } from '@rc-component/resize-observer/lib/utils/observerUtil';
import type { RenderOptions } from '@testing-library/react';
import { act, render } from '@testing-library/react';
import MockDate from 'mockdate';

export function assertsExist<T>(item?: T): asserts item is T {
  expect(item).not.toBeUndefined();
  expect(item).not.toBeNull();
}

export function setMockDate(dateString = '2017-09-18T03:30:07.795') {
  MockDate.set(dateString);
}

export function resetMockDate() {
  MockDate.reset();
}

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise((resolve) => {
      globalTimeout(resolve, timeout);
    });
  });
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: StrictMode, ...options });

export function renderHook<T>(func: () => T): { result: React.RefObject<T | null> } {
  const result = createRef<T>();

  const Demo: React.FC = () => {
    (result as any).current = func();

    return null;
  };

  customRender(<Demo />);

  return { result };
}

/**
 * Pure render like `@testing-lib` render which will not wrap with StrictMode.
 *
 * Please only use with render times times of memo usage case.
 */
const pureRender = render;

export { pureRender, customRender as render };

export const triggerResize = (target: Element) => {
  const originGetBoundingClientRect = target.getBoundingClientRect;

  target.getBoundingClientRect = () => ({ width: 510, height: 903 }) as DOMRect;

  act(() => {
    onLibResize([{ target } as ResizeObserverEntry]);
    onEsResize([{ target } as ResizeObserverEntry]);
  });

  target.getBoundingClientRect = originGetBoundingClientRect;
};

/**
 * Wait for a time delay. Will wait `advanceTime * times` ms.
 *
 * @param advanceTime Default 1000
 * @param times Default 20
 */
export async function waitFakeTimer(advanceTime = 1000, times = 20) {
  for (let i = 0; i < times; i += 1) {
    await act(async () => {
      await Promise.resolve();

      if (advanceTime > 0) {
        jest.advanceTimersByTime(advanceTime);
      } else {
        jest.runAllTimers();
      }
    });
  }
}

/**
 * Same as `waitFakeTimer` but to resolve React 19.
 * `act` warning
 */
export async function waitFakeTimer19(advanceTime = 1000) {
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    jest.advanceTimersByTime(advanceTime);
  });
}

export * from '@testing-library/react';
