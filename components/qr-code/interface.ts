import type { ReactNode } from 'react';
import type { QRProps } from '@rc-component/qrcode';

import type { Locale } from '../locale';

type ImageSettings = QRProps['imageSettings'];

export type { QRProps, ImageSettings };

export type QRPropsCanvas = QRProps & React.CanvasHTMLAttributes<HTMLCanvasElement>;

export type QRPropsSvg = QRProps & React.SVGAttributes<SVGSVGElement>;

export type QRStatus = 'active' | 'expired' | 'loading' | 'scanned';

export type StatusRenderInfo = {
  status: Exclude<QRStatus, 'active'>;
  locale: Locale['QRCode'];
  onRefresh?: () => void;
};

export interface QRCodeProps extends QRProps, React.HTMLAttributes<HTMLDivElement> {
  type?: 'canvas' | 'svg';
  className?: string;
  rootClassName?: string;
  prefixCls?: string;
  icon?: string;
  iconSize?: number | { width: number; height: number };
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  status?: QRStatus;
  onRefresh?: () => void;
  statusRender?: (info: StatusRenderInfo) => ReactNode;
  classNames?: {
    root?: string;
    mask?: string;
  };
  styles?: {
    root?: React.CSSProperties;
    mask?: React.CSSProperties;
  };
}
