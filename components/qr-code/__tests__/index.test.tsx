import React, { useState } from 'react';

import QRCode from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { fireEvent, render } from '../../../tests/utils';
import type { QRCodeProps } from '../interface';

describe('QRCode test', () => {
  mountTest(() => <QRCode value="" />);
  rtlTest(() => <QRCode value="" />);

  it('should correct render', () => {
    const { container } = render(<QRCode value="test" />);
    expect(container?.querySelector<HTMLCanvasElement>('.ant-qrcode canvas')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('should render `null` and console Error when value not exist', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(<QRCode value={undefined as unknown as string} />);
    expect(container.firstChild).toBe(null);
    expect(container.firstChild).toMatchSnapshot();
    expect(errSpy).toHaveBeenCalledWith('Warning: [antd: QRCode] need to receive `value` props');
    errSpy.mockRestore();
  });

  it('support custom icon', () => {
    const { container } = render(<QRCode value="test" icon="test" />);
    expect(container?.querySelector<HTMLImageElement>('.ant-qrcode img')).toBeTruthy();
  });

  it('support custom size', () => {
    const { container } = render(<QRCode value="test" size={100} />);
    const canvas = container.querySelector<HTMLCanvasElement>('.ant-qrcode > canvas')!;
    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(100);
  });

  it('support refresh', () => {
    const refresh = jest.fn();
    const { container } = render(<QRCode value="test" status="expired" onRefresh={refresh} />);
    fireEvent.click(
      container?.querySelector<HTMLButtonElement>('.ant-qrcode button.ant-btn-link')!,
    );
    expect(refresh).toHaveBeenCalled();
  });

  it('support click', () => {
    const handleClick = jest.fn();
    const { container } = render(<QRCode value="test" onClick={handleClick} />);
    fireEvent.click(container?.querySelector<HTMLDivElement>('.ant-qrcode')!);
    expect(handleClick).toHaveBeenCalled();
  });

  it('support loading', () => {
    const Demo: React.FC = () => {
      const [status, setStatus] = useState<QRCodeProps['status']>('active');
      return (
        <>
          <QRCode value="test" status={status} />
          <button type="button" onClick={() => setStatus('loading')}>
            set loading
          </button>
        </>
      );
    };
    const { container } = render(<Demo />);
    expect(container.querySelector<HTMLDivElement>('.ant-spin-spinning')).toBeFalsy();
    fireEvent.click(container?.querySelector<HTMLButtonElement>('button')!);
    expect(container.querySelector<HTMLDivElement>('.ant-spin-spinning')).toBeTruthy();
  });

  it('support bordered', () => {
    const { container } = render(<QRCode value="test" bordered={false} />);
    expect(container?.querySelector<HTMLDivElement>('.ant-qrcode')).toHaveClass(
      'ant-qrcode-borderless',
    );
  });

  it('should console Error when icon exist && errorLevel is `L`', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<QRCode value="test" icon="test" errorLevel="L" />);
    expect(errSpy).toHaveBeenCalledWith(
      'Warning: [antd: QRCode] ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    );
    errSpy.mockRestore();
  });

  it('correct style for wrapper & canvas', () => {
    const { container } = render(
      <QRCode value="test" size={60} style={{ width: '100%', height: '80%' }} />,
    );
    expect(container.querySelector<HTMLElement>('.ant-qrcode')).toHaveStyle(
      'width: 100%; height: 80%;',
    );
    expect(container.querySelector<HTMLElement>('.ant-qrcode canvas')).toHaveStyle(
      'width: 100%; height: 80%;',
    );
  });
  it('custom status render', () => {
    const refreshCb = jest.fn();
    const customStatusRender: QRCodeProps['statusRender'] = (info) => {
      switch (info.status) {
        case 'expired':
          return (
            <div className="custom-expired">
              <span>{info.locale?.expired}</span>
              <button id="refresh" onClick={info.onRefresh} type="button">
                refresh
              </button>
            </div>
          );
        case 'loading':
          return <div className="custom-loading">Loading</div>;
        case 'scanned':
          return <div className="custom-scanned">{info.locale?.scanned}</div>;
        default:
          return null;
      }
    };
    const { container } = render(
      <>
        <QRCode
          className="qrcode-expired"
          value="test"
          status="expired"
          statusRender={customStatusRender}
          onRefresh={refreshCb}
        />
        <QRCode
          className="qrcode-loading"
          value="test"
          status="loading"
          statusRender={customStatusRender}
        />
        <QRCode
          className="qrcode-scanned"
          value="test"
          status="scanned"
          statusRender={customStatusRender}
        />
      </>,
    );
    expect(
      container.querySelector<HTMLDivElement>('.qrcode-expired .custom-expired>span')?.textContent,
    ).toBe('QR code expired');
    fireEvent.click(container?.querySelector<HTMLButtonElement>('#refresh')!);
    expect(refreshCb).toHaveBeenCalled();
    expect(
      container.querySelector<HTMLDivElement>('.qrcode-loading .custom-loading')?.textContent,
    ).toBe('Loading');
    expect(
      container.querySelector<HTMLDivElement>('.qrcode-scanned .custom-scanned')?.textContent,
    ).toBe('Scanned');
    expect(container).toMatchSnapshot();
  });

  it('should pass aria and data props to qrcode element', () => {
    const { container } = render(<QRCode value="test" aria-label="Test QR Code" />);
    const qrcodeElement = container.querySelector('.ant-qrcode canvas');
    expect(qrcodeElement).toHaveAttribute('aria-label', 'Test QR Code');
  });

  it('should not pass other props to qrcode element', () => {
    const { container } = render(
      <QRCode
        value="test"
        aria-label="Test QR Code"
        title="qr-title" // This prop should not be passed to canvas
      />,
    );

    const qrcodeElement = container.querySelector('.ant-qrcode canvas');
    expect(qrcodeElement).toHaveAttribute('aria-label', 'Test QR Code');
    expect(qrcodeElement).not.toHaveAttribute('title', 'qr-title');
  });

  it('should work with both canvas and svg type', () => {
    const ariaLabel = 'Test QR Code';
    // test canvas type
    const { container: canvasContainer } = render(
      <QRCode value="test" type="canvas" aria-label={ariaLabel} />,
    );
    expect(canvasContainer.querySelector('canvas')).toHaveAttribute('aria-label', ariaLabel);
    // test svg type
    const { container: svgContainer } = render(
      <QRCode value="test" type="svg" aria-label={ariaLabel} />,
    );
    expect(svgContainer.querySelector('svg')).toHaveAttribute('aria-label', ariaLabel);
  });

  it('should apply custom styles to QRCode', () => {
    const customClassNames = {
      root: 'custom-root',
      mask: 'custom-mask',
    };

    const customStyles = {
      root: { borderRadius: '50px' },
      mask: { backgroundColor: 'blue' },
    };

    const { container } = render(
      <QRCode classNames={customClassNames} styles={customStyles} value="antd" status="loading" />,
    );

    const QRCodeElement = container.querySelector('.ant-qrcode') as HTMLElement;
    const QRCodeMaskElement = container.querySelector('.ant-qrcode-mask') as HTMLElement;

    // check classNames
    expect(QRCodeElement.classList).toContain('custom-root');
    expect(QRCodeMaskElement.classList).toContain('custom-mask');

    // check styles
    expect(QRCodeElement.style.borderRadius).toBe('50px');
    expect(QRCodeMaskElement.style.backgroundColor).toBe('blue');
  });
});
