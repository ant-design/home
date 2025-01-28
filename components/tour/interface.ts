import type { ReactNode } from 'react';
import type {
  TourProps as RCTourProps,
  TourStepProps as RCTourStepProps,
} from '@rc-component/tour';

export interface TourProps extends Omit<RCTourProps, 'renderPanel'> {
  steps?: TourStepProps[];
  prefixCls?: string;
  current?: number;
  indicatorsRender?: (current: number, total: number) => ReactNode;
  type?: 'default' | 'primary'; //	default type, affects the background color and text color
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
  className?: string;
  style?: React.CSSProperties;
}

export type SemanticName =
  | 'root'
  | 'cover'
  | 'mask'
  | 'section'
  | 'footer'
  | 'actions'
  | 'indicator'
  | 'header'
  | 'title'
  | 'description';

export interface TourStepProps extends RCTourStepProps {
  cover?: ReactNode; // Display pictures or videos
  nextButtonProps?: {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
  };
  prevButtonProps?: {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
  };
  indicatorsRender?: (current: number, total: number) => ReactNode;
  type?: 'default' | 'primary'; //	default type, affects the background color and text color
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
}

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}
