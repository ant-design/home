import React from 'react';

import { resetWarned } from '../../_util/warning';
import { act, fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';

describe('Collapse', () => {
  const Collapse = require('..').default;

  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // fix React concurrent
  function triggerAllTimer() {
    for (let i = 0; i < 10; i += 1) {
      act(() => {
        jest.runAllTimers();
      });
    }
  }

  beforeEach(() => {
    resetWarned();
  });

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should support remove expandIcon', () => {
    const { asFragment } = render(
      <Collapse expandIcon={() => null}>
        <Collapse.Panel header="header" />
      </Collapse>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should be able to config size', () => {
    const { container: small } = render(<Collapse size="small" />);
    const { container: large } = render(<Collapse size="large" />);

    expect(small.querySelector('.ant-collapse')).toHaveClass('ant-collapse-small');
    expect(large.querySelector('.ant-collapse')).toHaveClass('ant-collapse-large');
  });

  it('should keep the className of the expandIcon', () => {
    const { container } = render(
      <Collapse
        expandIcon={() => (
          <button type="button" className="custom-expandicon-classname">
            action
          </button>
        )}
      >
        <Collapse.Panel header="header" />
      </Collapse>,
    );

    expect(container.querySelectorAll('.custom-expandicon-classname').length).toBe(1);
  });

  it('should render extra node of panel', () => {
    const { asFragment } = render(
      <Collapse>
        <Collapse.Panel header="header" extra={<button type="button">action</button>} />
        <Collapse.Panel header="header" extra={<button type="button">action</button>} />
      </Collapse>,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('could be expand and collapse', async () => {
    jest.useFakeTimers();
    const { container } = render(
      <Collapse>
        <Collapse.Panel header="This is panel header 1" key="1">
          content
        </Collapse.Panel>
      </Collapse>,
    );
    expect(
      container.querySelector('.ant-collapse-item')?.classList.contains('ant-collapse-item-active'),
    ).toBe(false);
    fireEvent.click(container.querySelector('.ant-collapse-header')!);
    await waitFakeTimer();
    expect(
      container.querySelector('.ant-collapse-item')?.classList.contains('ant-collapse-item-active'),
    ).toBe(true);
    jest.useRealTimers();
  });

  it('could override default openMotion', () => {
    const { container, asFragment } = render(
      <Collapse openMotion={{}}>
        <Collapse.Panel header="This is panel header 1" key="1">
          content
        </Collapse.Panel>
      </Collapse>,
    );
    fireEvent.click(container.querySelector('.ant-collapse-header')!);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('should trigger warning and keep compatibility when using disabled in Panel', () => {
    const { container } = render(
      <Collapse>
        <Collapse.Panel disabled header="This is panel header 1" key="1">
          content
        </Collapse.Panel>
      </Collapse>,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Collapse.Panel] `disabled` is deprecated. Please use `collapsible="disabled"` instead.',
    );

    expect(container.querySelectorAll('.ant-collapse-item-disabled').length).toBe(1);

    fireEvent.click(container.querySelector('.ant-collapse-header')!);
    expect(container.querySelectorAll('.ant-collapse-item-active').length).toBe(0);
  });

  it('should not trigger warning when using items instead of children', () => {
    render(
      <Collapse
        items={[
          {
            key: '1',
            label: 'This is panel header 1',
            children: <p>aaa</p>,
          },
          {
            key: '2',
            label: 'This is panel header 2',
            children: <p>bbb</p>,
          },
          {
            key: '3',
            label: 'This is panel header 3',
            children: <p>ccc</p>,
          },
        ]}
      />,
    );

    expect(errorSpy).not.toHaveBeenCalledWith(
      'Warning: `children` will be removed in next major version. Please use `items` instead.',
    );
  });

  it('should end motion when set activeKey while hiding', async () => {
    jest.useFakeTimers();
    const spiedRAF = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb) => setTimeout(cb, 1000 / 60));

    let setActiveKeyOuter: React.Dispatch<React.SetStateAction<React.Key | undefined>>;
    const Test: React.FC = () => {
      const [activeKey, setActiveKey] = React.useState<React.Key>();
      setActiveKeyOuter = setActiveKey;
      return (
        <div hidden>
          <Collapse activeKey={activeKey}>
            <Collapse.Panel header="header" key="1">
              content
            </Collapse.Panel>
          </Collapse>
        </div>
      );
    };

    const { container } = render(<Test />);

    await act(async () => {
      setActiveKeyOuter('1');
      await Promise.resolve();
    });

    triggerAllTimer();

    expect(container.querySelectorAll('.ant-motion-collapse').length).toBe(0);

    spiedRAF.mockRestore();
    jest.useRealTimers();
  });

  it('ref should work', () => {
    const ref = React.createRef<HTMLDivElement>();
    const panelRef1 = React.createRef<HTMLDivElement>();
    const panelRef2 = React.createRef<HTMLDivElement>();

    const { container } = render(
      <Collapse ref={ref}>
        <Collapse.Panel ref={panelRef1} header="panel header 1" key="1">
          1
        </Collapse.Panel>
        <Collapse.Panel ref={panelRef2} header="panel header 2" key="2">
          2
        </Collapse.Panel>
        <Collapse.Panel header="panel header 3" key="3">
          2
        </Collapse.Panel>
      </Collapse>,
    );

    expect(ref.current).toBe(container.firstChild);
    expect(panelRef1.current).toBe(document.querySelectorAll('.ant-collapse-item')[0]);
    expect(panelRef2.current).toBe(document.querySelectorAll('.ant-collapse-item')[1]);
  });

  describe('expandIconPosition', () => {
    ['left', 'right'].forEach((pos) => {
      it(`warning for legacy '${pos}'`, () => {
        render(
          <Collapse expandIconPosition={pos}>
            <Collapse.Panel header="header" key="1" />
          </Collapse>,
        );

        expect(errorSpy).toHaveBeenCalledWith(
          'Warning: [antd: Collapse] `expandIconPosition` with `left` or `right` is deprecated. Please use `start` or `end` instead.',
        );
      });

      it('position end', () => {
        const { container } = render(
          <Collapse expandIconPosition="end">
            <Collapse.Panel header="header" key="1" />
          </Collapse>,
        );

        expect(container.querySelector('.ant-collapse-icon-position-end')).toBeTruthy();
      });
    });
  });

  it('Collapse.Panel usage', () => {
    const { container } = render(
      <Collapse bordered={false}>
        <Collapse.Panel key="test panel1" header="test panel1">
          test1
        </Collapse.Panel>
        <Collapse.Panel key="test panel2" header="test panel2">
          test2
        </Collapse.Panel>
      </Collapse>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('Check expandIcon aria-label value', () => {
    const { container, rerender } = render(
      <Collapse activeKey="1">
        <Collapse.Panel header="header" key="1" />
      </Collapse>,
    );

    expect(container.querySelector('.ant-collapse-arrow')).toHaveAttribute(
      'aria-label',
      'expanded',
    );

    rerender(
      <Collapse>
        <Collapse.Panel header="header" key="1" />
      </Collapse>,
    );

    expect(container.querySelector('.ant-collapse-arrow')).toHaveAttribute(
      'aria-label',
      'collapsed',
    );
  });

  it('should has borderless-bg class when has contentBg and borderless', () => {
    const { container } = render(
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              contentBg: 'red',
            },
          },
        }}
      >
        <Collapse bordered={false}>
          <Collapse.Panel header="This is panel header 1" key="1">
            content
          </Collapse.Panel>
        </Collapse>
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-collapse-borderless-bg')).toBeTruthy();
  });

  it('should support styles and classNames', () => {
    const { container } = render(
      <Collapse
        activeKey={['1']}
        items={[
          {
            key: '1',
            label: 'title',
            styles: { header: { color: 'red' }, body: { color: 'blue' } },
            classNames: { header: 'header-class', body: 'body-class' },
          },
        ]}
      />,
    );

    expect(container.querySelector('.ant-collapse-header')).toHaveClass('header-class');
    expect(container.querySelector('.ant-collapse-content-box')).toHaveClass('body-class');

    expect(container.querySelector('.ant-collapse-header')).toHaveStyle({ color: 'red' });
    expect(container.querySelector('.ant-collapse-content-box')).toHaveStyle({ color: 'blue' });
  });
});
