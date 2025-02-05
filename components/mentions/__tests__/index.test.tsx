import React from 'react';

import Mentions, { Option } from '..';
import focusTest from '../../../tests/shared/focusTest';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { act, fireEvent, render } from '../../../tests/utils';
import KeyCode from 'rc-util/lib/KeyCode';

const { getMentions } = Mentions;

function simulateInput(wrapper: ReturnType<typeof render>, text: string, keyEvent?: Event): void {
  const lastChar = text[text.length - 1];
  const myKeyEvent = keyEvent || {
    which: lastChar.charCodeAt(0),
    key: lastChar,
    target: {
      value: text,
      selectionStart: text.length,
    },
  };

  fireEvent.keyDown(wrapper.container.querySelector('textarea')!, myKeyEvent);

  const textareaInstance = wrapper.container.querySelector('textarea');

  if (textareaInstance) {
    textareaInstance.value = text;
    textareaInstance.selectionStart = text.length;
    textareaInstance.selectionStart = text.length;
  }

  if (!keyEvent) {
    fireEvent.change(wrapper.container.querySelector('textarea')!, { target: { value: text } });
  }
  fireEvent.keyUp(wrapper.container.querySelector('textarea')!, myKeyEvent);
}

describe('Mentions', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('getMentions', () => {
    const mentions = getMentions('@light #bamboo cat', { prefix: ['@', '#'] });
    expect(mentions).toEqual([
      { prefix: '@', value: 'light' },
      { prefix: '#', value: 'bamboo' },
    ]);
  });

  it('focus', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    const { container } = render(<Mentions onFocus={onFocus} onBlur={onBlur} />);
    fireEvent.focus(container.querySelector('textarea')!);
    expect(container.querySelector('.ant-mentions')).toHaveClass('ant-mentions-focused');
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(container.querySelector('textarea')!);
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('.ant-mentions')).not.toHaveClass('ant-mentions-focused');
    expect(onBlur).toHaveBeenCalled();
  });

  focusTest(Mentions, { refFocus: true });
  mountTest(Mentions);
  rtlTest(Mentions);

  it('loading', () => {
    const wrapper = render(<Mentions loading />);
    simulateInput(wrapper, '@');
    expect(wrapper.container.querySelectorAll('li.ant-mentions-dropdown-menu-item').length).toBe(1);
    expect(wrapper.container.querySelectorAll('.ant-spin').length).toBeTruthy();
  });

  it('notFoundContent', () => {
    const wrapper = render(<Mentions notFoundContent={<span className="bamboo-light" />} />);
    simulateInput(wrapper, '@');
    expect(wrapper.container.querySelectorAll('li.ant-mentions-dropdown-menu-item').length).toBe(1);
    expect(wrapper.container.querySelectorAll('.bamboo-light').length).toBeTruthy();
  });

  it('allowClear', () => {
    const wrapper = render(<Mentions allowClear />);
    simulateInput(wrapper, '111');
    const textareaInstance = wrapper.container.querySelector('textarea')!;
    expect(textareaInstance.value).toEqual('111');
    fireEvent.click(wrapper.container.querySelector('.ant-mentions-clear-icon')!);
    expect(textareaInstance.value).toEqual('');
  });

  it('should delete last item when Delete key is pressed', () => {
    const { getByRole } = render(
      <Mentions
        style={{ width: '100%' }}
        defaultValue="@afc163@zombieJ"
        itemOnceDelete
        options={[
          {
            value: 'afc163',
            label: 'afc163',
          },
          {
            value: 'zombieJ',
            label: 'zombieJ',
          },
          {
            value: 'yesmeck',
            label: 'yesmeck',
          },
        ]}
      />,
    );
    const textarea = getByRole('textbox') as HTMLTextAreaElement;
    textarea.selectionStart = textarea.value.length;
    textarea.selectionEnd = textarea.value.length;
    fireEvent.keyDown(textarea, { key: 'Delete', keyCode: KeyCode.BACKSPACE });
    expect(textarea.value).toBe('@afc163 ');
  });

  it('should support custom clearIcon', () => {
    const { container } = render(<Mentions allowClear={{ clearIcon: 'clear' }} />);
    expect(container.querySelector('.ant-mentions-clear-icon')?.textContent).toBe('clear');
  });

  it('warning if use Mentions.Option', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <Mentions style={{ width: '100%' }} defaultValue="@afc163">
        <Option value="afc163">afc163</Option>
        <Option value="zombieJ">zombieJ</Option>
        <Option value="yesmeck">yesmeck</Option>
      </Mentions>,
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Mentions] `Mentions.Option` is deprecated. Please use `options` instead.',
    );
  });

  it('do not lose label when use children Option', () => {
    const wrapper = render(
      <Mentions style={{ width: '100%' }}>
        <Mentions.Option value="afc163">Afc163</Mentions.Option>
        <Mentions.Option value="zombieJ">ZombieJ</Mentions.Option>
        <Mentions.Option value="yesmeck">Yesmeck</Mentions.Option>
      </Mentions>,
    );
    simulateInput(wrapper, '@');
    const { container } = wrapper;
    fireEvent.mouseEnter(container.querySelector('li.ant-mentions-dropdown-menu-item:last-child')!);
    fireEvent.focus(container.querySelector('textarea')!);
    act(() => {
      jest.runAllTimers();
    });
    expect(
      wrapper.container.querySelector('.ant-mentions-dropdown-menu-item-active')?.textContent,
    ).toBe('Yesmeck');
  });
});
