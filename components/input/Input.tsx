import React, { forwardRef, useContext, useEffect, useRef } from 'react';
import type { InputRef, InputProps as RcInputProps } from '@rc-component/input';
import RcInput from '@rc-component/input';
import { InputFocusOptions, triggerFocus } from '@rc-component/input/lib/utils/commonUtils';
import { composeRef } from '@rc-component/util/lib/ref';
import classNames from 'classnames';

import ContextIsolator from '../_util/ContextIsolator';
import getAllowClear from '../_util/getAllowClear';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import { devUseWarning } from '../_util/warning';
import type { Variant } from '../config-provider';
import { useComponentConfig } from '../config-provider/context';
import DisabledContext from '../config-provider/DisabledContext';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariants';
import { useCompactItemContext } from '../space/Compact';
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout';
import useStyle, { useSharedStyle } from './style';
import { hasPrefixSuffix } from './utils';

export type { InputFocusOptions };
export type { InputRef };
export { triggerFocus };

export interface InputProps
  extends Omit<
    RcInputProps,
    'wrapperClassName' | 'groupClassName' | 'inputClassName' | 'affixWrapperClassName' | 'classes'
  > {
  rootClassName?: string;
  size?: SizeType;
  disabled?: boolean;
  status?: InputStatus;
  /** @deprecated Use `variant="borderless"` instead. */
  bordered?: boolean;
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant;
  [key: `data-${string}`]: string | undefined;
}

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    bordered = true,
    status: customStatus,
    size: customSize,
    disabled: customDisabled,
    onBlur,
    onFocus,
    suffix,
    allowClear,
    addonAfter,
    addonBefore,
    className,
    style,
    styles,
    rootClassName,
    onChange,
    classNames: classes,
    variant: customVariant,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    const { deprecated } = devUseWarning('Input');
    deprecated(!('bordered' in props), 'bordered', 'variant');
  }

  const {
    getPrefixCls,
    direction,
    allowClear: contextAllowClear,
    autoComplete: contextAutoComplete,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles,
  } = useComponentConfig('input');

  const prefixCls = getPrefixCls('input', customizePrefixCls);
  const inputRef = useRef<InputRef>(null);

  // Style
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapSharedCSSVar, hashId, cssVarCls] = useSharedStyle(prefixCls, rootClassName);
  const [wrapCSSVar] = useStyle(prefixCls, rootCls);

  // ===================== Compact Item =====================
  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);

  // ===================== Size =====================
  const mergedSize = useSize((ctx) => customSize ?? compactSize ?? ctx);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Status =====================
  const { status: contextStatus, hasFeedback, feedbackIcon } = useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Focus warning =====================
  const inputHasPrefixSuffix = hasPrefixSuffix(props) || !!hasFeedback;
  const prevHasPrefixSuffix = useRef<boolean>(inputHasPrefixSuffix);

  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Input');

    useEffect(() => {
      if (inputHasPrefixSuffix && !prevHasPrefixSuffix.current) {
        warning(
          document.activeElement === inputRef.current?.input,
          'usage',
          `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`,
        );
      }
      prevHasPrefixSuffix.current = inputHasPrefixSuffix;
    }, [inputHasPrefixSuffix]);
  }
  /* eslint-enable */

  // ===================== Remove Password value =====================
  const removePasswordTimeout = useRemovePasswordTimeout(inputRef, true);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onFocus?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    removePasswordTimeout();
    onChange?.(e);
  };

  const suffixNode = (hasFeedback || suffix) && (
    <>
      {suffix}
      {hasFeedback && feedbackIcon}
    </>
  );

  const mergedAllowClear = getAllowClear(allowClear ?? contextAllowClear);

  const [variant, enableVariantCls] = useVariant('input', customVariant, bordered);

  return wrapSharedCSSVar(
    wrapCSSVar(
      <RcInput
        ref={composeRef(ref, inputRef)}
        prefixCls={prefixCls}
        autoComplete={contextAutoComplete}
        {...rest}
        disabled={mergedDisabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{ ...contextStyle, ...style }}
        styles={{ ...contextStyles, ...styles }}
        suffix={suffixNode}
        allowClear={mergedAllowClear}
        className={classNames(
          className,
          rootClassName,
          cssVarCls,
          rootCls,
          compactItemClassnames,
          contextClassName,
        )}
        onChange={handleChange}
        addonBefore={
          addonBefore && (
            <ContextIsolator form space>
              {addonBefore}
            </ContextIsolator>
          )
        }
        addonAfter={
          addonAfter && (
            <ContextIsolator form space>
              {addonAfter}
            </ContextIsolator>
          )
        }
        classNames={{
          ...classes,
          ...contextClassNames,
          input: classNames(
            {
              [`${prefixCls}-sm`]: mergedSize === 'small',
              [`${prefixCls}-lg`]: mergedSize === 'large',
              [`${prefixCls}-rtl`]: direction === 'rtl',
            },
            classes?.input,
            contextClassNames.input,
            hashId,
          ),
          variant: classNames(
            {
              [`${prefixCls}-${variant}`]: enableVariantCls,
            },
            getStatusClassNames(prefixCls, mergedStatus),
          ),
          affixWrapper: classNames(
            {
              [`${prefixCls}-affix-wrapper-sm`]: mergedSize === 'small',
              [`${prefixCls}-affix-wrapper-lg`]: mergedSize === 'large',
              [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
            },
            hashId,
          ),
          wrapper: classNames(
            {
              [`${prefixCls}-group-rtl`]: direction === 'rtl',
            },
            hashId,
          ),
          groupWrapper: classNames(
            {
              [`${prefixCls}-group-wrapper-sm`]: mergedSize === 'small',
              [`${prefixCls}-group-wrapper-lg`]: mergedSize === 'large',
              [`${prefixCls}-group-wrapper-rtl`]: direction === 'rtl',
              [`${prefixCls}-group-wrapper-${variant}`]: enableVariantCls,
            },
            getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus, hasFeedback),
            hashId,
          ),
        }}
      />,
    ),
  );
});

if (process.env.NODE_ENV !== 'production') {
  Input.displayName = 'Input';
}

export default Input;
