import type React from 'react';
import type Group from './FloatButtonGroup';
import type BackTop from './BackTop';
import type { TooltipProps } from '../tooltip';

export type FloatButtonType = 'default' | 'primary';

export type FloatButtonShape = 'circle' | 'square';

export type FloatButtonGroupTrigger = 'click' | 'hover';

export interface TourProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  description?: React.ReactNode;
  type?: FloatButtonType;
  shape?: FloatButtonShape;
  tooltip?: TooltipProps['title'];
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface FloatButtonContentProps extends React.DOMAttributes<HTMLDivElement> {
  className?: string;
  icon?: TourProps['icon'];
  description?: TourProps['description'];
  prefixCls: TourProps['prefixCls'];
}

export interface FloatButtonGroupProps extends TourProps {
  // 包含的 Float Button
  children: React.ReactNode;
  // 触发方式 (有触发方式为菜单模式）
  trigger?: FloatButtonGroupTrigger;
  // 受控展开
  open?: boolean;
  // 关闭按钮自定义图标
  closeIcon?: React.ReactNode;
  // 展开收起的回调
  onOpenChange?: (open: boolean) => void;
}

export interface BackTopProps extends Omit<TourProps, 'target'> {
  visibilityHeight?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  target?: () => HTMLElement | Window | Document;
  prefixCls?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  visible?: boolean; // Only for test. Don't use it.
}

export type CompoundedComponent = React.ForwardRefExoticComponent<
  TourProps & React.RefAttributes<HTMLAnchorElement | HTMLButtonElement>
> & {
  Group: typeof Group;
  BackTop: typeof BackTop;
};
