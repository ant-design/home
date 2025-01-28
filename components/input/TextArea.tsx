import * as React from 'react';
import { forwardRef } from 'react';
import type {
  TextAreaProps as RcTextAreaProps,
  TextAreaRef as RcTextAreaRef,
} from '@rc-component/textarea';
import RcTextArea from '@rc-component/textarea';
import classNames from 'classnames';

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
import type { InputFocusOptions } from './Input';
import { triggerFocus } from './Input';
import { useSharedStyle } from './style';
import useStyle from './style/textarea';

export interface TextAreaProps extends Omit<RcTextAreaProps, 'suffix'> {
  /** @deprecated Use `variant` instead */
  bordered?: boolean;
  size?: SizeType;
  status?: InputStatus;
  rootClassName?: string;
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant;
}

export interface TextAreaRef {
  focus: (options?: InputFocusOptions) => void;
  blur: () => void;
  resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}

const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    bordered = true,
    size: customizeSize,
    disabled: customDisabled,
    status: customStatus,
    allowClear,
    classNames: classes,
    rootClassName,
    className,
    style,
    styles,
    variant: customVariant,
    ...rest
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    const { deprecated } = devUseWarning('TextArea');
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
  } = useComponentConfig('textArea');

  // ===================== Size =====================
  const mergedSize = useSize(customizeSize);

  // ===================== Disabled =====================
  const disabled = React.useContext(DisabledContext);
  const mergedDisabled = customDisabled ?? disabled;

  // ===================== Status =====================
  const {
    status: contextStatus,
    hasFeedback,
    feedbackIcon,
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Ref =====================
  const innerRef = React.useRef<RcTextAreaRef>(null);

  React.useImperativeHandle(ref, () => ({
    resizableTextArea: innerRef.current?.resizableTextArea,
    focus: (option?: InputFocusOptions) => {
      triggerFocus(innerRef.current?.resizableTextArea?.textArea, option);
    },
    blur: () => innerRef.current?.blur(),
  }));

  const prefixCls = getPrefixCls('input', customizePrefixCls);

  // ===================== Style =====================
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapSharedCSSVar, hashId, cssVarCls] = useSharedStyle(prefixCls, rootClassName);
  const [wrapCSSVar] = useStyle(prefixCls, rootCls);

  const [variant, enableVariantCls] = useVariant('textArea', customVariant, bordered);

  const mergedAllowClear = getAllowClear(allowClear ?? contextAllowClear);

  return wrapSharedCSSVar(
    wrapCSSVar(
      <RcTextArea
        autoComplete={contextAutoComplete}
        {...rest}
        style={{ ...contextStyle, ...style }}
        styles={{ ...contextStyles, ...styles }}
        disabled={mergedDisabled}
        allowClear={mergedAllowClear}
        className={classNames(cssVarCls, rootCls, className, rootClassName, contextClassName)}
        classNames={{
          ...classes,
          ...contextClassNames,
          textarea: classNames(
            {
              [`${prefixCls}-sm`]: mergedSize === 'small',
              [`${prefixCls}-lg`]: mergedSize === 'large',
            },
            hashId,
            classes?.textarea,
            contextClassNames.textarea,
          ),
          variant: classNames(
            {
              [`${prefixCls}-${variant}`]: enableVariantCls,
            },
            getStatusClassNames(prefixCls, mergedStatus),
          ),
          affixWrapper: classNames(
            `${prefixCls}-textarea-affix-wrapper`,
            {
              [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
              [`${prefixCls}-affix-wrapper-sm`]: mergedSize === 'small',
              [`${prefixCls}-affix-wrapper-lg`]: mergedSize === 'large',
              [`${prefixCls}-textarea-show-count`]: props.showCount || props.count?.show,
            },
            hashId,
          ),
        }}
        prefixCls={prefixCls}
        suffix={
          hasFeedback && <span className={`${prefixCls}-textarea-suffix`}>{feedbackIcon}</span>
        }
        ref={innerRef}
      />,
    ),
  );
});

export default TextArea;
