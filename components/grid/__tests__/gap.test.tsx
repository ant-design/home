import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { Col, Row } from '..';
import { render, screen } from '../../../tests/utils';

jest.mock('../../_util/styleChecker', () => ({
  canUseDocElement: () => true,
  isStyleSupport: () => true,
}));

describe('Grid.Gap', () => {
  it('should not have `row-gap: 0px` style', () => {
    render(
      <Row role="row">
        <Col />
      </Row>,
    );

    expect(screen.getByRole('row').style.rowGap).toBe('');
  });

  it('should use gap', () => {
    const { container } = render(
      <Row gutter={[16, 8]}>
        <Col />
      </Row>,
    );
    expect((container.querySelector('.ant-row') as HTMLElement)?.style.marginInline).toEqual(
      '-8px',
    );
    expect((container.querySelector('.ant-row') as HTMLElement)?.style.rowGap).toEqual('8px');
  });

  it('not break ssr', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const Demo = () => (
      <Row gutter={[16, 8]}>
        <Col />
      </Row>
    );

    const div = document.createElement('div');

    const ssrTxt = ReactDOMServer.renderToString(<Demo />);
    div.innerHTML = ssrTxt;

    const { unmount } = render(<Demo />, { container: div, hydrate: true });

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();

    unmount();
  });
});
