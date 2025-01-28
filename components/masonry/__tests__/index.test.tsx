import React, { useEffect, useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';

import Masonry, { MasonryProps } from '..';
import { triggerResize, waitFakeTimer } from '../../../tests/utils';
import { MasonryItem } from '../interface';

const resizeMasonry = async () => {
  triggerResize(document.body.querySelector('.ant-masonry')!);
  await waitFakeTimer();
};

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

describe('Masonry', () => {
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

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const DemoMasonry = ({
    columns,
    gutter,
    sequential,
    keepAspectRatio,
  }: Omit<MasonryProps, 'items'>) => {
    const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];

    const items = heights.map((height, index) => ({
      key: `item-${index}`,
      height,
      render: () => (
        <div style={{ height, width: keepAspectRatio ? height * 1.5 : undefined }}>{index + 1}</div>
      ),
    }));

    return (
      <div
        style={{
          width: '820px',
        }}
      >
        <Masonry
          columns={columns}
          gutter={gutter}
          sequential={sequential}
          keepAspectRatio={keepAspectRatio}
          items={items}
        />
      </div>
    );
  };

  it('should render correctly', () => {
    const { container } = render(<DemoMasonry columns={3} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle responsive columns', async () => {
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

    const { container } = render(<DemoMasonry columns={{ xs: 1, sm: 2, md: 3 }} />);

    await resizeMasonry();

    const elements = container.querySelectorAll('.ant-masonry > *');
    const columnOrders = Array.from(elements).map((element) => element.getAttribute('data-column'));

    expect(columnOrders[0]).toBe('0');
    expect(columnOrders[1]).toBe('1');
    expect(columnOrders[2]).toBe('2');
  });

  it('should handle sequential layout', () => {
    const { container } = render(<DemoMasonry columns={2} sequential />);

    const columns = container.querySelectorAll('.ant-masonry > *');
    expect(columns[0].textContent).toBe('1');
    expect(columns[1].textContent).toBe('2');
    expect(columns[2].textContent).toBe('3');
    expect(columns[3].textContent).toBe('4');
  });

  it('should handle large columns', () => {
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

    const { container } = render(<DemoMasonry columns={{ xs: 1, sm: 2, md: 3 }} />);

    const elements = container.querySelectorAll('.ant-masonry > *');
    const columnOrders = Array.from(elements).map((element) => element.getAttribute('data-column'));

    expect(columnOrders[0]).toBe('0');
    expect(columnOrders[1]).toBe('1');
    expect(columnOrders[2]).toBe('2');
    expect(columnOrders[3]).not.toBe('3');
  });

  it('should handle keep aspect ratio', async () => {
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
          if ((this as HTMLElement).getAttribute('data-height')) {
            return parseFloat((this as HTMLElement).getAttribute('data-height')!) * 1.5;
          }
          return 273.33; // default width for other elements
        },
      },
    });
    const { container } = render(<DemoMasonry columns={3} keepAspectRatio />);

    await resizeMasonry();

    const elements = container.querySelectorAll('.ant-masonry > *');
    const firstElement = elements[0];
    const firstElementStyle = window.getComputedStyle(firstElement);
    const width = parseFloat(firstElementStyle.getPropertyValue('--ant-masonry-item-width'));
    const height = parseFloat(firstElementStyle.getPropertyValue('--ant-masonry-item-height'));

    expect(height).toBe(width / 1.5);
  });

  it('should not rearrage after removing item', async () => {
    const Component = () => {
      const [items, setItems] = useState<MasonryItem[]>([]);

      const removeItem = jest.fn((key: string) => {
        setItems((prev) => prev.filter((item) => item.key !== key));
      });

      useEffect(() => {
        setItems(
          [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80].map(
            (height, index) => ({
              key: `item-${index}`,
              height,
              render: () => (
                <div style={{ height }} onClick={() => removeItem(`item-${index}`)}>
                  {index + 1}
                </div>
              ),
            }),
          ),
        );
      }, []);

      return <Masonry columns={2} items={items} />;
    };
    const { container, getByText } = render(<Component />);

    const elements = container.querySelectorAll('.ant-masonry > *');
    expect(elements).toHaveLength(15);
    expect(elements[1].getAttribute('data-column')).toBe('1');

    // Simulate removing an item
    fireEvent.click(getByText('1'));
    await waitFor(() => {
      expect(container.querySelectorAll('.ant-masonry > *')).toHaveLength(14);
      expect(elements[1].getAttribute('data-column')).toBe('1');
    });
  });
});
