import * as React from 'react';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import omit from '@rc-component/util/lib/omit';
import classNames from 'classnames';

import type { RenderFunction } from '../_util/getRenderPropValue';
import type { ButtonProps, LegacyButtonType } from '../button/Button';
import { ConfigContext } from '../config-provider';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import type { AbstractTooltipProps, TooltipRef } from '../tooltip';
import useMergedArrow from '../tooltip/hook/useMergedArrow';
import PurePanel, { Overlay } from './PurePanel';
import useStyle from './style';

export interface PopconfirmProps extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  description?: React.ReactNode | RenderFunction;
  disabled?: boolean;
  onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
  okText?: React.ReactNode;
  okType?: LegacyButtonType;
  cancelText?: React.ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  showCancel?: boolean;
  icon?: React.ReactNode;
  onOpenChange?: (
    open: boolean,
    e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  onPopupClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface PopconfirmState {
  open?: boolean;
}

const InternalPopconfirm = React.forwardRef<TooltipRef, PopconfirmProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    placement = 'top',
    trigger = 'click',
    okType = 'primary',
    icon = <ExclamationCircleFilled />,
    children,
    overlayClassName,
    onOpenChange,
    overlayStyle,
    styles,
    arrow: popconfirmArrow,
    classNames: popconfirmClassNames,
    ...restProps
  } = props;

  const { getPrefixCls, popconfirm } = React.useContext(ConfigContext);
  const [open, setOpen] = useMergedState(false, {
    value: props.open,
    defaultValue: props.defaultOpen,
  });
  const mergedArrow = useMergedArrow(popconfirmArrow, popconfirm?.arrow);

  const settingOpen: PopoverProps['onOpenChange'] = (value, e) => {
    setOpen(value, true);
    onOpenChange?.(value, e);
  };

  const close = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingOpen(false, e);
  };

  const onConfirm = (e: React.MouseEvent<HTMLButtonElement>) => props.onConfirm?.call(this, e);

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    settingOpen(false, e);
    props.onCancel?.call(this, e);
  };

  const onInternalOpenChange: PopoverProps['onOpenChange'] = (value, e) => {
    const { disabled = false } = props;
    if (disabled) {
      return;
    }
    settingOpen(value, e);
  };

  const prefixCls = getPrefixCls('popconfirm', customizePrefixCls);
  const rootClassNames = classNames(
    prefixCls,
    overlayClassName,
    popconfirm?.classNames?.root,
    popconfirmClassNames?.root,
  );
  const bodyClassNames = classNames(popconfirm?.classNames?.body, popconfirmClassNames?.body);

  const [wrapCSSVar] = useStyle(prefixCls);

  return wrapCSSVar(
    <Popover
      arrow={mergedArrow}
      {...omit(restProps, ['title'])}
      trigger={trigger}
      placement={placement}
      onOpenChange={onInternalOpenChange}
      open={open}
      ref={ref}
      classNames={{ root: rootClassNames, body: bodyClassNames }}
      styles={{
        root: {
          ...popconfirm?.styles?.root,
          ...popconfirm?.style,
          ...overlayStyle,
          ...styles?.root,
        },
        body: {
          ...popconfirm?.styles?.body,
          ...styles?.body,
        },
      }}
      content={
        <Overlay
          okType={okType}
          icon={icon}
          {...props}
          prefixCls={prefixCls}
          close={close}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      }
      data-popover-inject
    >
      {children}
    </Popover>,
  );
});

type CompoundedComponent = typeof InternalPopconfirm & {
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};

const Popconfirm = InternalPopconfirm as CompoundedComponent;

// We don't care debug panel
/* istanbul ignore next */
Popconfirm._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

if (process.env.NODE_ENV !== 'production') {
  Popconfirm.displayName = 'Popconfirm';
}

export default Popconfirm;
