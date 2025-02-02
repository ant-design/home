import React from 'react';
import { getPixelRatio } from 'antd/es/watermark/utils';

import Watermark, { WatermarkProps } from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { render, waitFakeTimer } from '../../../tests/utils';
import Drawer from '../../drawer';
import Modal from '../../modal';
import Cache from '../cache';
import { cache as useClipsCache } from '../useClips';

describe('Watermark', () => {
  mountTest(Watermark);
  rtlTest(Watermark);

  const mockSrcSet = jest.spyOn(Image.prototype, 'src', 'set');

  beforeAll(() => {
    mockSrcSet.mockImplementation(function fn() {
      // @ts-ignore
      this.onload?.();
    });
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    mockSrcSet.mockRestore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('The watermark should render successfully', () => {
    const { container } = render(<Watermark className="watermark" content="Ant Design" />);
    expect(container.querySelector('.watermark div')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('The offset should be correct', () => {
    const { container } = render(
      <Watermark
        className="watermark"
        offset={[200, 200]}
        content={['Ant Design', 'Ant Design Pro']}
      />,
    );
    const target = container.querySelector<HTMLDivElement>('.watermark div');
    expect(target?.style.left).toBe('150px');
    expect(target?.style.top).toBe('150px');
    expect(target?.style.width).toBe('calc(100% - 150px)');
    expect(target?.style.height).toBe('calc(100% - 150px)');
    expect(container).toMatchSnapshot();
  });

  it('Interleaved watermark backgroundSize is correct', () => {
    const { container } = render(
      <Watermark
        className="watermark"
        width={200}
        height={200}
        content="Ant Design"
        gap={[100, 100]}
      />,
    );
    const target = container.querySelector<HTMLDivElement>('.watermark div');
    expect(target?.style.backgroundSize).toBe('720px');
    expect(container).toMatchSnapshot();
  });

  it('Image watermark snapshot', () => {
    const { container } = render(
      <Watermark image="https://gw.alipayobjects.com/zos/bmw-prod/59a18171-ae17-4fc5-93a0-2645f64a3aca.svg" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('Invalid image watermark', () => {
    mockSrcSet.mockImplementation(function fn() {
      // @ts-ignore
      this.onerror?.();
    });
    const { container } = render(
      <Watermark className="watermark" content="Ant Design" image="https://test.svg" />,
    );
    expect(container.querySelector('.watermark div')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('MutationObserver should work properly', async () => {
    const { container } = render(<Watermark className="watermark" content="MutationObserver" />);
    const target = container.querySelector<HTMLDivElement>('.watermark div');
    await waitFakeTimer();
    target?.remove();
    await waitFakeTimer();
    expect(container).toMatchSnapshot();
  });

  describe('Observe the modification of style', () => {
    it('watermark', async () => {
      const { container } = render(
        <Watermark offset={[-200, -200]} className="watermark" content="MutationObserver" />,
      );
      const target = container.querySelector<HTMLDivElement>('.watermark div');
      await waitFakeTimer();
      target?.setAttribute('style', '');
      await waitFakeTimer();
      expect(container).toMatchSnapshot();
    });

    it('container', async () => {
      const { container } = render(
        <Watermark offset={[-200, -200]} className="watermark" content="MutationObserver" />,
      );

      const target = container.querySelector<HTMLDivElement>('.watermark');
      await waitFakeTimer();
      target?.setAttribute('style', '');
      await waitFakeTimer();

      expect(target).toHaveStyle({
        overflow: 'hidden',
      });
    });
  });

  describe('nest component', () => {
    function test(name: string, children: React.ReactNode, getWatermarkElement: () => Node) {
      it(name, async () => {
        const { rerender } = render(<Watermark className="test">{children}</Watermark>);
        await waitFakeTimer();

        const watermark = getWatermarkElement();

        expect(watermark).toHaveStyle({ zIndex: '9' });

        // Not crash when children removed
        rerender(<Watermark className="test" />);
      });
    }

    test(
      'Modal',
      <Modal open />,
      () => document.body.querySelector('.ant-modal-content')!.lastChild!,
    );

    test(
      'Drawer',
      <Drawer open />,
      () => document.body.querySelector('.ant-drawer-content')!.lastChild!,
    );

    it('inherit = false', async () => {
      render(
        <Watermark inherit={false}>
          <Drawer open />
        </Watermark>,
      );
      await waitFakeTimer();

      expect(document.body.querySelector('.ant-drawer-content')!.lastChild).toHaveClass(
        'ant-drawer-body',
      );
    });
  });

  it('should not crash if content is empty string', async () => {
    const spy = jest.spyOn(CanvasRenderingContext2D.prototype, 'drawImage');
    render(<Watermark content="" className="watermark" />);
    await waitFakeTimer();
    expect(spy).not.toHaveBeenCalledWith(expect.anything(), 0, 0);
    expect(spy).not.toHaveBeenCalledWith(expect.anything(), -0, 0);
    expect(spy).not.toHaveBeenCalledWith(expect.anything(), -0, -0);
    expect(spy).not.toHaveBeenCalledWith(expect.anything(), 0, -0);
    spy.mockRestore();
  });

  it('should generate keys correctly for primitive values', async () => {
    expect(Cache.generateKey(123, 'test', true)).toBe('123,"test",true');
  });

  it('should generate keys correctly for objects and arrays', async () => {
    expect(Cache.generateKey({ a: 1 }, [1, 2, 3])).toBe('{"a":1},[1,2,3]');
  });

  it('should generate keys correctly for Error', async () => {
    expect(
      Cache.generateKey(
        {
          value: null,
          toString: null,
          toJSON() {
            // 在序列化时抛出错误
            throw new Error('Serialization error');
          },
        },
        'a',
        1,
      ),
    ).toBe(',"a",1');
  });

  it('should handle JSON.stringify errors gracefully', async () => {
    const circularObj: any = {};
    circularObj.self = circularObj;
    expect(Cache.generateKey(circularObj)).toBe('[object Object]');
  });

  it('should retrieve value from cache correctly', async () => {
    const cache = new Cache();
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return undefined for non-existent keys', async () => {
    const cache = new Cache();
    expect(cache.get('nonExistentKey')).toBeUndefined();
  });

  it('should retrieve value', async () => {
    const key = Cache.generateKey(1, 2, 3, [1, 2, 3]);
    const value = 'value';
    const cache = new Cache();
    cache.set(key, value);
    expect(cache.get(key)).toBe(value);
  });

  it('should set watermark in cache if not available', async () => {
    const font: WatermarkProps['font'] = {
      color: 'rgba(0, 0, 0, 0.15)',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      textAlign: 'center',
    };
    const content = 'antd-watermark';
    const width = 100;
    const height = 120;
    const rotate = 10;
    const gapX = 13;
    const gapY = 45;
    const key = Cache.generateKey(
      content,
      rotate,
      getPixelRatio(),
      width,
      height,
      font,
      gapX,
      gapY,
    );
    expect(useClipsCache.get(key)).toBeUndefined();
    const { container } = render(
      <Watermark
        content={content}
        rotate={rotate}
        width={width}
        height={height}
        font={font}
        gap={[gapX, gapY]}
      />,
    );
    await waitFakeTimer();
    expect(container).toMatchSnapshot();
    // fCanvas.toDataURL()
    expect(useClipsCache.get(key)?.[0]).toBeTruthy();
    // filledWidth / ratio
    expect(useClipsCache.get(key)?.[1]).toBeTruthy();
    // filledHeight / ratio
    expect(useClipsCache.get(key)?.[2]).toBeTruthy();
  });

  it('should set watermark from cache correctly', async () => {
    const content = 'should set watermark from cache correctly';

    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('1');

    const { container: container1 } = render(<Watermark content={content} />);
    await waitFakeTimer();
    expect(container1).toMatchSnapshot();

    jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('2');

    const { container: container2 } = render(<Watermark content={content} />);
    await waitFakeTimer();
    expect(container2).toMatchSnapshot();

    HTMLCanvasElement.prototype.toDataURL.mockRestore();
  });
});
