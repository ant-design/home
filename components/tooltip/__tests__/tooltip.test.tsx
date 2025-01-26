import React from 'react';
import { spyElementPrototype } from 'rc-util/lib/test/domHook';

import type { TooltipPlacement } from '..';
import Tooltip from '..';
import getPlacements from '../../_util/placements';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import Button from '../../button';
import DatePicker from '../../date-picker';
import Input from '../../input';
import InputGroup from '../../input/Group';
import Radio from '../../radio';
import Switch from '../../switch';
import { isTooltipOpen } from './util';

describe('Tooltip', () => {
  mountTest(Tooltip);
  rtlTest(Tooltip);
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  beforeAll(() => {
    spyElementPrototype(HTMLElement, 'offsetParent', {
      get: () => ({}),
    });
  });

  it('check `onOpenChange` arguments', async () => {
    const onOpenChange = jest.fn();
    const ref = React.createRef<any>();

    const { container, rerender } = render(
      <Tooltip
        title=""
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
        ref={ref}
      >
        <div id="hello">Hello world!</div>
      </Tooltip>,
    );

    // `title` is empty.
    const divElement = container.querySelector('#hello');
    fireEvent.mouseEnter(divElement!);
    await waitFakeTimer();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();

    fireEvent.mouseLeave(divElement!);
    await waitFakeTimer();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();

    // update `title` value.
    rerender(
      <Tooltip
        title="Have a nice day!"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
        ref={ref}
      >
        <div id="hello">Hello world!</div>
      </Tooltip>,
    );
    fireEvent.mouseEnter(divElement!);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(isTooltipOpen()).toBeTruthy();
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

    fireEvent.mouseLeave(divElement!);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();

    // add `open` props.
    rerender(
      <Tooltip
        title="Have a nice day!"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
        ref={ref}
        open={false}
      >
        <div id="hello">Hello world!</div>
      </Tooltip>,
    );
    fireEvent.mouseEnter(divElement!);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const lastCount = onOpenChange.mock.calls.length;
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();

    // always trigger onOpenChange
    fireEvent.mouseLeave(divElement!);
    await waitFakeTimer();
    expect(onOpenChange.mock.calls.length).toBe(lastCount); // no change with lastCount
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();
  });

  it('should hide when mouse leave native disabled button', async () => {
    const onOpenChange = jest.fn();
    const ref = React.createRef<any>();

    const { container } = render(
      <Tooltip
        title="xxxxx"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
        ref={ref}
      >
        <button type="button" disabled>
          Hello world!
        </button>
      </Tooltip>,
    );

    const button = container.getElementsByTagName('button')[0];

    fireEvent.pointerEnter(button);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(isTooltipOpen()).toBeTruthy();
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

    fireEvent.pointerLeave(button);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();
  });

  describe('should hide when mouse leave antd disabled component', () => {
    function testComponent(name: string, Component: typeof Button | typeof Switch) {
      it(name, async () => {
        const onOpenChange = jest.fn();
        const ref = React.createRef<any>();
        const { container } = render(
          <Tooltip
            title="xxxxx"
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            onOpenChange={onOpenChange}
            ref={ref}
          >
            <Component disabled />
          </Tooltip>,
        );

        expect(container.children[0]).toMatchSnapshot();

        const button = container.getElementsByTagName('button')[0];

        fireEvent.pointerEnter(button);
        await waitFakeTimer();
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(isTooltipOpen()).toBeTruthy();
        expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

        fireEvent.pointerLeave(button);
        await waitFakeTimer();
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(isTooltipOpen()).toBeFalsy();
        expect(container.querySelector('.ant-tooltip-open')).toBeNull();
      });
    }

    testComponent('Button', Button);
    testComponent('Switch', Switch);
  });

  it('should render disabled Button style properly', () => {
    const { container: containerInline } = render(
      <Tooltip title="xxxxx">
        <Button disabled>Hello world!</Button>
      </Tooltip>,
    );
    const { container: containerBlock } = render(
      <Tooltip title="xxxxx">
        <Button disabled style={{ display: 'block' }}>
          Hello world!
        </Button>
      </Tooltip>,
    );
    expect(getComputedStyle(containerInline.querySelector('button')!)?.display).toBe('inline-flex');
    expect(getComputedStyle(containerBlock.querySelector('button')!)?.display).toBe('block');
  });

  it('should warn for arrowPointAtCenter', async () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Tooltip
        title="xxxxx"
        trigger="click"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        placement="bottomLeft"
        arrowPointAtCenter
        classNames={{ root: 'point-center-element' }}
      >
        <button type="button">Hello world!</button>
      </Tooltip>,
    );
    expect(warnSpy).toHaveBeenLastCalledWith(
      expect.stringContaining('`arrowPointAtCenter` is deprecated'),
    );

    render(
      <Tooltip
        title="xxxxx"
        trigger="click"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        placement="bottomLeft"
        arrow={{ arrowPointAtCenter: true }}
        classNames={{ root: 'point-center-element' }}
      >
        <button type="button">Hello world!</button>
      </Tooltip>,
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('`arrowPointAtCenter` in `arrow` is deprecated'),
    );
  });

  it('should works for date picker', async () => {
    const onOpenChange = jest.fn();
    const ref = React.createRef<any>();

    const { container } = render(
      <Tooltip title="date picker" onOpenChange={onOpenChange} ref={ref}>
        <DatePicker />
      </Tooltip>,
    );

    expect(container.getElementsByClassName('ant-picker')).toHaveLength(1);
    const picker = container.getElementsByClassName('ant-picker')[0];

    fireEvent.mouseEnter(picker);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(isTooltipOpen()).toBeTruthy();
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

    fireEvent.mouseLeave(picker);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();
  });

  it('should works for input group', async () => {
    const onOpenChange = jest.fn();
    const ref = React.createRef<any>();
    const { container } = render(
      <Tooltip title="hello" onOpenChange={onOpenChange} ref={ref}>
        <InputGroup>
          <Input style={{ width: '50%' }} />
          <Input style={{ width: '50%' }} />
        </InputGroup>
      </Tooltip>,
    );

    expect(container.getElementsByClassName('ant-input-group')).toHaveLength(1);
    const inputGroup = container.getElementsByClassName('ant-input-group')[0];
    fireEvent.mouseEnter(inputGroup);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(isTooltipOpen()).toBeTruthy();
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

    fireEvent.mouseLeave(inputGroup);
    await waitFakeTimer();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();
  });

  // https://github.com/ant-design/ant-design/issues/20891
  it('should display zero', () => {
    const { container } = render(
      <Tooltip title={0} open>
        <div />
      </Tooltip>,
    );
    expect(container.querySelector('.ant-tooltip-inner')?.innerHTML).toBe('0');
  });

  it('autoAdjustOverflow should be object or undefined', () => {
    expect(() => {
      render(
        <Tooltip title={0} open autoAdjustOverflow={{ adjustX: 0, adjustY: 0 }}>
          <div />
        </Tooltip>,
      );
    }).not.toThrow();

    expect(() => {
      render(
        <Tooltip title={0} open autoAdjustOverflow={undefined}>
          <div />
        </Tooltip>,
      );
    }).not.toThrow();
  });

  describe('support other placement when mouse enter', () => {
    const placementList = [
      'top',
      'left',
      'right',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
      'leftTop',
      'leftBottom',
      'rightTop',
      'rightBottom',
    ] as const;

    const testPlacement = (name: string, placement: TooltipPlacement) => {
      it(name, async () => {
        const { container } = render(
          <Tooltip
            title="xxxxx"
            transitionName=""
            mouseEnterDelay={0}
            placement={placement}
            autoAdjustOverflow={false}
          >
            <span>Hello world!</span>
          </Tooltip>,
        );
        expect(container.getElementsByTagName('span')).toHaveLength(1);
        const element = container.getElementsByTagName('span')[0];
        fireEvent.mouseEnter(element);
        await waitFakeTimer();
        expect(document.querySelector(`.ant-tooltip-placement-${placement}`)).toBeTruthy();
      });

      it(`${name} with arrowPointAtCenter`, async () => {
        const placementInfo: Record<string, any> = getPlacements({
          arrowPointAtCenter: true,
          autoAdjustOverflow: false,
          arrowWidth: 0,
          borderRadius: 10,
          offset: 0,
        });

        // Safe to rewrite follow all check
        const { offset } = placementInfo[placement];

        const existO = offset[0] !== 0 || offset[1] !== 0;

        if (['left', 'right', 'top', 'bottom'].includes(placement)) {
          expect(existO).toBeFalsy();
        } else {
          expect(existO).toBeTruthy();
        }
      });
    };

    placementList.forEach((placement) => testPlacement(`Placement ${placement}`, placement));
  });

  it('should works for mismatch placement', async () => {
    const { container } = render(
      <Tooltip
        title="xxxxx"
        align={{
          points: ['bc', 'tl'],
        }}
        mouseEnterDelay={0}
      >
        <span>Hello world!</span>
      </Tooltip>,
    );
    const button = container.getElementsByTagName('span')[0];
    fireEvent.mouseEnter(button);
    await waitFakeTimer();
    expect(document.querySelector('.ant-tooltip')).not.toBeNull();
  });

  it('should pass styles={{ body: {} }} through to the inner component', () => {
    const { container } = render(
      <Tooltip styles={{ body: { color: 'red' } }} title="xxxxx" open>
        <div />
      </Tooltip>,
    );
    expect(container.querySelector<HTMLDivElement>('.ant-tooltip-inner')?.style?.color).toBe('red');
  });

  it('should work with loading switch', () => {
    const onOpenChange = jest.fn();
    const { container } = render(
      <Tooltip
        title="loading tips"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
      >
        <Switch loading defaultChecked />
      </Tooltip>,
    );

    fireEvent.pointerEnter(container.getElementsByTagName('button')[0]);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();
  });

  it('should work with disabled Radio', () => {
    const onOpenChange = jest.fn();
    const { container } = render(
      <Tooltip
        title="loading tips"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
      >
        <Radio disabled />
      </Tooltip>,
    );

    fireEvent.pointerEnter(container.getElementsByTagName('input')[0]);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();
  });

  it('should work with Fragment children', async () => {
    const onOpenChange = jest.fn();
    const ref = React.createRef<any>();

    const { container } = render(
      <Tooltip
        title="Have a nice day!"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onOpenChange={onOpenChange}
        ref={ref}
      >
        <>
          <div className="hello">Hello world!</div>
          <div className="hello">Hello world!</div>
        </>
      </Tooltip>,
    );

    const divElement = container.querySelector('.hello');
    fireEvent.mouseEnter(divElement!);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await waitFakeTimer();
    expect(isTooltipOpen()).toBeTruthy();
    expect(container.querySelector('.ant-tooltip-open')).not.toBeNull();

    fireEvent.mouseLeave(divElement!);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFakeTimer();
    expect(isTooltipOpen()).toBeFalsy();
    expect(container.querySelector('.ant-tooltip-open')).toBeNull();
  });

  it('deprecated warning', async () => {
    resetWarned();
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // defaultVisible
    const { container, rerender } = render(
      <Tooltip defaultVisible title="bamboo">
        <a />
      </Tooltip>,
    );
    await waitFakeTimer();

    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Tooltip] `defaultVisible` is deprecated. Please use `defaultOpen` instead.',
    );
    expect(isTooltipOpen()).toBeTruthy();

    // visible
    rerender(
      <Tooltip visible title="bamboo">
        <a />
      </Tooltip>,
    );
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Tooltip] `visible` is deprecated. Please use `open` instead.',
    );

    rerender(
      <Tooltip visible={false} title="bamboo">
        <a />
      </Tooltip>,
    );
    await waitFakeTimer();
    if (container.querySelector('.ant-zoom-big-fast-leave-active')) {
      fireEvent.animationEnd(container.querySelector('.ant-zoom-big-fast-leave-active')!);
    }
    expect(isTooltipOpen()).toBeFalsy();

    // onVisibleChange
    rerender(
      <Tooltip onVisibleChange={() => {}} title="bamboo">
        <a />
      </Tooltip>,
    );
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Tooltip] `onVisibleChange` is deprecated. Please use `onOpenChange` instead.',
    );

    // afterVisibleChange
    rerender(
      <Tooltip afterVisibleChange={() => {}} title="bamboo">
        <a />
      </Tooltip>,
    );
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: Tooltip] `afterVisibleChange` is deprecated. Please use `afterOpenChange` instead.',
    );

    // Event Trigger
    const onVisibleChange = jest.fn();
    const afterVisibleChange = jest.fn();
    rerender(
      <Tooltip
        visible
        onVisibleChange={onVisibleChange}
        afterVisibleChange={afterVisibleChange}
        title="bamboo"
      >
        <a />
      </Tooltip>,
    );

    fireEvent.mouseLeave(container.querySelector('a')!);
    await waitFakeTimer();
    expect(onVisibleChange).toHaveBeenCalled();
    expect(afterVisibleChange).toHaveBeenCalled();

    errSpy.mockRestore();
  });

  it('not inject className when children className is not string type', () => {
    const HOC = ({ className }: { className: () => string }) => <span className={className()} />;
    const { container } = render(
      <Tooltip open>
        <HOC className={() => 'bamboo'} />
      </Tooltip>,
    );

    expect(container.querySelector('.bamboo')).toBeTruthy();
    expect(container.querySelector('.ant-tooltip')).toBeTruthy();
  });

  it('support arrow props pass false to hide arrow', () => {
    const { container } = render(
      <Tooltip open arrow={false}>
        <div className="target">target</div>
      </Tooltip>,
    );
    expect(container).toMatchSnapshot();
  });

  it('support arrow props by default', () => {
    const { container } = render(
      <Tooltip open>
        <div className="target">target</div>
      </Tooltip>,
    );
    expect(container).toMatchSnapshot();
  });

  it('use ref.current.forcePopupAlign', async () => {
    const ref = React.createRef<any>();
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Tooltip open ref={ref} />);
    act(() => {
      ref.current.forcePopupAlign();
      jest.runAllTimers();
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('should apply custom styles to Tooltip', () => {
    const customClassNames = {
      body: 'custom-body',
      root: 'custom-root',
    };

    const customStyles = {
      body: { color: 'red' },
      root: { backgroundColor: 'blue' },
    };

    const { container } = render(
      <Tooltip classNames={customClassNames} overlay={<div />} styles={customStyles} visible>
        <button type="button">button</button>
      </Tooltip>,
    );

    const tooltipElement = container.querySelector('.ant-tooltip') as HTMLElement;
    const tooltipBodyElement = container.querySelector('.ant-tooltip-inner') as HTMLElement;

    // 验证 classNames
    expect(tooltipElement.classList).toContain('custom-root');
    expect(tooltipBodyElement.classList).toContain('custom-body');

    // 验证 styles
    expect(tooltipElement.style.backgroundColor).toBe('blue');
    expect(tooltipBodyElement.style.color).toBe('red');
  });
});
