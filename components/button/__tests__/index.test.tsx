import React, { Suspense, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { resetWarned } from '@rc-component/util/lib/warning';

import Button, { _ButtonVariantTypes } from '..';
import type { GetRef } from '../../_util/type';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import ConfigProvider from '../../config-provider';
import theme from '../../theme';
import { PresetColors } from '../../theme/interface';
import type { BaseButtonProps } from '../button';

describe('Button', () => {
  mountTest(Button);
  mountTest(() => <Button size="large" />);
  mountTest(() => <Button size="small" />);
  mountTest(Button.Group);
  mountTest(() => <Button.Group size="large" />);
  mountTest(() => <Button.Group size="small" />);
  mountTest(() => <Button.Group size="middle" />);

  rtlTest(Button);
  rtlTest(() => <Button size="large" />);
  rtlTest(() => <Button size="small" />);
  rtlTest(Button.Group);
  rtlTest(() => <Button.Group size="large" />);
  rtlTest(() => <Button.Group size="small" />);
  rtlTest(() => <Button.Group size="middle" />);

  it('renders correctly', () => {
    const { container } = render(<Button>Follow</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('mount correctly', () => {
    expect(() => render(<Button>Follow</Button>)).not.toThrow();
  });

  it('warns if size is wrong', () => {
    resetWarned();
    const mockWarn = jest.spyOn(console, 'error').mockImplementation(() => {});
    const size = 'who am I';
    // @ts-expect-error: Type '"who am I"' is not assignable to type 'SizeType'.ts(2322)
    render(<Button.Group size={size} />);
    expect(mockWarn).toHaveBeenCalledWith('Warning: [antd: Button.Group] Invalid prop `size`.');

    mockWarn.mockRestore();
  });

  it('renders Chinese characters correctly', () => {
    expect(render(<Button>按钮</Button>).container.firstChild).toMatchSnapshot();
    // should not insert space when there is icon
    expect(
      render(<Button icon={<SearchOutlined />}>按钮</Button>).container.firstChild,
    ).toMatchSnapshot();
    // should not insert space when there is icon
    expect(
      render(
        <Button>
          <SearchOutlined />
          按钮
        </Button>,
      ).container.firstChild,
    ).toMatchSnapshot();
    // should not insert space when there is icon
    expect(
      render(<Button icon={<SearchOutlined />}>按钮</Button>).container.firstChild,
    ).toMatchSnapshot();
    // should not insert space when there is icon while loading
    expect(
      render(
        <Button icon={<SearchOutlined />} loading>
          按钮
        </Button>,
      ).container.firstChild,
    ).toMatchSnapshot();
    // should insert space while loading
    expect(render(<Button loading>按钮</Button>).container.firstChild).toMatchSnapshot();

    // should insert space while only one nested element
    expect(
      render(
        <Button>
          <span>按钮</span>
        </Button>,
      ).container.firstChild,
    ).toMatchSnapshot();
  });

  it('renders Chinese characters correctly in HOC', () => {
    const Text: React.FC<React.PropsWithChildren> = ({ children }) => <span>{children}</span>;
    const { container, rerender } = render(
      <Button>
        <Text>按钮</Text>
      </Button>,
    );
    expect(container.querySelector('.ant-btn')).toHaveClass('ant-btn-two-chinese-chars');

    rerender(
      <Button>
        <Text>大按钮</Text>
      </Button>,
    );
    expect(container.querySelector('.ant-btn')).not.toHaveClass('ant-btn-two-chinese-chars');

    rerender(
      <Button>
        <Text>按钮</Text>
      </Button>,
    );
    expect(container.querySelector('.ant-btn')).toHaveClass('ant-btn-two-chinese-chars');
  });

  // https://github.com/ant-design/ant-design/issues/18118
  it('should not insert space to link or text button', () => {
    const wrapper1 = render(<Button type="link">按钮</Button>);
    expect(wrapper1.getByRole('button')).toHaveTextContent('按钮');
    wrapper1.unmount();
    const wrapper2 = render(<Button type="text">按钮</Button>);
    expect(wrapper2.getByRole('button')).toHaveTextContent('按钮');
  });

  it('should render empty button without errors', () => {
    const wrapper = render(
      <Button>
        {null}
        {undefined}
      </Button>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('have static property for type detecting', () => {
    expect(Button.__ANT_BUTTON).toBe(true);
  });

  it('should change loading state instantly by default', () => {
    const DefaultButton: React.FC = () => {
      const [loading, setLoading] = useState<BaseButtonProps['loading']>(false);
      return (
        <Button loading={loading} onClick={() => setLoading(true)}>
          Button
        </Button>
      );
    };
    const wrapper = render(<DefaultButton />);
    fireEvent.click(wrapper.container.firstChild!);
    expect(wrapper.container.querySelectorAll('.ant-btn-loading').length).toBe(1);
  });

  it('should change loading state with delay', () => {
    const DefaultButton: React.FC = () => {
      const [loading, setLoading] = useState<BaseButtonProps['loading']>(false);
      return (
        <Button loading={loading} onClick={() => setLoading({ delay: 1000 })}>
          Button
        </Button>
      );
    };
    const wrapper = render(<DefaultButton />);
    fireEvent.click(wrapper.container.firstChild!);
    expect(wrapper.container.firstChild).not.toHaveClass('ant-btn-loading');
  });

  it('should support custom icon className', () => {
    const { container } = render(
      <Button type="primary" icon={<SearchOutlined />} classNames={{ icon: 'custom-icon' }} />,
    );
    expect(container.querySelectorAll('.custom-icon').length).toBe(1);
    expect(container).toMatchSnapshot();
  });

  it('should support custom icon styles', () => {
    const { container } = render(
      <Button type="primary" icon={<SearchOutlined />} styles={{ icon: { color: 'red' } }} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('reset when loading back of delay', () => {
    jest.useFakeTimers();
    const { rerender, container } = render(<Button loading={{ delay: 1000 }} />);
    rerender(<Button loading={{ delay: 2000 }} />);
    rerender(<Button loading={false} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(container.querySelectorAll('.ant-btn-loading')).toHaveLength(0);

    jest.useRealTimers();
  });

  it('should not clickable when button is loading', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        button
      </Button>,
    );
    fireEvent.click(container.firstChild!);
    expect(onClick).not.toHaveBeenCalledWith();
  });

  it('should support link button', () => {
    const wrapper = render(
      <Button target="_blank" href="https://ant.design">
        link button
      </Button>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('fixbug renders {0} , 0 and {false}', () => {
    expect(render(<Button>{0}</Button>).container.firstChild).toMatchSnapshot();
    expect(render(<Button>0</Button>).container.firstChild).toMatchSnapshot();
    expect(render(<Button>{false}</Button>).container.firstChild).toMatchSnapshot();
  });

  it('should not render as link button when href is undefined', async () => {
    const wrapper = render(
      <Button type="primary" href={undefined}>
        button
      </Button>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  // // https://github.com/ant-design/ant-design/issues/15342
  it('should merge text if children using variable', () => {
    const wrapper = render(
      <Button>
        This {'is'} a test {1}
      </Button>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it('should support to change loading', async () => {
    jest.useFakeTimers();
    const { container, rerender, unmount } = render(<Button>Button</Button>);
    rerender(<Button loading />);
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(1);
    rerender(<Button loading={false} />);
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(0);
    rerender(<Button loading={{ delay: 50 }} />);
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(0);
    await waitFakeTimer();
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(1);
    rerender(<Button loading={false} />);
    await waitFakeTimer();
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(0);
    expect(unmount).not.toThrow();
    jest.useRealTimers();
  });

  it('should warning when pass a string as icon props', () => {
    resetWarned();
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Button type="primary" icon="ab" />);
    expect(warnSpy).not.toHaveBeenCalled();

    render(<Button type="primary" icon="search" />);
    expect(warnSpy).toHaveBeenCalledWith(
      `Warning: [antd: Button] \`icon\` is using ReactNode instead of string naming in v4. Please check \`search\` at https://ant.design/components/icon`,
    );

    warnSpy.mockRestore();
  });

  it('should warning when pass type=link and ghost=true', () => {
    resetWarned();
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button type="link" ghost />);
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [antd: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('should warning when pass type=text and ghost=true', () => {
    resetWarned();
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Button type="text" ghost />);
    expect(warnSpy).toHaveBeenCalledWith(
      "Warning: [antd: Button] `link` or `text` button can't be a `ghost` button.",
    );
    warnSpy.mockRestore();
  });

  it('skip check 2 words when ConfigProvider disable this', () => {
    const buttonInstance = React.createRef<GetRef<typeof Button>>();
    render(
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button ref={buttonInstance}>test</Button>
      </ConfigProvider>,
    );
    Object.defineProperty(buttonInstance.current, 'textContent', {
      get() {
        throw new Error('Should not called!!!');
      },
    });
  });

  it('should not redirect when button is disabled', () => {
    const onClick = jest.fn();
    const { container } = render(
      <Button href="https://ant.design" onClick={onClick} disabled>
        click me
      </Button>,
    );
    fireEvent.click(container.firstChild!);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should match class .ant-btn-disabled when button is disabled and href is not undefined', () => {
    const wrapper = render(
      <Button href="https://ant.design" disabled>
        click me
      </Button>,
    );
    expect(wrapper.container.querySelector('.ant-btn')).toHaveClass('ant-btn-disabled');
  });

  // https://github.com/ant-design/ant-design/issues/30953
  it('should handle fragment as children', () => {
    const wrapper = render(
      <Button>
        <>text</>
      </Button>,
    );
    expect(wrapper.container.firstChild).toMatchSnapshot();
  });

  it("should prevent children's event when button is disabled", () => {
    const { container } = render(
      <Button disabled>
        <a id="link">test</a>
      </Button>,
    );
    expect(window.getComputedStyle(container.querySelector('#link')!).pointerEvents).toBe('none');
  });

  it('Correct type', () => {
    const onBtnClick: React.MouseEventHandler<HTMLButtonElement> = () => {};
    const onAnchorClick: React.MouseEventHandler<HTMLAnchorElement> = () => {};

    const button = <Button onClick={onBtnClick} />;
    const anchor = <Button href="https://ant.design" onClick={onAnchorClick} />;

    const defaultBtn = (
      <Button
        onClick={(e) => {
          expect(e).toBeTruthy();
        }}
      />
    );

    const defaultABtn = (
      <Button
        href="https://ant.design"
        onClick={(e) => {
          expect(e).toBeTruthy();
        }}
      />
    );

    const btnRef = React.createRef<GetRef<typeof Button>>();
    const refBtn = <Button ref={btnRef} />;

    const anchorRef = React.createRef<GetRef<typeof Button>>();
    const refAnchor = <Button ref={anchorRef} />;

    const htmlRef = React.createRef<GetRef<typeof Button>>();
    const refHtml = <Button ref={htmlRef} />;

    const btnAttr = <Button name="hello" />;

    expect(button).toBeTruthy();
    expect(anchor).toBeTruthy();
    expect(defaultBtn).toBeTruthy();
    expect(defaultABtn).toBeTruthy();
    expect(refBtn).toBeTruthy();
    expect(refAnchor).toBeTruthy();
    expect(refHtml).toBeTruthy();
    expect(btnAttr).toBeTruthy();
  });

  it('should not display loading when not set', () => {
    function Suspender({ freeze }: { freeze: boolean }) {
      const promiseCache = useRef<{
        promise?: Promise<void>;
        resolve?: (value: void | PromiseLike<void>) => void;
      }>({}).current;
      if (freeze && !promiseCache.promise) {
        promiseCache.promise = new Promise((resolve) => {
          promiseCache.resolve = resolve;
        });
        throw promiseCache.promise;
      }
      if (freeze) {
        throw promiseCache.promise;
      }
      if (promiseCache.promise) {
        promiseCache.resolve?.();
        promiseCache.promise = undefined;
      }
      return <Button>button</Button>;
    }
    const MyCom: React.FC = () => {
      const [freeze, setFreeze] = useState(false);
      return (
        <div className="foo">
          <Button className="change-btn" onClick={() => setFreeze(!freeze)}>
            Change
          </Button>
          <Suspense fallback={<>frozen</>}>
            <Suspender freeze={freeze} />
          </Suspense>
        </div>
      );
    };
    const { container } = render(<MyCom />);

    fireEvent.click(container.querySelector('.change-btn')!);
    expect(container.querySelector('.foo')).toHaveTextContent('frozen');
    fireEvent.click(container.querySelector('.change-btn')!);
    expect(container.querySelectorAll('.ant-btn-loading-icon').length).toBe(0);
  });

  // https://github.com/ant-design/ant-design/issues/45273
  it('should display loading when delay is zero', () => {
    const { container } = render(<Button loading={{ delay: 0 }}>Button</Button>);
    expect(container.querySelectorAll('.ant-btn-loading').length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/47605
  it('Compatible with original `type` behavior', async () => {
    const { container } = render(<Button type={'' as any} />);
    expect(container.querySelector('.ant-btn-default')).toBeTruthy();
  });

  it('should support autoInsertSpace', () => {
    const text = '确定';
    const { container } = render(<Button autoInsertSpace={false}>{text}</Button>);
    expect(container.querySelector<HTMLButtonElement>('button')?.textContent).toBe(text);
  });

  it('should support solidTextColor when theme changes', () => {
    const { container: defaultContainer } = render(
      <ConfigProvider theme={{ algorithm: [theme.defaultAlgorithm] }}>
        <Button color="default" variant="solid">
          btn1
        </Button>
      </ConfigProvider>,
    );

    expect(defaultContainer.firstChild).toHaveStyle({
      '--ant-button-solid-text-color': '#fff',
    });

    const { container: darkContainer } = render(
      <ConfigProvider theme={{ algorithm: [theme.darkAlgorithm] }}>
        <Button color="default" variant="solid">
          btn2
        </Button>
      </ConfigProvider>,
    );

    expect(darkContainer.firstChild).toHaveStyle({
      '--ant-button-solid-text-color': '#000',
    });
  });

  it('should render preset colors and variants correctly', () => {
    PresetColors.forEach((color) => {
      _ButtonVariantTypes.forEach((variant) => {
        const { container } = render(
          <Button color={color} variant={variant}>
            {color}
          </Button>,
        );
        expect(container.firstChild).toHaveClass(`ant-btn-color-${color}`);
        expect(container.firstChild).toHaveClass(`ant-btn-variant-${variant}`);
      });
    });
  });

  it('autoFocus should work', () => {
    const { container } = render(<Button autoFocus>button</Button>);

    expect(container.querySelector('button')).toBe(document.activeElement);
  });
});
