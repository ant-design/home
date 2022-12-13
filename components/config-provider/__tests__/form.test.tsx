import React from 'react';
import { act } from 'react-dom/test-utils';
import scrollIntoView from 'scroll-into-view-if-needed';
import ConfigProvider from '..';
import { fireEvent, render, waitFakeTimer } from '../../../tests/utils';
import type { FormInstance } from '../../form';
import Form from '../../form';
import Button from '../../button';
import Input from '../../input';
import zhCN from '../../locale/zh_CN';

jest.mock('scroll-into-view-if-needed');

describe('ConfigProvider.Form', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeAll(() => {
    jest.useFakeTimers();
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
  (scrollIntoView as any).mockImplementation(() => {});

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useFakeTimers();
    (scrollIntoView as any).mockReset();
  });

  describe('form validateMessages', () => {
    const renderComponent = ({ validateMessages }: { validateMessages?: any }) => {
      const formRef = React.createRef<FormInstance>();
      const { container } = render(
        <ConfigProvider locale={zhCN} form={{ validateMessages }}>
          <Form ref={formRef} initialValues={{ age: 18 }}>
            <Form.Item name="test" label="姓名" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item name="age" label="年龄" rules={[{ type: 'number', len: 17 }]}>
              <input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );
      return [container, formRef] as const;
    };

    it('set locale zhCN', async () => {
      const [container, formRef] = renderComponent({});

      await act(async () => {
        try {
          await formRef.current?.validateFields();
        } catch (e) {
          // Do nothing
        }
      });

      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(container.querySelector('.ant-form-item-explain')).toHaveTextContent('请输入姓名');
    });

    it('set locale zhCN and set form validateMessages one item, other use default message', async () => {
      const [container, formRef] = renderComponent({ validateMessages: { required: '必须' } });

      await act(async () => {
        try {
          await formRef.current?.validateFields();
        } catch (e) {
          // Do nothing
        }
      });

      await act(async () => {
        jest.runAllTimers();
        await Promise.resolve();
      });

      act(() => {
        jest.runAllTimers();
      });

      const explains = Array.from(container.querySelectorAll('.ant-form-item-explain'));

      expect(explains[0]).toHaveTextContent('必须');
      expect(explains[explains.length - 1]).toHaveTextContent('年龄必须等于17');
    });
  });

  describe('form requiredMark', () => {
    it('set requiredMark optional', () => {
      const { container } = render(
        <ConfigProvider form={{ requiredMark: 'optional' }}>
          <Form initialValues={{ age: 18 }}>
            <Form.Item name="age" label="年龄" rules={[{ type: 'number', len: 17 }]}>
              <input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('form scrollToFirstError', () => {
    it('set center, form not set', async () => {
      const onFinishFailed = jest.fn();
      const { container } = render(
        <ConfigProvider form={{ scrollToFirstError: { block: 'center' } }}>
          <Form onFinishFailed={onFinishFailed}>
            <Form.Item name="test" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </ConfigProvider>,
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

    it('not set, form not center', async () => {
      const onFinishFailed = jest.fn();
      const { container } = render(
        <ConfigProvider>
          <Form scrollToFirstError={{ block: 'center' }} onFinishFailed={onFinishFailed}>
            <Form.Item name="test" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </ConfigProvider>,
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

    it('set center, form set false', async () => {
      const onFinishFailed = jest.fn();
      const { container } = render(
        <ConfigProvider form={{ scrollToFirstError: { block: 'center' } }}>
          <Form scrollToFirstError={false} onFinishFailed={onFinishFailed}>
            <Form.Item name="test" rules={[{ required: true }]}>
              <input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );
      expect(scrollIntoView).not.toHaveBeenCalled();
      fireEvent.submit(container.querySelector('form')!);
      await waitFakeTimer();

      expect(scrollIntoView).not.toHaveBeenCalled();
      expect(onFinishFailed).toHaveBeenCalled();
    });
  });

  describe('form colon', () => {
    it('set colon false', () => {
      const { container } = render(
        <ConfigProvider form={{ colon: false }}>
          <Form>
            <Form.Item label="没有冒号">
              <input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );
      expect(container.querySelector('.ant-form-item-no-colon')).toBeTruthy();
    });

    it('set colon default', () => {
      const { container } = render(
        <ConfigProvider>
          <Form>
            <Form.Item label="姓名">
              <input />
            </Form.Item>
          </Form>
        </ConfigProvider>,
      );
      expect(container.querySelector('.ant-form-item-no-colon')).toBeFalsy();
    });
  });

  describe('form disabled', () => {
    it('set Input enabled', () => {
      const { container } = render(
        <Form disabled>
          <ConfigProvider componentDisabled={false}>
            <Form.Item name="input1" label="启用">
              <Input />
            </Form.Item>
          </ConfigProvider>
          <Form.Item name="input" label="禁用">
            <Input />
          </Form.Item>
        </Form>,
      );

      expect(container.querySelector('#input1[disabled]')).toBeFalsy();
      expect(container.querySelector('#input[disabled]')).toBeTruthy();
    });
  });
});
