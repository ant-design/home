import { SmileOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { ConfigConsumerProps, CSPConfig } from '..';
import ConfigProvider, { ConfigContext } from '..';
import mountTest from '../../../tests/shared/mountTest';
import { fireEvent, render } from '../../../tests/utils';
import Button from '../../button';
import Input from '../../input';
import Table from '../../table';

describe('ConfigProvider', () => {
  mountTest(() => (
    <ConfigProvider>
      <div />
    </ConfigProvider>
  ));

  it('Content Security Policy', () => {
    const csp: CSPConfig = { nonce: 'test-antd' };
    render(
      <ConfigProvider csp={csp}>
        <Button />
      </ConfigProvider>,
    );
    // expect(csp).toBe(csp);
  });

  it('autoInsertSpaceInButton', () => {
    const text = '确定';
    const { container } = render(
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button>{text}</Button>
      </ConfigProvider>,
    );
    expect(container.querySelector('span')?.innerHTML).toBe(text);
  });

  it('renderEmpty', () => {
    const text = 'empty placeholder';
    const { container } = render(
      <ConfigProvider renderEmpty={() => <div>{text}</div>}>
        <Table />
      </ConfigProvider>,
    );
    expect(container.querySelector('.ant-table-placeholder')?.querySelector('div')?.innerHTML).toBe(
      text,
    );
  });

  it('nest prefixCls', () => {
    const { container } = render(
      <ConfigProvider prefixCls="bamboo">
        <ConfigProvider>
          <Button />
        </ConfigProvider>
      </ConfigProvider>,
    );

    expect(container.querySelector('button.bamboo-btn')).toBeTruthy();
  });

  it('dynamic prefixCls', () => {
    const DynamicPrefixCls: React.FC = () => {
      const [prefixCls, setPrefixCls] = useState('bamboo');
      return (
        <div>
          <Button onClick={() => setPrefixCls('light')} className="toggle-button">
            toggle
          </Button>
          <ConfigProvider prefixCls={prefixCls}>
            <ConfigProvider>
              <Button />
            </ConfigProvider>
          </ConfigProvider>
        </div>
      );
    };

    const { container } = render(<DynamicPrefixCls />);

    expect(container.querySelector('button.bamboo-btn')).toBeTruthy();
    fireEvent.click(container.querySelector('.toggle-button')!);
    expect(container.querySelector('button.light-btn')).toBeTruthy();
  });

  it('iconPrefixCls', () => {
    const { container } = render(
      <ConfigProvider iconPrefixCls="bamboo">
        <SmileOutlined />
      </ConfigProvider>,
    );

    expect(container.querySelector('[role="img"]')).toHaveClass('bamboo');
    expect(container.querySelector('[role="img"]')).toHaveClass('bamboo-smile');
  });

  it('input autoComplete', () => {
    const { container } = render(
      <ConfigProvider input={{ autoComplete: 'off' }}>
        <Input />
      </ConfigProvider>,
    );
    expect(container.querySelector('input')?.autocomplete).toEqual('off');
  });

  it('render empty', () => {
    let rendered = false;
    let cacheRenderEmpty;

    const App: React.FC = () => {
      const { renderEmpty } = React.useContext<ConfigConsumerProps>(ConfigContext);
      rendered = true;
      cacheRenderEmpty = renderEmpty;
      return null;
    };

    render(
      <ConfigProvider>
        <App />
      </ConfigProvider>,
    );

    expect(rendered).toBeTruthy();
    expect(cacheRenderEmpty).toBeFalsy();
  });
});
