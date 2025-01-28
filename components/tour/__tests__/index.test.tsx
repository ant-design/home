import React, { useEffect, useRef } from 'react';
import { spyElementPrototypes } from '@rc-component/util/lib/test/domHook';

import Tour from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render, screen } from '../../../tests/utils';
import type { TourProps } from '../interface';

const mockBtnRect = (
  rect: { x: number; y: number; width: number; height: number },
  scrollIntoViewCb?: () => void,
) => {
  spyElementPrototypes(HTMLButtonElement, {
    getBoundingClientRect: {
      get(): any {
        return () => ({ ...rect, left: rect.x, top: rect.y });
      },
    },
    scrollIntoView: {
      get(): any {
        scrollIntoViewCb?.();
        return (val: boolean | ScrollIntoViewOptions) => val;
      },
    },
  });
};
describe('Tour', () => {
  mountTest(Tour);
  rtlTest(Tour);

  it('single', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button disabled ref={coverBtnRef} type="button">
            Cover
          </button>
          <Tour
            steps={[
              {
                title: 'cover title',
                description: 'cover description.',
                target: () => coverBtnRef.current!,
              },
            ]}
          />
        </>
      );
    };
    const { getByText, baseElement } = render(<App />);
    expect(getByText('cover title')).toBeTruthy();
    expect(getByText('cover description.')).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });

  it('steps is empty', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button disabled ref={coverBtnRef} type="button">
            Cover
          </button>
          <Tour steps={[]} />
          <Tour />
        </>
      );
    };
    const { baseElement } = render(<App />);
    expect(baseElement).toMatchSnapshot();
  });

  it('steps props indicatorsRender', () => {
    const onClickMock = jest.fn();
    const indicatorsRenderMock = jest.fn();
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button disabled ref={coverBtnRef} type="button">
            Cover
          </button>
          <Tour
            type="default"
            indicatorsRender={indicatorsRenderMock}
            steps={[
              {
                title: 'With Cover',
                nextButtonProps: {
                  onClick: onClickMock,
                },
              },
              {
                title: 'With Cover',
                nextButtonProps: {
                  onClick: onClickMock,
                },
                prevButtonProps: {
                  onClick: onClickMock,
                },
              },
              {
                title: 'With Cover',
                prevButtonProps: {
                  onClick: onClickMock,
                },
                nextButtonProps: {
                  onClick: onClickMock,
                },
              },
            ]}
          />
        </>
      );
    };
    const { baseElement } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onClickMock).toHaveBeenCalledTimes(5);
    expect(baseElement).toMatchSnapshot();
  });

  it('button props onClick', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      const [btnName, steBtnName] = React.useState<string>('defaultBtn');
      return (
        <>
          <span id="btnName">{btnName}</span>
          <button disabled ref={coverBtnRef} type="button">
            target
          </button>

          <Tour
            steps={[
              {
                title: '',
                description: '',
                target: () => coverBtnRef.current!,
                nextButtonProps: {
                  onClick: () => steBtnName('nextButton'),
                },
              },
              {
                title: '',
                target: () => coverBtnRef.current!,
                prevButtonProps: {
                  onClick: () => steBtnName('prevButton'),
                },
                nextButtonProps: {
                  onClick: () => steBtnName('finishButton'),
                },
              },
            ]}
          />
        </>
      );
    };
    const { baseElement } = render(<App />);
    expect(baseElement.querySelector('#btnName')).toHaveTextContent('defaultBtn');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(baseElement.querySelector('#btnName')).toHaveTextContent('nextButton');
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(baseElement.querySelector('#btnName')).toHaveTextContent('prevButton');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(baseElement.querySelector('#btnName')).toHaveTextContent('finishButton');
    expect(baseElement).toMatchSnapshot();
  });

  it('Primary', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button disabled ref={coverBtnRef} type="button">
            Cover
          </button>

          <Tour
            type="primary"
            steps={[
              {
                title: 'primary title',
                description: 'primary description.',
                target: () => coverBtnRef.current!,
              },
            ]}
          />
        </>
      );
    };
    const { getByText, baseElement } = render(<App />);
    expect(getByText('primary description.')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-pannel')?.parentElement).toHaveClass(
      'ant-tour-primary',
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('step support Primary', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button disabled ref={coverBtnRef} type="button">
            Cover
          </button>

          <Tour
            type="default"
            steps={[
              {
                title: 'cover title',
                description: 'cover description.',
                target: () => coverBtnRef.current!,
              },
              {
                title: 'primary title',
                description: 'primary description.',
                target: () => coverBtnRef.current!,
                type: 'primary',
              },
            ]}
          />
        </>
      );
    };
    const { getByText, container, baseElement } = render(<App />);
    expect(getByText('cover description.')).toBeTruthy();
    expect(container.querySelector('.ant-tour-primary .ant-tour-pannel')).toBeFalsy();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(getByText('primary description.')).toBeTruthy();
    expect(container.querySelector('.ant-tour-primary .ant-tour-pannel')).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });

  it('basic', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      const placementBtnRef = useRef<HTMLButtonElement>(null);

      const [show, setShow] = React.useState<boolean>();

      useEffect(() => {
        if (show === false) {
          setShow(true);
        }
      }, [show]);

      return (
        <>
          <div>
            <button
              type="button"
              onClick={() => {
                setShow(false);
              }}
            >
              Show
            </button>
            <button disabled ref={coverBtnRef} type="button">
              Cover
            </button>
            <button disabled ref={placementBtnRef} type="button">
              Placement
            </button>
          </div>

          {show && (
            <Tour
              steps={[
                {
                  title: 'Show in Center',
                  description: 'Here is the content of Tour.',
                  target: null,
                },
                {
                  title: 'With Cover',
                  description: 'Here is the content of Tour.',
                  target: () => coverBtnRef.current!,
                  cover: (
                    <img
                      alt="tour.png"
                      src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
                    />
                  ),
                },
                {
                  title: 'Adjust Placement',
                  description: 'Here is the content of Tour which show on the right.',
                  placement: 'right',
                  target: () => placementBtnRef.current!,
                },
              ]}
            />
          )}
        </>
      );
    };
    const { getByText, container, baseElement } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(getByText('Show in Center')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(getByText('Here is the content of Tour.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(getByText('Adjust Placement')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(container.querySelector('.ant-tour')).toBeFalsy();
    expect(baseElement).toMatchSnapshot();
  });

  it('panelRender should correct render when total is undefined or null', () => {
    [undefined, null].forEach((total: any) => {
      const { container } = render(<Tour open steps={[{ title: <div>test</div>, total }]} />);
      expect(
        container.querySelector<HTMLDivElement>('.ant-tour-pannel .ant-tour-indicators'),
      ).toBeFalsy();
    });
  });

  it('panelRender should correct render when title is undefined or null', () => {
    [undefined, null].forEach((title) => {
      const { container } = render(<Tour open steps={[{ title, total: 1 }]} />);
      expect(
        container.querySelector<HTMLDivElement>('.ant-tour-pannel .ant-tour-header'),
      ).toBeFalsy();
    });
  });

  it('custom step pre btn & next btn className & style', () => {
    const App: React.FC = () => (
      <Tour
        steps={[
          {
            title: 'Show in Center',
            description: 'Here is the content of Tour.',
            nextButtonProps: {
              className: 'customClassName',
              style: {
                backgroundColor: 'rgb(69,69,255)',
              },
            },
          },
          {
            title: 'With Cover',
            description: 'Here is the content of Tour.',
            cover: (
              <img
                alt="tour.png"
                src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
              />
            ),
          },
        ]}
      />
    );

    const { container } = render(<App />);
    // className
    expect(screen.getByRole('button', { name: 'Next' }).className.includes('customClassName')).toBe(
      true,
    );
    // style
    expect(screen.getByRole('button', { name: 'Next' }).style.backgroundColor).toEqual(
      'rgb(69, 69, 255)',
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('custom indicator', () => {
    const steps: TourProps['steps'] = [
      {
        title: 'Upload File',
        description: 'Put your files here.',
      },
      {
        title: 'Save',
        description: 'Save your changes.',
      },
      {
        title: 'Other Actions',
        description: 'Click to see other actions.',
      },
    ];
    const App: React.FC = () => (
      <Tour
        open
        steps={steps}
        indicatorsRender={(current, total) => (
          <span className="custom-indicator">
            {current + 1} / {total}
          </span>
        )}
      />
    );
    const { container } = render(<App />);
    expect(container.querySelector<HTMLSpanElement>('.custom-indicator')).toBeTruthy();
  });

  it('controlled current', () => {
    const App: React.FC = () => {
      const [current, setCurrent] = React.useState(0);
      return (
        <>
          <div>
            <button
              type="button"
              onClick={() => {
                setCurrent(1);
              }}
            >
              SetCurrent
            </button>
          </div>

          <Tour
            open
            current={current}
            steps={[
              {
                title: 'Show in Center',
                description: 'Here is the content of Tour.',
              },
              {
                title: 'Primary title',
                description: 'Primary description.',
                type: 'primary',
              },
            ]}
            onChange={setCurrent}
          />
        </>
      );
    };
    const { getByText, container, baseElement } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'SetCurrent' }));
    expect(getByText('Primary description.')).toBeTruthy();
    expect(container.querySelector('.ant-tour-primary .ant-tour-pannel')).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });

  it('support closeIcon', () => {
    const Demo = ({ closeIcon = false }: { closeIcon?: React.ReactNode }) => {
      const createBtnRef = useRef<HTMLButtonElement>(null);
      const updateBtnRef = useRef<HTMLButtonElement>(null);
      const deleteBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <div style={{ margin: 20 }}>
          <div>
            <button type="button" ref={createBtnRef}>
              Create
            </button>
            <div style={{ height: 200 }} />
            <button type="button" ref={updateBtnRef}>
              Update
            </button>
            <button type="button" ref={deleteBtnRef}>
              Delete
            </button>
          </div>
          <div style={{ height: 200 }} />

          <Tour
            closeIcon={closeIcon}
            steps={[
              {
                title: '创建',
                description: '创建一条数据',
                target: () => createBtnRef.current!,
                mask: true,
              },
              {
                title: '更新',
                closeIcon: !closeIcon,
                description: (
                  <div>
                    <span>更新一条数据</span>
                    <button type="button">帮助文档</button>
                  </div>
                ),
                target: () => updateBtnRef.current!,
              },
              {
                title: '删除',
                closeIcon: <span className="custom-del-close-icon">Close</span>,
                description: (
                  <div>
                    <span>危险操作:删除一条数据</span>
                    <button type="button">帮助文档</button>
                  </div>
                ),
                target: () => deleteBtnRef.current!,
              },
            ]}
          />
        </div>
      );
    };

    const { baseElement, rerender } = render(<Demo />);
    const resetIndex = () => {
      // reset
      fireEvent.click(baseElement.querySelector('.ant-tour-prev-btn')!);
      fireEvent.click(baseElement.querySelector('.ant-tour-prev-btn')!);
    };
    expect(baseElement.querySelector('.ant-tour-close')).toBeFalsy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeTruthy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeFalsy();
    expect(baseElement.querySelector('.custom-del-close-icon')).toBeTruthy();

    resetIndex();

    rerender(<Demo closeIcon />);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeTruthy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeFalsy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeFalsy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeFalsy();
    expect(baseElement.querySelector('.custom-del-close-icon')).toBeTruthy();

    resetIndex();

    rerender(<Demo closeIcon={<span className="custom-global-close-icon">X</span>} />);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.custom-global-close-icon')).toBeTruthy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeFalsy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeFalsy();
    expect(baseElement.querySelector('.custom-global-close-icon')).toBeFalsy();
    fireEvent.click(baseElement.querySelector('.ant-tour-next-btn')!);
    expect(baseElement.querySelector('.ant-tour-close')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-close-icon')).toBeFalsy();
    expect(baseElement.querySelector('.custom-del-close-icon')).toBeTruthy();

    resetIndex();
  });

  it('first step should be primary', () => {
    const App: React.FC = () => {
      const coverBtnRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={coverBtnRef} type="button">
            target
          </button>

          <Tour
            steps={[
              {
                title: '',
                description: '',
                target: () => coverBtnRef.current!,
                type: 'primary',
                className: 'should-be-primary',
              },
              {
                title: '',
                target: () => coverBtnRef.current!,
              },
            ]}
          />
        </>
      );
    };

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'target' }));
    expect(document.querySelector('.should-be-primary')).toBeTruthy();
    expect(document.querySelector('.should-be-primary')).toHaveClass('ant-tour-primary');
  });

  // https://github.com/ant-design/ant-design/issues/49117
  it('onClose current is correct', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Tour
        onClose={onClose}
        open
        steps={[
          {
            title: '',
            description: '',
            type: 'primary',
            className: 'should-be-primary',
          },
          {
            title: '',
          },
        ]}
      />,
    );
    fireEvent.click(container.querySelector('.ant-tour-next-btn')!);
    fireEvent.click(container.querySelector('.ant-tour-close-icon')!);
    expect(onClose).toHaveBeenLastCalledWith(1);
  });

  it('should support gap.radius', () => {
    const App: React.FC<{ gap: TourProps['gap'] }> = ({ gap }) => {
      const ref = useRef<HTMLButtonElement>(null);
      const [show, setShow] = React.useState<boolean>();
      const steps: TourProps['steps'] = [
        {
          title: 'Show in Center',
          description: 'Here is the content of Tour.',
          target: () => ref.current!,
        },
      ];
      return (
        <>
          <button type="button" onClick={() => setShow(true)} ref={ref}>
            Show
          </button>

          <Tour open={show} steps={steps} gap={gap} />
        </>
      );
    };
    const { rerender, baseElement } = render(<App gap={{ radius: 4 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));

    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute('rx', '4');
    rerender(<App gap={{ radius: 0 }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toBeTruthy();
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute('rx', '0');
  });
  it('should support gap.offset', () => {
    const gap = { offset: 10 };
    const pos = { x: 100, y: 200, width: 230, height: 180 };
    mockBtnRect(pos);
    const App: React.FC = () => {
      const ref = useRef<HTMLButtonElement>(null);
      const [show, setShow] = React.useState<boolean>();
      const steps: TourProps['steps'] = [
        {
          title: 'Show in Center',
          description: 'Here is the content of Tour.',
          target: () => ref.current!,
        },
      ];

      return (
        <>
          <button type="button" onClick={() => setShow(true)} ref={ref}>
            Show
          </button>

          <Tour steps={steps} gap={gap} open={show} />
        </>
      );
    };

    const { baseElement } = render(<App />);
    const targetBtn = screen.getByRole('button', { name: 'Show' });
    fireEvent.click(targetBtn);

    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute(
      'width',
      String(pos.width + gap.offset * 2),
    );
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute(
      'height',
      String(pos.height + gap.offset * 2),
    );
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute(
      'x',
      String(pos.x - gap.offset),
    );
    expect(baseElement.querySelector('.ant-tour-placeholder-animated')).toHaveAttribute(
      'y',
      String(pos.y - gap.offset),
    );

    expect(baseElement).toMatchSnapshot();
  });
  // This test is for PurePanel which means safe to remove.
  describe('PurePanel', () => {
    const PurePanel = Tour._InternalPanelDoNotUseOrYouWillBeFired;

    it('closeIcon', () => {
      const { container } = render(
        <PurePanel
          closeIcon={[
            <span className="bamboo" key="bamboo" />,
            <span className="little" key="little" />,
          ]}
          title="a"
        />,
      );

      expect(container.querySelector('.bamboo')).toBeTruthy();
      expect(container.querySelector('.little')).toBeTruthy();
    });
  });
  it('support custom styles', () => {
    const customClassnames = {
      mask: 'custom-mask',
      actions: 'custom-actions',
      title: 'custom-title',
      header: 'custom-header',
      section: 'custom-section',
      footer: 'custom-footer',
      description: 'custom-description',
      cover: 'custom-cover',
      indicator: 'custom-indicator',
      root: 'custom-root',
    };
    const customStyles = {
      mask: { color: 'white' },
      actions: { color: 'blue' },
      title: { fontSize: '20px' },
      header: { backgroundColor: 'gray' },
      section: { margin: '5px' },
      footer: { borderTop: '1px solid black' },
      description: { fontStyle: 'italic' },
      cover: { color: 'red' },
      indicator: { color: 'green' },
      root: { backgroundColor: 'yellow' },
    };
    const Demo = () => {
      const btnRef = useRef<HTMLButtonElement>(null);
      return (
        <div style={{ margin: 20 }}>
          <button ref={btnRef} type="button">
            按钮
          </button>
          <Tour
            classNames={customClassnames}
            styles={customStyles}
            open
            steps={[
              {
                title: '创建',
                description: '创建一条数据',
                cover: (
                  <img
                    alt="tour.png"
                    src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
                  />
                ),
                target: () => btnRef.current!,
              },
              {
                title: 'Save',
                description: 'Save your changes.',
                target: () => btnRef.current!,
              },
            ]}
          />
        </div>
      );
    };
    render(<Demo />);

    const maskElement = document.querySelector('.ant-tour-mask') as HTMLElement;
    const actionsElement = document.querySelector('.ant-tour-actions') as HTMLElement;
    const titleElement = document.querySelector('.ant-tour-title') as HTMLElement;
    const headerElement = document.querySelector('.ant-tour-header') as HTMLElement;
    const sectionElement = document.querySelector('.ant-tour-section') as HTMLElement;
    const footerElement = document.querySelector('.ant-tour-footer') as HTMLElement;
    const descriptionElement = document.querySelector('.ant-tour-description') as HTMLElement;
    const coverElement = document.querySelector('.ant-tour-cover') as HTMLElement;
    const indicatorElement = document.querySelector('.ant-tour-indicator') as HTMLElement;
    const rootElement = document.querySelector('.ant-tour-mask') as HTMLElement;

    // check classNames
    expect(maskElement.classList).toContain('custom-mask');
    expect(actionsElement.classList).toContain('custom-actions');
    expect(titleElement.classList).toContain('custom-title');
    expect(headerElement.classList).toContain('custom-header');
    expect(sectionElement.classList).toContain('custom-section');
    expect(footerElement.classList).toContain('custom-footer');
    expect(descriptionElement.classList).toContain('custom-description');
    expect(coverElement.classList).toContain('custom-cover');
    expect(indicatorElement.classList).toContain('custom-indicator');
    expect(rootElement.classList).toContain('custom-root');

    // check styles
    expect(maskElement.style.color).toBe('white');
    expect(actionsElement.style.color).toBe('blue');
    expect(titleElement.style.fontSize).toBe('20px');
    expect(headerElement.style.backgroundColor).toBe('gray');
    expect(sectionElement.style.margin).toBe('5px');
    expect(footerElement.style.borderTop).toBe('1px solid black');
    expect(descriptionElement.style.fontStyle).toBe('italic');
    expect(coverElement.style.color).toBe('red');
    expect(indicatorElement.style.color).toBe('green');
    expect(rootElement.style.backgroundColor).toBe('yellow');
  });
});
