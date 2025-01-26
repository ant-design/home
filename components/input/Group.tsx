import * as React from 'react';
import { useContext, useMemo } from 'react';
import classNames from 'classnames';

import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { FormItemStatusContextProps } from '../form/context';
import { FormItemInputContext } from '../form/context';
import useStyle from './style';

export interface InputGroupProps {
  className?: string;
  size?: 'large' | 'small' | 'default';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  onBlur?: React.FocusEventHandler<HTMLSpanElement>;
  prefixCls?: string;
  compact?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = (props) => {
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const { prefixCls: customizePrefixCls, className } = props;
  const prefixCls = getPrefixCls('input-group', customizePrefixCls);
  const inputPrefixCls = getPrefixCls('input');
  const [wrapCSSVar, hashId] = useStyle(inputPrefixCls);
  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-lg`]: props.size === 'large',
      [`${prefixCls}-sm`]: props.size === 'small',
      [`${prefixCls}-compact`]: props.compact,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    hashId,
    className,
  );

  const formItemContext = useContext(FormItemInputContext);

  const groupFormItemContext = useMemo<FormItemStatusContextProps>(
    () => ({
      ...formItemContext,
      isFormItemInput: false,
    }),
    [formItemContext],
  );

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Input.Group');

    warning.deprecated(false, 'Input.Group', 'Space.Compact');
  }

  return wrapCSSVar(
    <span
      className={cls}
      style={props.style}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      <FormItemInputContext.Provider value={groupFormItemContext}>
        {props.children}
      </FormItemInputContext.Provider>
    </span>,
  );
};

export default InputGroup;
