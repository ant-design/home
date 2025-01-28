import React from 'react';
import { render } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';

import { MasonryProps } from '../interface';
import Masonry from '../Masonry';

// Mock for `responsiveObserve` to test `unsubscribe` call
jest.mock('../../_util/responsiveObserver', () => {
  const modules = jest.requireActual('../../_util/responsiveObserver');
  const originHook = modules.default;

  const useMockResponsiveObserver = (...args: any[]) => {
    const entity = originHook(...args);
    if (!entity.unsubscribe.mocked) {
      const originUnsubscribe = entity.unsubscribe;
      entity.unsubscribe = (...uArgs: any[]) => {
        const inst = global as any;
        inst.unsubscribeCnt = (inst.unsubscribeCnt || 0) + 1;

        originUnsubscribe.call(entity, ...uArgs);
      };
      entity.unsubscribe.mocked = true;
    }

    return entity;
  };

  return {
    ...modules,
    __esModule: true,
    default: useMockResponsiveObserver,
  };
});

describe('Masonry gutter', () => {
  const getGutter = (container: HTMLElement) => {
    const elements = container.querySelectorAll('.ant-masonry > *');
    const firstElement = elements[0] as HTMLElement;
    const firstStyle = window.getComputedStyle(firstElement);

    const secondElement = elements[1] as HTMLElement;
    const secondStyle = window.getComputedStyle(secondElement);

    const thirdElement = elements[2] as HTMLElement;
    const thirdStyle = window.getComputedStyle(thirdElement);

    // Because the second element is shorter than the first one, so the third element will be placed below the second one
    const verticalSpacing =
      parseFloat(thirdStyle.getPropertyValue('--ant-masonry-item-translate-y')) -
      parseFloat(secondStyle.getPropertyValue('--ant-masonry-item-height'));

    const horizontalSpacing =
      parseFloat(secondStyle.getPropertyValue('--ant-masonry-item-translate-x')) -
      parseFloat(firstStyle.getPropertyValue('--ant-masonry-item-width'));

    return {
      verticalSpacing,
      horizontalSpacing,
    };
  };

  beforeAll(() => {
    spyElementPrototypes(HTMLElement, {
      clientHeight: {
        get() {
          if ((this as HTMLElement).getAttribute('data-height')) {
            return parseFloat((this as HTMLElement).getAttribute('data-height')!);
          }
          return 100;
        },
      },
      clientWidth: {
        get() {
          if ((this as HTMLElement).classList.contains('ant-masonry')) {
            return 820; // container width
          }
          return 273.33; // default width for other elements
        },
      },
    });
  });

  beforeEach(() => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(min-width: 1200px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(min-width: 1200px)',
        }) as any,
    );
    (global as any).unsubscribeCnt = 0;
  });

  const DemoMasonry = ({ columns, gutter, sequential }: Omit<MasonryProps, 'items'>) => {
    const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];

    const items = heights.map((height, index) => ({
      key: `item-${index}`,
      height,
      render: () => <div style={{ height }}>{index + 1}</div>,
    }));

    return (
      <div
        style={{
          width: '820px',
        }}
      >
        <Masonry columns={columns} gutter={gutter} sequential={sequential} items={items} />
      </div>
    );
  };

  it('should handle gutter prop', () => {
    const { container } = render(<DemoMasonry columns={2} gutter={16} />);

    const { verticalSpacing, horizontalSpacing } = getGutter(container);

    expect(horizontalSpacing).toBe(16);
    expect(verticalSpacing).toBe(16);
  });

  it('should handle array gutter', () => {
    const { container } = render(<DemoMasonry columns={2} gutter={[8, 16]} />);

    const { verticalSpacing, horizontalSpacing } = getGutter(container);

    expect(horizontalSpacing).toBe(8);
    expect(verticalSpacing).toBe(16);
  });

  it('should handle responsive gutter', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          addListener: (cb: (e: { matches: boolean }) => void) => {
            cb({ matches: query === '(min-width: 576px)' });
          },
          removeListener: jest.fn(),
          matches: query === '(min-width: 576px)',
        }) as any,
    );

    const { container } = render(<DemoMasonry columns={2} gutter={{ sm: 8, md: 16 }} />);

    const { verticalSpacing, horizontalSpacing } = getGutter(container);

    expect(horizontalSpacing).toBe(8);
    expect(verticalSpacing).toBe(8);
  });

  it('should handle responsive gutter with array', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          addListener: jest.fn(),
          removeListener: jest.fn(),
          matches: query === '(min-width: 576px)',
        }) as any,
    );

    const { container } = render(<DemoMasonry columns={2} gutter={[{ sm: 8, md: 32 }, 16]} />);

    const { verticalSpacing, horizontalSpacing } = getGutter(container);

    expect(horizontalSpacing).toBe(8);
    expect(verticalSpacing).toBe(16);
  });

  it('should handle gutter fallback', () => {
    const { container, rerender } = render(<DemoMasonry columns={2} gutter={[{}, 40]} />);

    {
      const { verticalSpacing, horizontalSpacing } = getGutter(container);

      expect(horizontalSpacing).toBe(0);
      expect(verticalSpacing).toBe(40);
    }

    rerender(<DemoMasonry columns={2} gutter={[40, {}]} />);

    {
      const { verticalSpacing, horizontalSpacing } = getGutter(container);

      expect(verticalSpacing).toBe(40);
      expect(horizontalSpacing).toBe(40);
    }

    rerender(<DemoMasonry columns={2} />);

    {
      const { verticalSpacing, horizontalSpacing } = getGutter(container);

      expect(horizontalSpacing).toBe(0);
      expect(verticalSpacing).toBe(0);
    }
  });
});
