import * as React from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';

import { cloneElement } from '../_util/reactNode';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import Avatar from './avatar';
import AvatarContext from './AvatarContext';
import type { AvatarContextType, AvatarSize } from './AvatarContext';
import useStyle from './style';

interface ContextProps {
  children?: React.ReactNode;
}

const AvatarContextProvider: React.FC<AvatarContextType & ContextProps> = (props) => {
  const { size, shape } = React.useContext<AvatarContextType>(AvatarContext);
  const avatarContextValue = React.useMemo<AvatarContextType>(
    () => ({ size: props.size || size, shape: props.shape || shape }),
    [props.size, props.shape, size, shape],
  );
  return (
    <AvatarContext.Provider value={avatarContextValue}>{props.children}</AvatarContext.Provider>
  );
};

export interface AvatarGroupProps {
  className?: string;
  rootClassName?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  prefixCls?: string;
  /** @deprecated Please use `max={{ count: number }}` */
  maxCount?: number;
  /** @deprecated Please use `max={{ style: CSSProperties }}` */
  maxStyle?: React.CSSProperties;
  /** @deprecated Please use `max={{ popover: PopoverProps }}` */
  maxPopoverPlacement?: 'top' | 'bottom';
  /** @deprecated Please use `max={{ popover: PopoverProps }}` */
  maxPopoverTrigger?: 'hover' | 'focus' | 'click';
  max?: {
    count?: number;
    style?: React.CSSProperties;
    popover?: PopoverProps;
  };
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size?: AvatarSize;
  shape?: 'circle' | 'square';
}

const AvatarGroup: React.FC<AvatarGroupProps> = (props) => {
  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    maxCount,
    maxStyle,
    size,
    shape,
    maxPopoverPlacement,
    maxPopoverTrigger,
    children,
    max,
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Avatar.Group');
    warning.deprecated(!maxCount, 'maxCount', 'max={{ count: number }}');
    warning.deprecated(!maxStyle, 'maxStyle', 'max={{ style: CSSProperties }}');
    warning.deprecated(
      !maxPopoverPlacement,
      'maxPopoverPlacement',
      'max={{ popover: PopoverProps }}',
    );
    warning.deprecated(!maxPopoverTrigger, 'maxPopoverTrigger', 'max={{ popover: PopoverProps }}');
  }

  const prefixCls = getPrefixCls('avatar', customizePrefixCls);
  const groupPrefixCls = `${prefixCls}-group`;
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  const cls = classNames(
    groupPrefixCls,
    {
      [`${groupPrefixCls}-rtl`]: direction === 'rtl',
    },
    cssVarCls,
    rootCls,
    className,
    rootClassName,
    hashId,
  );

  const childrenWithProps = toArray(children).map((child, index) =>
    cloneElement(child, {
      // eslint-disable-next-line react/no-array-index-key
      key: `avatar-key-${index}`,
    }),
  );

  const mergeCount = max?.count || maxCount;
  const numOfChildren = childrenWithProps.length;
  if (mergeCount && mergeCount < numOfChildren) {
    const childrenShow = childrenWithProps.slice(0, mergeCount);
    const childrenHidden = childrenWithProps.slice(mergeCount, numOfChildren);

    const mergeStyle = max?.style || maxStyle;
    const mergePopoverTrigger = max?.popover?.trigger || maxPopoverTrigger || 'hover';
    const mergePopoverPlacement = max?.popover?.placement || maxPopoverPlacement || 'top';

    const mergeProps = {
      content: childrenHidden,
      ...max?.popover,
      classNames: { root: classNames(`${groupPrefixCls}-popover`, max?.popover?.classNames?.root) },
      placement: mergePopoverPlacement,
      trigger: mergePopoverTrigger,
    };

    childrenShow.push(
      <Popover key="avatar-popover-key" destroyTooltipOnHide {...mergeProps}>
        <Avatar style={mergeStyle}>{`+${numOfChildren - mergeCount}`}</Avatar>
      </Popover>,
    );

    return wrapCSSVar(
      <AvatarContextProvider shape={shape} size={size}>
        <div className={cls} style={style}>
          {childrenShow}
        </div>
      </AvatarContextProvider>,
    );
  }

  return wrapCSSVar(
    <AvatarContextProvider shape={shape} size={size}>
      <div className={cls} style={style}>
        {childrenWithProps}
      </div>
    </AvatarContextProvider>,
  );
};

export default AvatarGroup;
