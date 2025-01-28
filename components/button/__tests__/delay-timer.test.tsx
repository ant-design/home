import React, { useState } from 'react';

import { act, fireEvent, render } from '../../../tests/utils';
import Button from '../Button';

const specialDelay = 9529;
const Content = () => {
  const [loading, setLoading] = useState(false);
  const toggleLoading = () => {
    setLoading(!loading);
  };

  const [visible, setVisible] = useState(true);
  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <button type="button" id="toggle_loading" onClick={toggleLoading}>
        Toggle Loading
      </button>
      <button type="button" id="toggle_visible" onClick={toggleVisible}>
        Toggle Visible
      </button>
      {visible && <Button type="text" loading={loading ? { delay: specialDelay } : false} />}
    </div>
  );
};

it('Delay loading timer in Button component', () => {
  const otherTimer = 9528;
  jest.spyOn<Window, 'setTimeout'>(window, 'setTimeout').mockReturnValue(otherTimer);
  jest.restoreAllMocks();

  const wrapper = render(<Content />);

  const btnTimer = 9527;
  const setTimeoutMock = jest
    .spyOn<Window, 'setTimeout'>(window, 'setTimeout')
    .mockReturnValue(btnTimer);
  const clearTimeoutMock = jest.spyOn<Window, 'clearTimeout'>(window, 'clearTimeout');

  // other component may call setTimeout or clearTimeout
  const setTimeoutCount = () => {
    const items = setTimeoutMock.mock.calls.filter((item) => item[1] === specialDelay);
    return items.length;
  };
  const clearTimeoutCount = () => {
    const items = clearTimeoutMock.mock.calls.filter((item) => item[0] === btnTimer);
    return items.length;
  };

  // switch loading state to true
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_loading')[0]);
  expect(setTimeoutCount()).toBe(1);
  expect(clearTimeoutCount()).toBe(0);

  // trigger timer handler
  act(() => {
    const timerHandler = setTimeoutMock.mock.calls[0][0];

    if (typeof timerHandler === 'function') {
      timerHandler();
    }
  });
  expect(setTimeoutCount()).toBe(1);
  expect(clearTimeoutCount()).toBe(0);

  // switch loading state to false
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_loading')[0]);
  expect(setTimeoutCount()).toBe(1);
  expect(clearTimeoutCount()).toBe(0);

  // switch loading state to true
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_loading')[0]);
  expect(setTimeoutCount()).toBe(2);
  expect(clearTimeoutCount()).toBe(0);

  // switch loading state to false
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_loading')[0]);
  expect(setTimeoutCount()).toBe(2);
  expect(clearTimeoutCount()).toBe(1);

  // switch loading state to true
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_loading')[0]);
  // remove Button component
  fireEvent.click(wrapper.container.querySelectorAll('#toggle_visible')[0]);
  expect(setTimeoutCount()).toBe(3);
  expect(clearTimeoutCount()).toBe(2);

  jest.restoreAllMocks();
});
it('Delay loading while use loading delay at first time', () => {
  const Demo = () => <Button loading={{ delay: specialDelay }} />;
  const wrapper = render(<Demo />);
  expect(wrapper.container.firstChild).not.toHaveClass('ant-btn-loading');
});
