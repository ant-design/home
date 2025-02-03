import type { ChangeEventHandler } from 'react';
import React, { version as ReactVersion, useEffect, useRef, useState } from 'react';
import { AlertFilled } from '@ant-design/icons';
import type { ColProps } from 'antd/es/grid';
import classNames from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';

import type { FormInstance } from '..';
import Form from '..';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, pureRender, render, screen, waitFakeTimer } from '../../../tests/utils';
import Button from '../../button';
import Cascader from '../../cascader';
import Checkbox from '../../checkbox';
import ColorPicker from '../../color-picker';
import ConfigProvider from '../../config-provider';
import DatePicker from '../../date-picker';
import Drawer from '../../drawer';
import Input from '../../input';
import InputNumber from '../../input-number';
import zhCN from '../../locale/zh_CN';
import Modal from '../../modal';
import Radio from '../../radio';
import Select from '../../select';
import Slider from '../../slider';
import Switch from '../../switch';
import TreeSelect from '../../tree-select';
import Upload from '../../upload';
import type { NamePath } from '../interface';
import * as Util from '../util';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

jest.mock('scroll-into-view-if-needed');

describe('Form', () => {
  mountTest(Form);
  mountTest(Form.Item);

  rtlTest(Form);
  rtlTest(Form.Item);

  (scrollIntoView as any).mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const changeValue = async (
    input: HTMLElement | null | number,
    value: string,
    advTimer = 1000,
  ) => {
    let element: HTMLElement;

    if (typeof input === 'number') {
      element = document.querySelectorAll('input')[input];
    }

    expect(element!).toBeTruthy();

    fireEvent.change(element!, {
      target: {
        value,
      },
    });

    if (advTimer) {
      await waitFakeTimer(advTimer / 20, 20);
    }
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
    (scrollIntoView as any).mockReset();
  });

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    (scrollIntoView as any).mockRestore();
  });

  describe('noStyle Form.Item', () => {
    it('should show alert when form field is required but empty', async () => {
      const onChange = jest.fn();

      const { container } = render(
        <Form>
          <Form.Item>
            <Form.Item name="test" label="test" initialValue="bamboo" rules={[{ required: true }]}>
              <Input onChange={onChange} />
            </Form.Item>
          </Form.Item>
        </Form>,
      );

      // user type something and clear
      await changeValue(0, 'test');
      await changeValue(0, '');

      // should show alert with correct message and show correct styles
      expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
        "'test' is required",
      );
      expect(container.querySelector('.ant-input-status-error')).toBeTruthy();
      expect(container.querySelector('.ant-form-item-has-error')).toBeTruthy();

      expect(onChange).toHaveBeenCalled();
    });

    it('should clean up', async () => {
      const Demo: React.FC = () => {
        const [form] = Form.useForm();

        const onChange = async () => {
          // Wait a while and then some logic to validate
          await waitFakeTimer();

          try {
            await act(async () => {
              await form.validateFields();
            });
          } catch {
            // do nothing
          }
        };

        return (
          <Form form={form} initialValues={{ aaa: '2' }}>
            <Form.Item name="aaa">
              <Input onChange={onChange} />
            </Form.Item>
            <Form.Item shouldUpdate noStyle>
              {() => {
                const aaa = form.getFieldValue('aaa');

                if (aaa === '1') {
                  return (
                    <Form.Item name="bbb" rules={[{ required: true, message: 'aaa' }]}>
                      <Input />
                    </Form.Item>
                  );
                }

                return (
                  <Form.Item>
                    <Form.Item name="ccc" rules={[{ required: true, message: 'ccc' }]} noStyle>
                      <Input />
                    </Form.Item>
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Form>
        );
      };

      const { container } = render(<Demo />);

      await changeValue(0, '1');
      await waitFakeTimer(2000, 2000);
      expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent('aaa');

      await changeValue(0, '2');
      await waitFakeTimer(2000, 2000);
      expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent('ccc');

      await changeValue(0, '1');
      await waitFakeTimer(2000, 2000);
      expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent('aaa');
    });

    // https://github.com/ant-design/ant-design/issues/41620
    it('should not throw error when `help=false` and `noStyle=true`', async () => {
      const App: React.FC<{ help?: React.ReactNode }> = (props) => {
        const { help = false } = props || {};
        return (
          <Form>
            <Form.Item name="list" label="List" rules={[{ required: true }]}>
              <Form.Item name={['list', 0]} noStyle help={help} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={['list', 1]} noStyle help={help} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <button type="submit">submit</button>
            </Form.Item>
          </Form>
        );
      };

      const { container, getByRole, rerender } = render(<App />);

      // click submit to trigger validate
      fireEvent.click(getByRole('button'));

      await waitFakeTimer();
      expect(container.querySelectorAll('.ant-form-item-explain-error')).toHaveLength(1);

      // When noStyle=true but help is not false, help will be displayed
      rerender(<App help="help" />);
      await waitFakeTimer();
      fireEvent.click(getByRole('button'));
      await waitFakeTimer();
      expect(container.querySelectorAll('.ant-form-item-explain-error')).toHaveLength(3);
    });
  });

  it('render functions require either `shouldUpdate` or `dependencies`', () => {
    render(
      <Form>
        <Form.Item>{() => null}</Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] A `Form.Item` with a render function must have either `shouldUpdate` or `dependencies`.',
    );
  });

  it("`shouldUpdate` shouldn't work with `dependencies`", () => {
    render(
      <Form>
        <Form.Item shouldUpdate dependencies={[]}>
          {() => null}
        </Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "Warning: [antd: Form.Item] `shouldUpdate` and `dependencies` shouldn't be used together. See https://u.ant.design/form-deps.",
    );
  });

  it('`name` should not work with render props', () => {
    render(
      <Form>
        <Form.Item name="test" shouldUpdate>
          {() => null}
        </Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] A `Form.Item` with a render function cannot be a field, and thus cannot have a `name` prop.',
    );
  });

  it('multiple children with a name prop', () => {
    render(
      <Form>
        <Form.Item name="test">
          <div>one</div>
          <div>two</div>
        </Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] A `Form.Item` with a `name` prop must have a single child element. For information on how to render more complex form items, see https://u.ant.design/complex-form-item.',
    );
  });

  it('input element should have the prop aria-describedby pointing to the help id when there is a help message', () => {
    const { container } = pureRender(
      <Form>
        <Form.Item name="test" help="This is a help">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBe('test_help');
    expect(container.querySelector('.ant-form-item-explain')?.id).toBe('test_help');
  });

  it('input element should not have the prop aria-describedby pointing to the help id when there is a help message and name is not defined', () => {
    const { container } = render(
      <Form>
        <Form.Item help="This is a help">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBeFalsy();
    expect(container.querySelector('.ant-form-item-explain')?.id).toBeFalsy();
  });

  it('input element should have the prop aria-describedby concatenated with the form name pointing to the help id when there is a help message', () => {
    const { container } = render(
      <Form name="form">
        <Form.Item name="test" help="This is a help">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBe(
      'form_test_help',
    );
    expect(container.querySelector('.ant-form-item-explain')?.id).toBe('form_test_help');
  });

  it('input element should have the prop aria-describedby pointing to the help id when there are errors', async () => {
    const { container } = pureRender(
      <Form>
        <Form.Item name="test" rules={[{ len: 3 }, { type: 'number' }]}>
          <input />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, 'Invalid number');

    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBe('test_help');
    expect(container.querySelector('.ant-form-item-explain')?.id).toBe('test_help');
  });

  it('input element should have the prop aria-invalid when there are errors', async () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" rules={[{ len: 3 }, { type: 'number' }]}>
          <input />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, 'Invalid number');
    expect(container.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('input element should have the prop aria-required when the prop `required` is true', () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" required>
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-required')).toBe('true');
  });

  it('input element should have the prop aria-required when there is a rule with required', () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" rules={[{ required: true }]}>
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-required')).toBe('true');
  });

  it('input element should have the prop aria-describedby pointing to the extra id when there is a extra message', () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" extra="This is a extra message">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBe('test_extra');
    expect(container.querySelector('.ant-form-item-extra')?.id).toBe('test_extra');
  });

  it('input element should not have the prop aria-describedby pointing to the extra id when there is a extra message and name is not defined', () => {
    const { container } = render(
      <Form>
        <Form.Item extra="This is a extra message">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBeFalsy();
    expect(container.querySelector('.ant-form-item-extra')?.id).toBeFalsy();
  });

  it('input element should have the prop aria-describedby pointing to the help and extra id when there is a help and extra message', () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" help="This is a help" extra="This is a extra message">
          <input />
        </Form.Item>
      </Form>,
    );
    expect(container.querySelector('input')?.getAttribute('aria-describedby')).toBe(
      'test_help test_extra',
    );
  });

  describe('scrollToField', () => {
    const test = (name: string, genForm: () => any) => {
      it(name, () => {
        let callGetForm: any;

        const Demo: React.FC = () => {
          const { props, getForm } = genForm();
          callGetForm = getForm;

          return (
            <Form name="scroll" {...props}>
              <Form.Item name="test">
                <Input />
              </Form.Item>
            </Form>
          );
        };

        render(<Demo />);

        expect(scrollIntoView).not.toHaveBeenCalled();
        const form = callGetForm();
        form.scrollToField('test', {
          block: 'start',
        });

        const inputNode = document.getElementById('scroll_test');
        expect(scrollIntoView).toHaveBeenCalledWith(inputNode, {
          block: 'start',
          scrollMode: 'if-needed',
        });
      });
    };

    // hooks
    test('useForm', () => {
      const [form] = Form.useForm();
      return {
        props: { form },
        getForm: () => form,
      };
    });

    // ref
    test('ref', () => {
      let form: any;
      return {
        props: {
          ref: (instance: any) => {
            form = instance;
          },
        },
        getForm: () => form,
      };
    });
  });

  describe('scrollToFirstError', () => {
    it('should work with scrollToFirstError', async () => {
      const onFinishFailed = jest.fn();

      const { container } = render(
        <Form scrollToFirstError={{ block: 'center' }} onFinishFailed={onFinishFailed}>
          <Form.Item name="test" rules={[{ required: true }]}>
            <input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>,
      );

      expect(scrollIntoView).not.toHaveBeenCalled();
      fireEvent.submit(container.querySelector('form')!);
      await waitFakeTimer();

      const inputNode = document.getElementById('test');
      expect(scrollIntoView).toHaveBeenCalledWith(inputNode, {
        block: 'center',
        scrollMode: 'if-needed',
      });
      expect(onFinishFailed).toHaveBeenCalled();
    });

    it('should work with scrollToFirstError with ref', async () => {
      const ForwardRefInput = React.forwardRef<HTMLInputElement, any>(({ id, ...props }, ref) => (
        <input {...props} ref={ref} />
      ));

      const NativeInput = React.forwardRef<any, any>(({ id, ...props }, ref) => {
        const internalRef = React.useRef<HTMLInputElement>(null);
        React.useImperativeHandle(ref, () => ({
          nativeElement: internalRef.current,
        }));
        return <input {...props} ref={internalRef} />;
      });

      const NormalInput = (props: any) => <input {...props} />;

      const { getByRole, getAllByRole } = render(
        <Form scrollToFirstError>
          <Form.Item name="foo" rules={[{ required: true }]}>
            <ForwardRefInput />
          </Form.Item>
          <Form.Item name="bar" rules={[{ required: true }]}>
            <NativeInput />
          </Form.Item>
          <Form.Item name="baz" rules={[{ required: true }]}>
            <NormalInput />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>,
      );

      // click submit to trigger validate
      const allInputs = getAllByRole('textbox');
      const button = getByRole('button');
      expect(allInputs).toHaveLength(3);

      fireEvent.click(button);
      await waitFakeTimer();

      expect(scrollIntoView).toHaveBeenNthCalledWith(1, allInputs[0], expect.any(Object));

      // change the value of the first input
      fireEvent.change(allInputs[0], { target: { value: '123' } });
      fireEvent.click(button);
      await waitFakeTimer();

      expect(scrollIntoView).toHaveBeenNthCalledWith(2, allInputs[1], expect.any(Object));

      // change the value of the second input
      fireEvent.change(allInputs[1], { target: { value: 'abc' } });
      fireEvent.click(button);
      await waitFakeTimer();

      expect(scrollIntoView).toHaveBeenNthCalledWith(3, allInputs[2], expect.any(Object));

      expect(scrollIntoView).toHaveBeenCalledTimes(3);
    });

    it('should scrollToFirstError work with focus', async () => {
      const onFinishFailed = jest.fn();
      const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

      const { container } = render(
        <Form scrollToFirstError={{ block: 'center', focus: true }} onFinishFailed={onFinishFailed}>
          <Form.Item name="test" rules={[{ required: true }]}>
            <input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>,
      );

      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(focusSpy).not.toHaveBeenCalled();

      fireEvent.submit(container.querySelector('form')!);
      await waitFakeTimer();

      const inputNode = document.getElementById('test');
      expect(focusSpy).toHaveBeenCalledWith();
      expect(scrollIntoView).toHaveBeenCalledWith(inputNode, {
        block: 'center',
        focus: true,
        scrollMode: 'if-needed',
      });

      focusSpy.mockRestore();
    });

    // https://github.com/ant-design/ant-design/issues/28869
    it('should work with Upload', async () => {
      const uploadRef = React.createRef<any>();

      const { getByRole } = render(
        <Form scrollToFirstError>
          <Form.Item
            name="demo-form_dragger"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true }]}
          >
            <Upload name="files" action="/upload.do" ref={uploadRef} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>,
      );
      fireEvent.click(getByRole('button'));
      await waitFakeTimer();

      expect(scrollIntoView).toHaveBeenCalled();
      expect((scrollIntoView as any).mock.calls[0][0]).toBe(uploadRef.current.nativeElement);
    });

    // https://github.com/ant-design/ant-design/issues/48981
    it('should not throw error when use InputNumber', async () => {
      const inputNumberRef = React.createRef<any>();

      const { getByText } = render(
        <Form scrollToFirstError>
          <Form.Item name="demo-form_input-number" rules={[{ required: true }]}>
            <InputNumber ref={inputNumberRef} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>,
      );
      fireEvent.click(getByText('Submit'));
      await waitFakeTimer();
      expect(scrollIntoView).toHaveBeenCalled();
      expect((scrollIntoView as any).mock.calls[0][0]).toBe(inputNumberRef.current?.nativeElement);
    });
  });

  it('Form.Item should support data-*、aria-* and custom attribute', () => {
    const { container } = render(
      <Form>
        {/* @ts-ignore */}
        <Form.Item data-text="123" aria-hidden="true" cccc="bbbb">
          text
        </Form.Item>
      </Form>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('warning when use `name` but children is not validate element', () => {
    render(
      <Form>
        <Form.Item name="warning">text</Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] `name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead.',
    );
  });

  it('No warning when use noStyle and children is empty', () => {
    render(
      <Form>
        <Form.Item name="noWarning" noStyle />
      </Form>,
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('dynamic change required', async () => {
    const { container } = render(
      <Form>
        <Form.Item label="light" name="light" valuePropName="checked">
          <input type="checkbox" />
        </Form.Item>
        <Form.Item
          label="bamboo"
          name="bamboo"
          dependencies={['light']}
          rules={[({ getFieldValue }) => ({ required: getFieldValue('light') })]}
        >
          <input />
        </Form.Item>
      </Form>,
    );

    // should not show alert by default
    expect(container.querySelector('.ant-form-item-explain')).toBeFalsy();

    // click to change the light field value to true
    fireEvent.click(container.querySelector('input')!);
    await waitFakeTimer();

    // user input something and clear
    await changeValue(1, '1');
    await changeValue(1, '');

    // should show alert says that the field is required
    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      "'bamboo' is required",
    );
  });

  describe('should show related className when customize help', () => {
    it('normal', async () => {
      const { container } = render(
        <Form>
          <Form.Item help="good">
            <input />
          </Form.Item>
        </Form>,
      );

      await waitFakeTimer();

      expect(container.querySelector('.ant-form-item-explain')).toHaveTextContent('good');
      expect(container.querySelector('.ant-form-item-with-help')).toBeTruthy();
    });

    it('empty string', async () => {
      const { container } = render(
        <Form>
          <Form.Item help="">
            <input />
          </Form.Item>
        </Form>,
      );

      await waitFakeTimer();

      expect(container.querySelector('.ant-form-item-explain')).toHaveTextContent('');
      expect(container.querySelector('.ant-form-item-with-help')).toBeTruthy();
    });
  });

  it('warning when use v3 function', () => {
    Form.create();
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form] antd v4 removed `Form.create`. Please remove or use `@ant-design/compatible` instead.',
    );
  });

  // https://github.com/ant-design/ant-design/issues/20706
  it('Error change should work', async () => {
    const { container } = render(
      <Form>
        <Form.Item
          name="name"
          label="test"
          rules={[
            { required: true },
            {
              validator: (_, value) => {
                if (value === 'p') {
                  return Promise.reject(new Error('not a p'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>,
    );

    for (let i = 0; i < 3; i += 1) {
      await changeValue(0, 'bamboo');
      await changeValue(0, '');
      expect(container.querySelector('.ant-form-item-explain')?.textContent).toEqual(
        "'name' is required",
      );

      await changeValue(0, 'p');
      expect(container.querySelector('.ant-form-item-explain')?.textContent).toEqual('not a p');
    }
  });

  // https://github.com/ant-design/ant-design/issues/20813
  it('should update help directly when provided', async () => {
    const App: React.FC = () => {
      const [message, updateMessage] = React.useState('');
      return (
        <Form>
          <Form.Item label="hello" help={message}>
            <Input />
          </Form.Item>
          <Button onClick={() => updateMessage('bamboo')} />
        </Form>
      );
    };

    const { container } = render(<App />);

    // should show initial text
    await waitFakeTimer();
    expect(container.querySelector('.ant-form-item-explain')).toHaveTextContent('');

    fireEvent.click(container.querySelector('button')!);

    // should show bamboo alert without opacity and hide first alert with opacity: 0
    await waitFakeTimer();
    expect(container.querySelector('.ant-form-item-explain')).toHaveTextContent('bamboo');
  });

  it('warning when use `dependencies` but `name` is empty & children is not a render props', () => {
    render(
      <Form>
        <Form.Item dependencies={[]}>text</Form.Item>
      </Form>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] Must set `name` or use a render function when `dependencies` is set.',
    );
  });

  // https://github.com/ant-design/ant-design/issues/20948
  it('not repeat render when Form.Item is not a real Field', async () => {
    const shouldNotRender = jest.fn();
    const StaticInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
      id,
      value = '',
    }) => {
      shouldNotRender();
      return <input id={id} value={value} />;
    };

    const shouldRender = jest.fn();
    const DynamicInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
      value = '',
      id,
    }) => {
      shouldRender(value);
      return <input id={id} value={value} />;
    };

    const Demo = () => {
      const [form] = Form.useForm();

      return (
        <Form form={form}>
          <Form.Item>
            <StaticInput />
          </Form.Item>
          <Form.Item name="light">
            <DynamicInput id="changed" />
          </Form.Item>
          <Button id="fill-btn" onClick={() => form.setFieldValue('light', 'bamboo')}>
            fill
          </Button>
        </Form>
      );
    };

    const { container } = pureRender(<Demo />);

    await waitFakeTimer();

    expect(container.querySelector<HTMLInputElement>('#changed')!.value).toEqual('');
    expect(shouldNotRender).toHaveBeenCalledTimes(1);
    expect(shouldRender).toHaveBeenCalledTimes(1);

    fireEvent.click(container.querySelector('#fill-btn')!);
    await waitFakeTimer();

    expect(shouldNotRender).toHaveBeenCalledTimes(1);
    expect(shouldRender).toHaveBeenLastCalledWith('bamboo');
    expect(shouldRender).toHaveBeenCalledTimes(2);
  });

  it('empty help should also render', () => {
    const { container } = render(
      <Form.Item help="">
        <input />
      </Form.Item>,
    );
    expect(container.querySelectorAll('.ant-form-item-explain').length).toBeTruthy();
  });

  it('Form.Item with `help` should display error style when validate failed', async () => {
    const { container } = render(
      <Form>
        <Form.Item
          name="test"
          label="test"
          help="help"
          initialValue="bamboo"
          rules={[{ required: true, message: 'message' }]}
        >
          <Input />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, '');
    expect(container.querySelector('.ant-form-item')).toHaveClass('ant-form-item-has-error');
    expect(container.querySelector('.ant-form-item-explain')!.textContent).toEqual('help');
  });

  it('clear validation message when', async () => {
    const { container } = render(
      <Form>
        <Form.Item name="test" label="test" rules={[{ required: true, message: 'message' }]}>
          <Input />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, '1');
    expect(container.querySelectorAll('.ant-form-item-explain').length).toBeFalsy();

    await changeValue(0, '');
    expect(container.querySelectorAll('.ant-form-item-explain').length).toBeTruthy();

    await changeValue(0, '123');
    expect(container.querySelectorAll('.ant-form-item-explain').length).toBeFalsy();
  });

  // https://github.com/ant-design/ant-design/issues/21167
  it('`require` without `name`', () => {
    const { container } = render(
      <Form.Item label="test" name="test" required>
        <input />
      </Form.Item>,
    );

    // expect(screen.getByTitle('test')).toHaveClass('ant-form-item-required');
    expect(container.querySelector('.ant-form-item-required')).toBeTruthy();
  });

  it('0 is a validate Field', () => {
    render(
      <Form.Item name={0} label="0">
        <input />
      </Form.Item>,
    );

    // if getByLabelText can get element, then it is a validate field with form control and label
    expect(screen.getByLabelText('0')).toBeInTheDocument();
  });

  it('`null` triggers warning and is treated as `undefined`', () => {
    render(
      <Form.Item name={null as unknown as NamePath} label="test">
        <input />
      </Form.Item>,
    );

    // if getByLabelText can get element, then it is a validate field with form control and label
    expect(screen.queryByLabelText('test')).not.toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] `null` is passed as `name` property',
    );
  });

  // https://github.com/ant-design/ant-design/issues/21415
  it('should not throw error when Component.props.onChange is null', async () => {
    const CustomComponent: React.FC = () => (
      <input onChange={null as unknown as ChangeEventHandler<HTMLInputElement>} />
    );
    render(
      <Form>
        <Form.Item name="custom">
          <CustomComponent />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, 'aaa');
  });

  it('change `help` should not warning', async () => {
    const Demo: React.FC = () => {
      const [error, setError] = React.useState(false);
      return (
        <Form>
          <Form.Item
            help={error ? 'This is an error msg' : undefined}
            validateStatus={error ? 'error' : ''}
            label="Username"
            name="username"
          >
            <input />
          </Form.Item>

          <Form.Item>
            <button type="button" onClick={() => setError(!error)}>
              Trigger
            </button>
          </Form.Item>
        </Form>
      );
    };

    const { container } = render(<Demo />);
    fireEvent.click(container.querySelector('button')!);

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('`label` support template', async () => {
    const { container } = render(
      // eslint-disable-next-line no-template-curly-in-string
      <Form validateMessages={{ required: '${label} is good!' }}>
        <Form.Item name="test" label="Bamboo" rules={[{ required: true }]}>
          <input />
        </Form.Item>
      </Form>,
    );

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      'Bamboo is good!',
    );
  });

  // https://github.com/ant-design/ant-design/issues/33691
  it('should keep upper locale in nested ConfigProvider', async () => {
    const { container } = render(
      <ConfigProvider locale={zhCN}>
        <ConfigProvider>
          <Form>
            <Form.Item name="test" label="Bamboo" rules={[{ required: true }]}>
              <input />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </ConfigProvider>,
    );

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      '请输入Bamboo',
    );
  });

  it('`name` support template when label is not provided', async () => {
    const { container } = render(
      // eslint-disable-next-line no-template-curly-in-string
      <Form validateMessages={{ required: '${label} is good!' }}>
        <Form.Item name="Bamboo" rules={[{ required: true }]}>
          <input />
        </Form.Item>
      </Form>,
    );

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      'Bamboo is good!',
    );
  });

  it('`messageVariables` support validate', async () => {
    const { container } = render(
      // eslint-disable-next-line no-template-curly-in-string
      <Form validateMessages={{ required: '${label} is good!' }}>
        <Form.Item name="test" messageVariables={{ label: 'Bamboo' }} rules={[{ required: true }]}>
          <input />
        </Form.Item>
      </Form>,
    );

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      'Bamboo is good!',
    );
  });

  it('validation message should has alert role', async () => {
    // https://github.com/ant-design/ant-design/issues/25711
    const { container } = render(
      <Form validateMessages={{ required: 'name is good!' }}>
        <Form.Item name="test" rules={[{ required: true }]}>
          <input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>,
    );

    fireEvent.submit(container.querySelector('form')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain-error')).toHaveTextContent(
      'name is good!',
    );
  });

  it('return same form instance', async () => {
    const instances = new Set();

    const App: React.FC = () => {
      const [form] = Form.useForm();
      instances.add(form);
      const [, forceUpdate] = React.useState({});
      return (
        <button
          type="button"
          onClick={() => {
            forceUpdate({});
          }}
        >
          Refresh
        </button>
      );
    };

    const { container } = pureRender(<App />);

    for (let i = 0; i < 5; i += 1) {
      fireEvent.click(container.querySelector('button')!);

      await waitFakeTimer();
    }

    expect(instances.size).toBe(1);
  });

  it('should avoid re-render', async () => {
    let renderTimes = 0;

    const MyInput: React.FC<{ value?: string }> = ({ value = '', ...props }) => {
      renderTimes += 1;
      return <input value={value} {...props} />;
    };

    const Demo: React.FC = () => (
      <Form>
        <Form.Item name="username" label="username" rules={[{ required: true }]}>
          <MyInput />
        </Form.Item>
      </Form>
    );
    const { container } = pureRender(<Demo />);
    renderTimes = 0;

    await changeValue(0, 'a');

    expect(renderTimes).toEqual(1);
    expect(container.querySelector('input')).toHaveValue('a');
  });

  it('should warning with `defaultValue`', () => {
    render(
      <Form>
        <Form.Item name="light">
          <input defaultValue="should warning" />
        </Form.Item>
      </Form>,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form.Item] `defaultValue` will not work on controlled Field. You should use `initialValues` of Form instead.',
    );
  });

  it('should remove Field and also reset error', async () => {
    const Demo: React.FC<{ showA?: boolean }> = ({ showA }) => (
      <Form>
        {showA ? (
          <Form.Item name="a" help="error">
            <input />
          </Form.Item>
        ) : (
          <Form.Item name="b">
            <input />
          </Form.Item>
        )}
      </Form>
    );

    const { container, rerender } = render(<Demo showA />);

    await waitFakeTimer();
    expect(container.querySelector('.ant-form-item-explain')).toBeTruthy();

    rerender(<Demo showA={false} />);

    await waitFakeTimer();
    expect(container.querySelector('.ant-form-item-explain')).toBeFalsy();
  });

  it('no warning of initialValue & getValueProps & preserve', () => {
    render(
      <Form>
        <Form.Item initialValue="bamboo" getValueProps={() => ({})} preserve={false}>
          <Input />
        </Form.Item>
      </Form>,
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should customize id when pass with id', () => {
    const { container } = render(
      <Form>
        <Form.Item name="light">
          <Input id="bamboo" />
        </Form.Item>
      </Form>,
    );

    expect(container.querySelector('input')!.id).toEqual('bamboo');
  });

  it('should trigger validate when onBlur when pass validateTrigger onBlur', async () => {
    const { container } = render(
      <Form validateTrigger="onBlur">
        <Form.Item name="light" label="light" rules={[{ len: 3 }]}>
          <Input />
        </Form.Item>
      </Form>,
    );

    // type a invalidate value, not trigger validation
    await changeValue(0, '7777');
    expect(container.querySelector('.ant-form-item-explain')).toBeFalsy();

    // tab(onBlur) the input field, trigger and see the alert
    fireEvent.blur(container.querySelector('input')!);
    await waitFakeTimer();

    expect(container.querySelector('.ant-form-item-explain')).toBeTruthy();
  });

  describe('Form item hidden', () => {
    it('should work', () => {
      const { container } = render(
        <Form>
          <Form.Item name="light" hidden>
            <Input />
          </Form.Item>
        </Form>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('noStyle should not work when hidden', () => {
      const { container } = render(
        <Form>
          <Form.Item name="light" hidden noStyle>
            <Input />
          </Form.Item>
        </Form>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('legacy hideRequiredMark', () => {
    it('should work', () => {
      const { container } = render(
        <Form hideRequiredMark role="form">
          <Form.Item name="light" label="light" required>
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(container.querySelector('form')!).toHaveClass('ant-form-hide-required-mark');
    });

    it('priority should be higher than CP', () => {
      const { container, rerender } = render(
        <ConfigProvider form={{ requiredMark: true }}>
          <Form hideRequiredMark role="form">
            <Form.Item name="light" label="light" required>
              <Input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );

      expect(container.querySelector('form')!).toHaveClass('ant-form-hide-required-mark');

      rerender(
        <ConfigProvider form={{ requiredMark: undefined }}>
          <Form hideRequiredMark role="form">
            <Form.Item name="light" label="light" required>
              <Input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );

      expect(container.querySelector('form')!).toHaveClass('ant-form-hide-required-mark');
    });
  });

  it('form should support disabled', () => {
    const App: React.FC = () => (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal" disabled>
        <Form.Item label="Form disabled" name="disabled" valuePropName="checked">
          <Checkbox>disabled</Checkbox>
        </Form.Item>
        <Form.Item label="Radio">
          <Radio.Group>
            <Radio value="apple">Apple</Radio>
            <Radio value="pear">Pear</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Input">
          <Input />
        </Form.Item>
        <Form.Item label="Select">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="TreeSelect">
          <TreeSelect
            treeData={[
              {
                title: 'Light',
                value: 'light',
                children: [{ title: 'Bamboo', value: 'bamboo' }],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Cascader">
          <Cascader
            options={[
              {
                value: 'zhejiang',
                label: 'Zhejiang',
                children: [{ value: 'hangzhou', label: 'Hangzhou' }],
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="DatePicker">
          <DatePicker />
        </Form.Item>
        <Form.Item label="RangePicker">
          <RangePicker />
        </Form.Item>
        <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="TextArea">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Switch" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload />
        </Form.Item>
        <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item>
        <Form.Item label="Slider">
          <Slider />
        </Form.Item>
        <Form.Item label="ColorPicker">
          <ColorPicker />
        </Form.Item>
      </Form>
    );
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('form.item should support layout', () => {
    const App: React.FC = () => (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
        <Form.Item label="name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="horizontal" name="horizontal" layout="horizontal">
          <Input />
        </Form.Item>
        <Form.Item label="vertical" name="vertical" layout="vertical">
          <Input />
        </Form.Item>
      </Form>
    );
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('form.item should support label = null', () => {
    // base size
    const App: React.FC = () => (
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
        <Form.Item label="name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button>Submit</Button>
        </Form.Item>
      </Form>
    );
    const { container } = render(<App />);

    const items = container.querySelectorAll('.ant-form-item');
    const oneItems = items[0].querySelector('.ant-row')?.querySelectorAll('.ant-col');
    expect(oneItems?.[0]).toHaveClass('ant-col-4');
    expect(oneItems?.[0].className.includes('offset')).toBeFalsy();
    expect(oneItems?.[1]).toHaveClass('ant-col-14');
    expect(oneItems?.[1].className.includes('offset')).toBeFalsy();
    const twoItem = items[1].querySelector('.ant-row')?.querySelector('.ant-col');
    expect(twoItem).toHaveClass('ant-col-14 ant-col-offset-4');

    // more size
    const list = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
    list.forEach((size) => {
      const { container } = render(
        <Form labelCol={{ [size]: { span: 4 } }} wrapperCol={{ span: 14 }}>
          <Form.Item label="name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button>Submit</Button>
          </Form.Item>
        </Form>,
      );

      const items = container.querySelectorAll('.ant-form-item');
      const oneItems = items[0].querySelector('.ant-row')?.querySelectorAll('.ant-col');
      expect(oneItems?.[0]).toHaveClass(`ant-col-${size}-4`);
      expect(oneItems?.[0].className.includes('offset')).toBeFalsy();
      expect(oneItems?.[1]).toHaveClass('ant-col-14');
      expect(oneItems?.[1].className.includes('offset')).toBeFalsy();
      const twoItem = items[1].querySelector('.ant-row')?.querySelector('.ant-col');
      expect(twoItem).toHaveClass(`ant-col-14 ant-col-${size}-offset-4`);
    });
  });

  it('form.item should support label = null and labelCol.span = 24', () => {
    // base size
    const App: React.FC = () => (
      <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item label="name" name="name">
          <Input />
        </Form.Item>
        <Form.Item label={null}>
          <Button>Submit</Button>
        </Form.Item>
      </Form>
    );
    const { container } = render(<App />);

    const items = container.querySelectorAll('.ant-form-item');
    const oneItems = items[0].querySelector('.ant-row')?.querySelectorAll('.ant-col');
    expect(oneItems?.[0]).toHaveClass('ant-col-24');
    expect(oneItems?.[0].className.includes('offset')).toBeFalsy();
    expect(oneItems?.[1]).toHaveClass('ant-col-24');
    expect(oneItems?.[1].className.includes('offset')).toBeFalsy();
    const twoItem = items[1].querySelector('.ant-row')?.querySelector('.ant-col');
    expect(twoItem).toHaveClass('ant-col-24');
    expect(twoItem?.className.includes('offset')).toBeFalsy();

    // more size
    const list = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
    list.forEach((size) => {
      const { container } = render(
        <Form labelCol={{ [size]: { span: 24 } }} wrapperCol={{ span: 24 }}>
          <Form.Item label="name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label={null}>
            <Button>Submit</Button>
          </Form.Item>
        </Form>,
      );

      const items = container.querySelectorAll('.ant-form-item');
      const oneItems = items[0].querySelector('.ant-row')?.querySelectorAll('.ant-col');
      expect(oneItems?.[0]).toHaveClass(`ant-col-${size}-24`);
      expect(oneItems?.[0].className.includes('offset')).toBeFalsy();
      expect(oneItems?.[1]).toHaveClass('ant-col-24');
      expect(oneItems?.[1].className.includes('offset')).toBeFalsy();
      const twoItem = items[1].querySelector('.ant-row')?.querySelector('.ant-col');
      expect(twoItem).toHaveClass(`ant-col-24`);
      expect(twoItem?.className.includes('offset')).toBeFalsy();
    });
  });

  describe('_internalItemRender props', () => {
    it('should work (legacy)', () => {
      const { container } = render(
        <Form>
          <Form.Item
            name="light"
            // @ts-ignore
            _internalItemRender={{
              mark: 'pro_table_render',
              render: (_: any, doms: any) => (
                <div>
                  <div className="bamboo">warning title</div>
                  {doms.input}
                  {doms.errorList}
                  {doms.extra}
                </div>
              ),
            }}
          >
            <input defaultValue="should warning" />
          </Form.Item>
        </Form>,
      );

      expect(container.querySelector('.bamboo')!).toHaveTextContent(/warning title/i);
    });

    it('`prepare` should work', () => {
      const mockPrepare = jest.fn().mockImplementation((_, doms) => {
        return {
          ...doms,
          extra: (
            <div>
              <div className="bamboo">hello</div>
              {doms.extra}
            </div>
          ),
        };
      });

      const mockRender = jest.fn();

      const { container } = render(
        <Form>
          <Form.Item
            name="light"
            // @ts-ignore
            _internalItemRender={{
              mark: 'pro_table_render',
              prepare: mockPrepare,
              render: mockRender,
            }}
          >
            <input defaultValue="should warning" />
          </Form.Item>
        </Form>,
      );

      expect(mockPrepare).toHaveBeenCalled();
      expect(mockRender).not.toHaveBeenCalled();

      expect(mockPrepare).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.any(Array),
          warnings: expect.any(Array),
        }),
        // https://zirkelc.dev/posts/use-expectobjectcontaining-with-null-and-undefined
        expect.objectContaining({
          input: expect.anything(),
          errorList: expect.toBeOneOf([expect.anything(), null]),
          extra: expect.toBeOneOf([expect.anything(), null]),
        }),
      );

      expect(container.querySelector('.bamboo')!).toHaveTextContent(/hello/i);
    });
  });

  it('Form Item element id will auto add form_item prefix if form name is empty and item name is in the black list', async () => {
    const mockFn = jest.spyOn(Util, 'getFieldId');
    const itemName = 'parentNode';
    // mock getFieldId old logic
    // if form name is empty and item name is parentNode
    // will get parentNode
    mockFn.mockImplementation(() => itemName);
    const { Option } = Select;
    const Demo: React.FC = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Form>
            <Form.Item name={itemName} label={itemName}>
              <Select
                className="form_item_parentNode"
                defaultValue="lucy"
                open={open}
                style={{ width: 120 }}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Form.Item>
          </Form>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
            }}
          >
            {open ? 'show' : 'hidden'}
          </button>
        </>
      );
    };

    const { container, rerender } = render(<Demo />);
    expect(mockFn).toHaveBeenCalled();
    expect((Util.getFieldId as () => string)()).toBe(itemName);

    // make sure input id is parentNode
    expect(screen.getByLabelText(itemName)).toHaveAccessibleName(itemName);

    fireEvent.click(container.querySelector('button')!);
    await waitFakeTimer();

    expect(container.querySelector('button')!).toHaveTextContent('show');

    mockFn.mockRestore();

    rerender(<Demo />);
    expect(screen.getByLabelText(itemName)).toBeInTheDocument();
  });

  describe('tooltip', () => {
    it('ReactNode', async () => {
      const { container } = render(
        <Form>
          <Form.Item label="light" tooltip={<span>Bamboo</span>}>
            <Input />
          </Form.Item>
        </Form>,
      );

      fireEvent.mouseEnter(container.querySelector('.anticon-question-circle')!);
      await waitFakeTimer();

      expect(container.querySelector('.ant-tooltip-inner')).toHaveTextContent('Bamboo');
    });

    it('config tooltip should show when hover on icon', async () => {
      const { container } = render(
        <Form>
          <Form.Item label="light" tooltip={{ title: 'Bamboo' }}>
            <Input />
          </Form.Item>
        </Form>,
      );

      fireEvent.mouseEnter(container.querySelector('.anticon-question-circle')!);
      fireEvent.click(container.querySelector('.anticon-question-circle')!);
      await waitFakeTimer();

      expect(container.querySelector('.ant-tooltip-inner')).toHaveTextContent('Bamboo');
    });
  });

  it('warningOnly validate', async () => {
    const { container } = render(
      <Form>
        <Form.Item>
          <Form.Item
            name="test"
            label="test"
            initialValue="bamboo"
            rules={[{ required: true, warningOnly: true }]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form>,
    );

    await changeValue(0, 'test');
    await changeValue(0, '');

    expect(container.querySelector('.ant-form-item-with-help')).toBeTruthy();
    expect(container.querySelector('.ant-form-item-has-warning')).toBeTruthy();
  });

  it('not warning when remove on validate', async () => {
    let rejectFn: (reason?: any) => void = jest.fn();

    const { unmount } = render(
      <Form>
        <Form.Item>
          <Form.Item
            noStyle
            name="test"
            initialValue="bamboo"
            rules={[
              {
                validator: () =>
                  new Promise((_, reject) => {
                    rejectFn = reject;
                  }),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form.Item>
      </Form>,
    );

    await changeValue(0, '');

    unmount();

    // Delay validate failed
    rejectFn(new Error('delay failed'));

    expect(errorSpy).not.toHaveBeenCalled();
  });

  describe('form colon', () => {
    it('default colon', () => {
      render(
        <Form>
          <Form.Item label="姓名" name="姓名">
            <input />
          </Form.Item>
        </Form>,
      );

      expect(screen.getByText('姓名')).not.toHaveClass('ant-form-item-no-colon');
    });

    it('set Form.Item colon false', () => {
      render(
        <Form colon>
          <Form.Item colon={false} label="姓名" name="姓名">
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(screen.getByText('姓名')).toHaveClass('ant-form-item-no-colon');
    });

    it('set Form colon false', () => {
      render(
        <Form colon={false}>
          <Form.Item label="姓名" name="姓名">
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(screen.getByText('姓名')).toHaveClass('ant-form-item-no-colon');
    });
  });

  it('useFormInstance', () => {
    let formInstance: any;
    let subFormInstance: any;

    const Sub = () => {
      const formSub = Form.useFormInstance();
      subFormInstance = formSub;

      return null;
    };

    const Demo: React.FC = () => {
      const [form] = Form.useForm();
      formInstance = form;

      return (
        <Form form={form}>
          <Sub />
        </Form>
      );
    };

    render(<Demo />);
    expect(subFormInstance).toBe(formInstance);
  });

  describe('noStyle with status', () => {
    it('noStyle should not affect status', async () => {
      const Demo: React.FC = () => (
        <Form>
          {/* should change status */}
          <Form.Item validateStatus="error" noStyle>
            <Select className="custom-select" />
          </Form.Item>

          {/* should follow parent status */}
          <Form.Item validateStatus="error" hasFeedback>
            <Form.Item noStyle>
              <Select className="custom-select-b" />
            </Form.Item>
          </Form.Item>

          {/* should follow child status */}
          <Form.Item validateStatus="error" hasFeedback>
            <Form.Item noStyle validateStatus="warning" hasFeedback={false}>
              <Select className="custom-select-c" />
            </Form.Item>
          </Form.Item>

          {/* should follow child status */}
          <Form.Item noStyle>
            <Form.Item validateStatus="warning">
              <Select className="custom-select-d" />
            </Form.Item>
          </Form.Item>

          {/* should follow child status */}
          <Form.Item validateStatus="error">
            <Form.Item noStyle validateStatus="">
              <Select className="custom-select-e" />
            </Form.Item>
          </Form.Item>
        </Form>
      );
      const { container } = render(<Demo />);

      await waitFakeTimer();

      expect(container.querySelector('.custom-select')).toHaveClass('ant-select-status-error');
      expect(container.querySelector('.custom-select')).not.toHaveClass('ant-select-in-form-item');

      expect(container.querySelector('.custom-select-b')).toHaveClass('ant-select-status-error');
      expect(container.querySelector('.custom-select-b')).toHaveClass('ant-select-in-form-item');
      expect(
        container
          .querySelector('.custom-select-b')
          ?.querySelector('.ant-form-item-feedback-icon-error'),
      ).toBeTruthy();

      expect(container.querySelector('.custom-select-c')).toHaveClass('ant-select-status-warning');
      expect(container.querySelector('.custom-select-c')).toHaveClass('ant-select-in-form-item');
      expect(
        container
          .querySelector('.custom-select-c')
          ?.querySelector('.ant-form-item-feedback-icon-warning'),
      ).toBeFalsy();

      expect(container.querySelector('.custom-select-d')).toHaveClass('ant-select-status-warning');
      expect(container.querySelector('.custom-select-d')).toHaveClass('ant-select-in-form-item');

      expect(container.querySelector('.custom-select-e')).not.toHaveClass(
        'ant-select-status-error',
      );
      expect(container.querySelector('.custom-select-e')).toHaveClass('ant-select-in-form-item');
    });

    it('parent pass status', async () => {
      const { container } = render(
        <Form>
          <Form.Item label="name">
            <Form.Item name="first" noStyle rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="last" noStyle>
              <Input />
            </Form.Item>
          </Form.Item>
        </Form>,
      );

      // Input and set back to empty
      await changeValue(0, 'Once');
      await changeValue(0, '');

      expect(container.querySelector('.ant-form-item-explain-error')?.textContent).toEqual(
        "'first' is required",
      );

      expect(container.querySelectorAll('input')[0]).toHaveClass('ant-input-status-error');
      expect(container.querySelectorAll('input')[1]).not.toHaveClass('ant-input-status-error');
    });
  });

  it('should not affect Popup children style', () => {
    const Demo: React.FC = () => (
      <Form>
        <Form.Item labelCol={4 as ColProps} validateStatus="error">
          <Modal open>
            <Select className="modal-select" />
          </Modal>
        </Form.Item>
        <Form.Item validateStatus="error">
          <Drawer open>
            <Select className="drawer-select" />
          </Drawer>
        </Form.Item>
      </Form>
    );
    const { container } = render(<Demo />, { container: document.body });
    expect(container.querySelector('.modal-select')?.className).not.toContain('in-form-item');
    expect(container.querySelector('.modal-select')?.className).not.toContain('status-error');
    expect(container.querySelector('.drawer-select')?.className).not.toContain('in-form-item');
    expect(container.querySelector('.drawer-select')?.className).not.toContain('status-error');
  });

  it('should be set up correctly marginBottom', () => {
    render(
      <Modal open>
        <Form>
          <Form.Item help="This is a help message">
            <Input />
          </Form.Item>
        </Form>
      </Modal>,
    );

    expect(document.querySelector('.ant-form-item-margin-offset')).toBeTruthy();
  });

  it('Form.Item.useStatus should work', async () => {
    const {
      Item: { useStatus },
    } = Form;

    const CustomInput: React.FC<{ className?: string; value?: React.ReactNode }> = ({
      className,
      value,
    }) => {
      const { status } = useStatus();
      return <div className={classNames(className, `custom-input-status-${status}`)}>{value}</div>;
    };

    const Demo: React.FC = () => {
      const [form] = Form.useForm();

      return (
        <Form form={form} name="my-form">
          <Form.Item name="required" rules={[{ required: true }]}>
            <CustomInput className="custom-input-required" value="" />
          </Form.Item>
          <Form.Item name="warning" validateStatus="warning">
            <CustomInput className="custom-input-warning" />
          </Form.Item>
          <Form.Item name="normal">
            <CustomInput className="custom-input" />
          </Form.Item>
          <CustomInput className="custom-input-wrong" />
          <Button onClick={() => form.submit()} className="submit-button">
            Submit
          </Button>
        </Form>
      );
    };

    const { container } = render(<Demo />);

    expect(container.querySelector('.custom-input-required')?.className).toContain(
      'custom-input-status-',
    );
    expect(container.querySelector('.custom-input-warning')?.classList).toContain(
      'custom-input-status-warning',
    );
    expect(container.querySelector('.custom-input')?.className).toContain('custom-input-status-');
    expect(container.querySelector('.custom-input-wrong')?.classList).toContain(
      'custom-input-status-undefined',
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Form.Item.useStatus should be used under Form.Item component.'),
    );

    fireEvent.click(container.querySelector('.submit-button')!);
    await waitFakeTimer();

    expect(container.querySelector('.custom-input-required')?.classList).toContain(
      'custom-input-status-error',
    );
  });

  it('Form.Item.useStatus should supports get error messages and warning messages', async () => {
    const {
      Item: { useStatus },
    } = Form;

    const ErrorItem: React.FC = () => {
      const { errors } = useStatus();
      return <div className="test-error">{errors[0]}</div>;
    };

    const WarningItem: React.FC = () => {
      const { warnings } = useStatus();
      return <div className="test-warning">{warnings[0]}</div>;
    };

    const Demo: React.FC = () => {
      const [form] = Form.useForm();

      return (
        <Form form={form} name="test-form">
          <Form.Item name="error" rules={[{ required: true, message: 'This is a error message.' }]}>
            <ErrorItem />
          </Form.Item>
          <Form.Item
            name="warning"
            rules={[{ required: true, message: 'This is a warning message.', warningOnly: true }]}
          >
            <WarningItem />
          </Form.Item>
          <Button onClick={() => form.submit()} className="submit-button">
            Submit
          </Button>
        </Form>
      );
    };

    const { container } = render(<Demo />);

    fireEvent.click(container.querySelector('.submit-button')!);
    await waitFakeTimer();

    expect(container.querySelector('.test-error')).toHaveTextContent('This is a error message.');
    expect(container.querySelector('.test-warning')).toHaveTextContent(
      'This is a warning message.',
    );
  });

  it('item customize margin', async () => {
    const computeSpy = jest
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(() => ({ marginBottom: 24 }) as unknown as CSSStyleDeclaration);

    const { container } = render(
      <Form>
        <Form.Item name="required" initialValue="bamboo" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>,
    );

    await changeValue(0, '');

    computeSpy.mockRestore();

    expect(container.querySelector('.ant-form-item-margin-offset')).toHaveStyle({
      marginBottom: -24,
    });
  });

  it('form child components should be given priority to own disabled props when it in a disabled form', () => {
    const props = {
      name: 'file',
      action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
      headers: {
        authorization: 'authorization-text',
      },
      capture: true,
    };
    const renderComps = (disabled?: boolean) => [
      <Button key="Button" disabled={disabled} type="primary" htmlType="submit">
        test
      </Button>,
      <Cascader key="Cascader" disabled={disabled} options={[]} />,
      <Checkbox key="Checkbox" disabled={disabled} />,
      <Checkbox.Group
        key="CheckboxGroup"
        disabled={disabled}
        options={[
          { label: 'male', value: 0 },
          { label: 'female', value: 1 },
        ]}
      />,
      <ColorPicker key="ColorPicker" disabled={disabled} />,
      <InputNumber key="InputNumber" disabled={disabled} />,
      <Input key="Input" disabled={disabled} />,
      <Select key="Select" disabled={disabled} />,
      <Switch key="Switch" disabled={disabled} />,
      <TreeSelect key="TreeSelect" disabled={disabled} />,
      <Upload key="Upload" {...props} disabled={disabled}>
        <Button disabled={disabled}>Click to Upload</Button>
      </Upload>,
      <DatePicker key="DatePicker" disabled={disabled} />,
      <DatePicker.RangePicker key="DatePicker.RangePicker" disabled={disabled} />,
      <DatePicker.MonthPicker key="DatePicker.MonthPicker" disabled={disabled} />,
      <DatePicker.QuarterPicker key="DatePicker.QuarterPicker" disabled={disabled} />,
      <DatePicker.WeekPicker key="DatePicker.WeekPicker" disabled={disabled} />,
      <DatePicker.YearPicker key="DatePicker.YearPicker" disabled={disabled} />,
      <DatePicker.TimePicker key="DatePicker.TimePicker" disabled={disabled} />,
    ];
    const App: React.FC = () => <Form disabled>{renderComps(false)}</Form>;

    const wrapper = render(<App />);
    expect(wrapper.container.querySelectorAll('[disabled]').length).toBe(0);
    const App2 = () => <Form disabled>{renderComps()}</Form>;

    const wrapper2 = render(<App2 />);
    // 时间范围组件中会有两个 input 框，Upload 为叠加
    // 因此虽然上述只有 18 个组件，但实际有 20 个 带有 disabled 属性的表单组件
    expect(wrapper2.container.querySelectorAll('[disabled]').length).toBe(20);

    const App3 = () => <Form disabled>{renderComps(true)}</Form>;

    const wrapper3 = render(<App3 />);

    expect(wrapper3.container.querySelectorAll('[disabled]').length).toBe(20);

    const App4 = () => <Form>{renderComps(true)}</Form>;

    const wrapper4 = render(<App4 />);

    expect(wrapper4.container.querySelectorAll('[disabled]').length).toBe(20);

    const App5 = () => <Form>{renderComps()}</Form>;

    const wrapper5 = render(<App5 />);

    expect(wrapper5.container.querySelectorAll('[disabled]').length).toBe(0);
  });

  it('success feedback should display when pass hasFeedback prop and current value is valid value', async () => {
    const App = ({ trigger = false }: { trigger?: boolean }) => {
      const form = useRef<FormInstance<any>>(null);

      useEffect(() => {
        if (!trigger) {
          return;
        }
        form.current?.validateFields();
      }, [trigger]);

      return (
        <Form ref={form}>
          <Form.Item
            label="Success"
            name="name1"
            hasFeedback
            initialValue="test@qq.com"
            rules={[
              {
                type: 'email',
                message: 'Please input your e-mail',
              },
              {
                required: true,
                message: 'Please input your value',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Success"
            name="name2"
            initialValue="test@qq.com"
            rules={[
              {
                type: 'email',
                message: 'Please input your e-mail',
              },
              {
                required: true,
                message: 'Please input your value',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      );
    };
    const { container, rerender } = render(<App />);

    expect(container.querySelectorAll('.ant-form-item-has-feedback').length).toBe(0);
    expect(container.querySelectorAll('.ant-form-item-has-success').length).toBe(0);

    rerender(<App trigger />);
    await waitFakeTimer();

    expect(container.querySelectorAll('.ant-form-item-has-feedback').length).toBe(1);
    expect(container.querySelectorAll('.ant-form-item-has-success').length).toBe(1);
  });

  it('feedback should automatically derive the correct state', async () => {
    const Demo: React.FC = () => {
      const [form] = Form.useForm();

      return (
        <Form form={form}>
          <Form.Item name="success" initialValue="test" hasFeedback rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="validating"
            hasFeedback
            rules={[
              {
                validator: () =>
                  new Promise((resolve) => {
                    setTimeout(() => resolve(true), 2000);
                  }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="warning" hasFeedback rules={[{ required: true, warningOnly: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="error" hasFeedback rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button onClick={() => form.submit()} className="submit-button">
            Submit
          </Button>
        </Form>
      );
    };
    const { container } = render(<Demo />);

    fireEvent.click(container.querySelector('.submit-button')!);

    await waitFakeTimer(50);

    expect(container.querySelector('.ant-form-item-has-success')).toBeTruthy();
    expect(container.querySelector('.ant-form-item-is-validating')).toBeTruthy();
    expect(container.querySelector('.ant-form-item-has-warning')).toBeTruthy();
    expect(container.querySelector('.ant-form-item-has-error')).toBeTruthy();
  });

  it('custom feedback icons should display when pass hasFeedback prop', async () => {
    const App = ({ trigger = false }: { trigger?: boolean }) => {
      const form = useRef<FormInstance<any>>(null);

      useEffect(() => {
        if (!trigger) {
          return;
        }
        form.current?.validateFields();
      }, [trigger]);

      return (
        <Form
          ref={form}
          feedbackIcons={() => ({
            error: <AlertFilled id="custom-error-icon" />,
          })}
        >
          <Form.Item
            label="Success"
            name="name1"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your value',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Success"
            name="name1"
            hasFeedback={{
              icons: () => ({
                error: <AlertFilled id="custom-error-icon2" />,
              }),
            }}
            rules={[
              {
                required: true,
                message: 'Please input your value 3',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      );
    };
    const { container, rerender } = render(<App />);

    expect(container.querySelectorAll('.ant-form-item-has-feedback').length).toBe(0);

    rerender(<App trigger />);
    await waitFakeTimer();

    expect(container.querySelectorAll('.ant-form-item-has-feedback').length).toBe(2);
    expect(container.querySelectorAll('#custom-error-icon, #custom-error-icon2').length).toBe(2);
  });

  // https://github.com/ant-design/ant-design/issues/41621
  it('should not override value when pass `undefined` to require', async () => {
    // When require is `undefined`, the `isRequire` calculation logic should be preserved
    const { container } = render(
      <Form>
        <Form.Item label="test" name="success" required={undefined} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>,
    );

    expect(container.querySelector('.ant-form-item-required')).toBeTruthy();
  });

  it('validate status should be change in order', async () => {
    const onChange = jest.fn();

    const CustomInput = (props: any) => {
      const { status } = Form.Item.useStatus();
      useEffect(() => {
        onChange(status);
      }, [status]);
      return <Input {...props} />;
    };

    const App: React.FC = () => (
      <Form>
        <Form.Item>
          <Form.Item name="test" label="test" rules={[{ len: 3, message: 'error.' }]}>
            <CustomInput />
          </Form.Item>
        </Form.Item>
      </Form>
    );

    render(<App />);
    await waitFakeTimer();

    // initial validate
    const initTriggerTime = ReactVersion.startsWith('18') || ReactVersion.startsWith('19') ? 2 : 1;
    expect(onChange).toHaveBeenCalledTimes(initTriggerTime);
    let idx = 1;
    expect(onChange).toHaveBeenNthCalledWith(idx++, '');
    if (initTriggerTime === 2) {
      expect(onChange).toHaveBeenNthCalledWith(idx++, '');
    }

    // change trigger
    await changeValue(0, '1');
    expect(onChange).toHaveBeenCalledTimes(initTriggerTime + 2);
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'validating');
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'error');
    await changeValue(0, '11');
    expect(onChange).toHaveBeenCalledTimes(initTriggerTime + 4);
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'validating');
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'error');
    await changeValue(0, '111');
    expect(onChange).toHaveBeenCalledTimes(initTriggerTime + 6);
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'validating');
    expect(onChange).toHaveBeenNthCalledWith(idx++, 'success');
  });

  describe('requiredMark', () => {
    // https://user-images.githubusercontent.com/32004925/230819163-464fe90d-422d-4a6d-9e35-44a25d4c64f1.png
    it('should not render `requiredMark` when Form.Item has no required prop', () => {
      // Escaping TypeScript error
      const genProps = (value: any) => ({ ...value });

      const { container } = render(
        <Form name="basic" requiredMark="optional">
          <Form.Item
            label="First Name"
            name="firstName"
            required
            {...genProps({ requiredMark: false })}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            required
            {...genProps({ requiredMark: true })}
          >
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(container.querySelectorAll('.ant-form-item-required')).toHaveLength(2);
      expect(container.querySelectorAll('.ant-form-item-required-mark-optional')).toHaveLength(2);
    });

    it('customize logic', () => {
      const { container } = render(
        <Form name="basic" requiredMark={(label, info) => `${label}: ${info.required}`}>
          <Form.Item label="Required" required>
            <Input />
          </Form.Item>
          <Form.Item label="Optional">
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(container.querySelectorAll('.ant-form-item-label')[0].textContent).toEqual(
        'Required: true',
      );
      expect(container.querySelectorAll('.ant-form-item-label')[1].textContent).toEqual(
        'Optional: false',
      );
    });
  });

  it('children support comment', () => {
    resetWarned();

    const { container } = render(
      <Form initialValues={{ name: 'bamboo', age: '14' }}>
        <Form.Item name="name">
          {/* Comment here */}
          <Input />
        </Form.Item>
        <Form.Item name="age">{[null, <Input key="input" />]}</Form.Item>
      </Form>,
    );

    expect(container.querySelectorAll('input')[0].value).toEqual('bamboo');
    expect(container.querySelectorAll('input')[1].value).toEqual('14');
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('duplicated form name', () => {
    resetWarned();

    render(
      <>
        <Form name="same" />
        <Form name="same" />
      </>,
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Form] There exist multiple Form with same `name`.',
    );
  });

  // https://github.com/ant-design/ant-design/issues/43044
  it('should not pass disabled to modal footer button', () => {
    render(
      // <FormDemo formProps={{ disabled: true }} modalProps={{ open: true }} />,
      <Form disabled>
        <Form.Item label="label">
          <Modal open />
        </Form.Item>
      </Form>,
    );

    const footerBts = document.querySelectorAll('.ant-modal-footer > button');
    expect(footerBts).toBeTruthy();

    footerBts.forEach((bt) => {
      expect(bt).not.toHaveAttribute('disabled');
    });
  });

  it('InputNumber with hasFeedback should keep dom stable', () => {
    const Demo = () => (
      <Form>
        <Form.Item
          name="light"
          hasFeedback
          rules={[{ required: true, message: 'Please input a entry price' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    );
    const { container } = render(<Demo />);

    const input = container.querySelector('input')!;

    expect(container.querySelector('.ant-input-number-suffix')).toBeTruthy();

    fireEvent.focus(input);

    expect(container.querySelector('.ant-input-number-focused')).toBeTruthy();

    fireEvent.change(input, {
      target: { value: '1' },
    });

    expect(container.querySelector('.ant-input-number-suffix')).toBeTruthy();
    expect(container.querySelector('.ant-input-number-focused')).toBeTruthy();
  });

  // https://github.com/ant-design/ant-design/issues/20803#issuecomment-601626759
  it('without explicitly passing `valuePropName`', async () => {
    const submit = jest.fn();
    const Demo = () => (
      <Form
        initialValues={{
          foo: true,
        }}
        onFinish={submit}
      >
        <Form.Item label="Switch" name="foo">
          <Switch />
        </Form.Item>
        <button type="submit">Submit</button>
      </Form>
    );

    const { getByRole } = render(<Demo />);

    await waitFakeTimer();

    const switchNode = getByRole('switch');

    expect(switchNode).toBeTruthy();
    expect(switchNode).toBeChecked();

    fireEvent.click(switchNode);
    expect(switchNode).not.toBeChecked();

    const submitButton = getByRole('button');
    expect(submitButton).toBeTruthy();
    fireEvent.click(submitButton);

    await waitFakeTimer();

    expect(submit).toHaveBeenCalledWith({
      foo: false,
    });
  });

  it('getValueProps should trigger update', () => {
    const { container } = render(
      <Form>
        <Form.Item
          name="remember"
          getValueProps={(val) => ({ checked: val })}
          getValueFromEvent={(e) => e.target.checked}
        >
          <Checkbox />
        </Form.Item>
      </Form>,
    );

    expect(container.querySelector('input')?.checked).toBeFalsy();

    fireEvent.click(container.querySelector('input')!);
    expect(container.querySelector('input')?.checked).toBeTruthy();
  });

  it('not warning for react key', async () => {
    const MockInput = (props: { onChange?: (value: number[]) => void }) => (
      <Input
        onChange={({ target: { value } }) => {
          props.onChange?.(value.split(',').map(Number));
        }}
      />
    );

    const { container } = render(
      <Form>
        <Form.Item>
          <Form.Item
            name="test"
            rules={[
              {
                type: 'array',
                defaultField: {
                  type: 'number',
                  min: 10,
                  message: 'LESS_THAN_10',
                },
              },
            ]}
          >
            <MockInput />
          </Form.Item>
        </Form.Item>
      </Form>,
    );

    function expectErrors(errors: string[]) {
      expect(container.querySelectorAll('.ant-form-item-explain-error')).toHaveLength(
        errors.length,
      );
      errors.forEach((error, index) => {
        expect(container.querySelectorAll('.ant-form-item-explain-error')[index]).toHaveTextContent(
          error,
        );
      });
    }

    // user type something and clear
    await changeValue(0, '1');
    expectErrors(['LESS_THAN_10']);

    await changeValue(0, '1,1');
    expectErrors(['LESS_THAN_10', 'LESS_THAN_10']);

    await changeValue(0, '1');
    expectErrors(['LESS_THAN_10']);

    await changeValue(0, '100');
    expectErrors([]);
  });
});
