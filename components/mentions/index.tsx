import * as React from 'react';
import classNames from 'classnames';
import RcMentions from 'rc-mentions';
import type {
  DataDrivenOptionProps as MentionsOptionProps,
  MentionsProps as RcMentionsProps,
  MentionsRef as RcMentionsRef,
} from 'rc-mentions/lib/Mentions';
import { composeRef } from 'rc-util/lib/ref';

import getAllowClear from '../_util/getAllowClear';
import genPurePanel from '../_util/PurePanel';
import type { InputStatus } from '../_util/statusUtils';
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils';
import toList from '../_util/toList';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { Variant } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import { FormItemInputContext } from '../form/context';
import useVariant from '../form/hooks/useVariants';
import Spin from '../spin';
import useStyle from './style';
import KeyCode from 'rc-util/lib/KeyCode';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

export const { Option } = RcMentions;

function loadingFilterOption() {
  return true;
}

export type MentionPlacement = 'top' | 'bottom';

export type { DataDrivenOptionProps as MentionsOptionProps } from 'rc-mentions/lib/Mentions';

export interface OptionProps {
  value: string;
  children: React.ReactNode;
  [key: string]: any;
}

export interface MentionProps extends Omit<RcMentionsProps, 'suffix'> {
  rootClassName?: string;
  loading?: boolean;
  status?: InputStatus;
  options?: MentionsOptionProps[];
  popupClassName?: string;
  itemOnceDelete?: boolean;
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant;
}

export interface MentionsProps extends MentionProps {}

export interface MentionsRef extends RcMentionsRef {}

interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

const InternalMentions = React.forwardRef<MentionsRef, MentionProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    disabled,
    loading,
    filterOption,
    children,
    notFoundContent,
    options,
    itemOnceDelete = false,
    status: customStatus,
    allowClear = false,
    popupClassName,
    style,
    variant: customVariant,
    value,
    defaultValue,
    onChange,
    ...restProps
  } = props;
  const [mergedValue, setMergedValue] = useMergedState('', {
    defaultValue,
    value,
  });
  const [focused, setFocused] = React.useState(false);
  const innerRef = React.useRef<MentionsRef>(null);
  const mergedRef = composeRef(ref, innerRef);

  // =================== Warning =====================
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Mentions');

    warning.deprecated(!children, 'Mentions.Option', 'options');
  }

  const {
    getPrefixCls,
    renderEmpty,
    direction,
    mentions: contextMentions,
  } = React.useContext(ConfigContext);
  const {
    status: contextStatus,
    hasFeedback,
    feedbackIcon,
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  const onFocus: React.FocusEventHandler<HTMLTextAreaElement> = (...args) => {
    if (restProps.onFocus) {
      restProps.onFocus(...args);
    }
    setFocused(true);
  };

  const onBlur: React.FocusEventHandler<HTMLTextAreaElement> = (...args) => {
    if (restProps.onBlur) {
      restProps.onBlur(...args);
    }

    setFocused(false);
  };

  const onInternalChange = (data: string) => {
    setMergedValue(data)
    onChange?.(data);
  }

  const splitValue = (data: string) => {
    if (props.prefix) {
      const prefix = Array.isArray(props.prefix) ? props.prefix : [props.prefix];
      prefix.forEach((pre) => {
        if (pre) {
          data = data.split(pre).join(`  ${pre}`);
        }
      });
    } else {
      data = data.split('@').join(' @');
    }
    return data.trim();
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === KeyCode.BACKSPACE && itemOnceDelete) {
      if (mergedValue) {
        const data = splitValue(mergedValue)
        const cursorPosition = e.currentTarget.selectionStart;
        const valueList = data.trimEnd().split(props.split ?? ' ');
        let length = 0;
        let itemIndex = -1;
        for (let i = 0; i < valueList.length; i++) {
          length += valueList[i].length + (props.split?.length ?? 1);
          if (length >= cursorPosition) {
            itemIndex = i;
            break;
          }
        }
        const len = valueList.slice(itemIndex + 1, valueList.length).join('').length
        valueList.splice(itemIndex, 1);
        if (valueList.length !== 0) {
          const res = valueList.join(props.split ?? ' ') + (props.split ?? ' ');
          setMergedValue(res);
          setTimeout(() => {
            if (innerRef.current && innerRef.current.textarea) {
              innerRef.current.textarea.selectionStart -= len
              innerRef.current.textarea.selectionEnd -= len
            }
          })
        } else {
          setMergedValue('');
        }
      }
    }
  };

  const notFoundContentEle = React.useMemo<React.ReactNode>(() => {
    if (notFoundContent !== undefined) {
      return notFoundContent;
    }
    return renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />;
  }, [notFoundContent, renderEmpty]);

  const mentionOptions = React.useMemo<React.ReactNode>(() => {
    if (loading) {
      return (
        <Option value="ANTD_SEARCHING" disabled>
          <Spin size="small" />
        </Option>
      );
    }
    return children;
  }, [loading, children]);

  const mergedOptions = loading
    ? [
        {
          value: 'ANTD_SEARCHING',
          disabled: true,
          label: <Spin size="small" />,
        },
      ]
    : options;

  const mentionsfilterOption = loading ? loadingFilterOption : filterOption;

  const prefixCls = getPrefixCls('mentions', customizePrefixCls);

  const mergedAllowClear = getAllowClear(allowClear);

  // Style
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  const [variant, enableVariantCls] = useVariant('mentions', customVariant);

  const suffixNode = hasFeedback && <>{feedbackIcon}</>;

  const mergedClassName = classNames(
    contextMentions?.className,
    className,
    rootClassName,
    cssVarCls,
    rootCls,
  );

  const mentions = (
    <RcMentions
      silent={loading}
      prefixCls={prefixCls}
      notFoundContent={notFoundContentEle}
      className={mergedClassName}
      disabled={disabled}
      allowClear={mergedAllowClear}
      direction={direction}
      style={{ ...contextMentions?.style, ...style }}
      value={mergedValue}
      {...restProps}
      filterOption={mentionsfilterOption}
      onKeyDown={onKeyDown}
      onChange={onInternalChange}
      onFocus={onFocus}
      onBlur={onBlur}
      dropdownClassName={classNames(popupClassName, rootClassName, hashId, cssVarCls, rootCls)}
      ref={mergedRef}
      options={mergedOptions}
      suffix={suffixNode}
      classNames={{
        mentions: classNames(
          {
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-focused`]: focused,
            [`${prefixCls}-rtl`]: direction === 'rtl',
          },
          hashId,
        ),
        variant: classNames(
          {
            [`${prefixCls}-${variant}`]: enableVariantCls,
          },
          getStatusClassNames(prefixCls, mergedStatus),
        ),
        affixWrapper: hashId,
      }}
    >
      {mentionOptions}
    </RcMentions>
  );

  return wrapCSSVar(mentions);
});

type CompoundedComponent = typeof InternalMentions & {
  Option: typeof Option;
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
  getMentions: (value: string, config?: MentionsConfig) => MentionsEntity[];
};

const Mentions = InternalMentions as CompoundedComponent;

if (process.env.NODE_ENV !== 'production') {
  Mentions.displayName = 'Mentions';
}

Mentions.Option = Option;

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Mentions, undefined, undefined, 'mentions');
Mentions._InternalPanelDoNotUseOrYouWillBeFired = PurePanel;

Mentions.getMentions = (value = '', config: MentionsConfig = {}): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config;
  const prefixList: string[] = toList(prefix);

  return value
    .split(split)
    .map((str = ''): MentionsEntity | null => {
      let hitPrefix: string | null = null;

      prefixList.some((prefixStr) => {
        const startStr = str.slice(0, prefixStr.length);
        if (startStr === prefixStr) {
          hitPrefix = prefixStr;
          return true;
        }
        return false;
      });

      if (hitPrefix !== null) {
        return {
          prefix: hitPrefix,
          value: str.slice((hitPrefix as string).length),
        };
      }
      return null;
    })
    .filter((entity): entity is MentionsEntity => !!entity && !!entity.value);
};

export default Mentions;
