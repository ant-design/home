import * as React from 'react';
import type { JSX } from 'react';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ResizeObserver from '@rc-component/resize-observer';
import type { AutoSizeType } from '@rc-component/textarea';
import toArray from '@rc-component/util/lib/Children/toArray';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useMergedState from '@rc-component/util/lib/hooks/useMergedState';
import omit from '@rc-component/util/lib/omit';
import { composeRef } from '@rc-component/util/lib/ref';
import classNames from 'classnames';

import { isStyleSupport } from '../../_util/styleChecker';
import { ConfigContext } from '../../config-provider';
import useLocale from '../../locale/useLocale';
import type { TooltipProps } from '../../tooltip';
import Tooltip from '../../tooltip';
import Editable from '../Editable';
import useCopyClick from '../hooks/useCopyClick';
import useMergedConfig from '../hooks/useMergedConfig';
import usePrevious from '../hooks/usePrevious';
import useTooltipProps from '../hooks/useTooltipProps';
import type { TypographyProps } from '../Typography';
import Typography from '../Typography';
import CopyBtn from './CopyBtn';
import Ellipsis from './Ellipsis';
import EllipsisTooltip from './EllipsisTooltip';
import { isEleEllipsis, isValidText } from './util';

export type BaseType = 'secondary' | 'success' | 'warning' | 'danger';

export interface CopyConfig {
  text?: string | (() => string | Promise<string>);
  onCopy?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  tooltips?: React.ReactNode;
  format?: 'text/plain' | 'text/html';
  tabIndex?: number;
}

interface EditConfig {
  text?: string;
  editing?: boolean;
  icon?: React.ReactNode;
  tooltip?: React.ReactNode;
  onStart?: () => void;
  onChange?: (value: string) => void;
  onCancel?: () => void;
  onEnd?: () => void;
  maxLength?: number;
  autoSize?: boolean | AutoSizeType;
  triggerType?: ('icon' | 'text')[];
  enterIcon?: React.ReactNode;
  tabIndex?: number;
}

export interface EllipsisConfig {
  rows?: number;
  expandable?: boolean | 'collapsible';
  suffix?: string;
  symbol?: React.ReactNode | ((expanded: boolean) => React.ReactNode);
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpand?: (e: React.MouseEvent<HTMLElement, MouseEvent>, info: { expanded: boolean }) => void;
  onEllipsis?: (ellipsis: boolean) => void;
  tooltip?: React.ReactNode | TooltipProps;
}

export interface BlockProps<C extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements>
  extends TypographyProps<C> {
  title?: string;
  editable?: boolean | EditConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  italic?: boolean;
}

function wrapperDecorations(
  { mark, code, underline, delete: del, strong, keyboard, italic }: BlockProps,
  content: React.ReactNode,
) {
  let currentContent = content;

  function wrap(tag: string, needed?: boolean) {
    if (!needed) {
      return;
    }

    currentContent = React.createElement(tag, {}, currentContent);
  }

  wrap('strong', strong);
  wrap('u', underline);
  wrap('del', del);
  wrap('code', code);
  wrap('mark', mark);
  wrap('kbd', keyboard);
  wrap('i', italic);

  return currentContent;
}

const ELLIPSIS_STR = '...';

const Base = React.forwardRef<HTMLElement, BlockProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    type,
    disabled,
    children,
    ellipsis,
    editable,
    copyable,
    component,
    title,
    ...restProps
  } = props;
  const { getPrefixCls, direction } = React.useContext(ConfigContext);
  const [textLocale] = useLocale('Text');

  const typographyRef = React.useRef<HTMLElement>(null);
  const editIconRef = React.useRef<HTMLButtonElement>(null);

  // ============================ MISC ============================
  const prefixCls = getPrefixCls('typography', customizePrefixCls);

  const textProps = omit(restProps, [
    'mark',
    'code',
    'delete',
    'underline',
    'strong',
    'keyboard',
    'italic',
  ]);

  // ========================== Editable ==========================
  const [enableEdit, editConfig] = useMergedConfig<EditConfig>(editable);
  const [editing, setEditing] = useMergedState(false, {
    value: editConfig.editing,
  });
  const { triggerType = ['icon'] } = editConfig;

  const triggerEdit = (edit: boolean) => {
    if (edit) {
      editConfig.onStart?.();
    }

    setEditing(edit);
  };

  // Focus edit icon when back
  const prevEditing = usePrevious(editing);
  useLayoutEffect(() => {
    if (!editing && prevEditing) {
      editIconRef.current?.focus();
    }
  }, [editing]);

  const onEditClick = (e?: React.MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    triggerEdit(true);
  };

  const onEditChange = (value: string) => {
    editConfig.onChange?.(value);
    triggerEdit(false);
  };

  const onEditCancel = () => {
    editConfig.onCancel?.();
    triggerEdit(false);
  };

  // ========================== Copyable ==========================
  const [enableCopy, copyConfig] = useMergedConfig<CopyConfig>(copyable);

  const { copied, copyLoading, onClick: onCopyClick } = useCopyClick({ copyConfig, children });

  // ========================== Ellipsis ==========================
  const [isLineClampSupport, setIsLineClampSupport] = React.useState(false);
  const [isTextOverflowSupport, setIsTextOverflowSupport] = React.useState(false);

  const [isJsEllipsis, setIsJsEllipsis] = React.useState(false);
  const [isNativeEllipsis, setIsNativeEllipsis] = React.useState(false);
  const [isNativeVisible, setIsNativeVisible] = React.useState(true);
  const [enableEllipsis, ellipsisConfig] = useMergedConfig<EllipsisConfig>(ellipsis, {
    expandable: false,
    symbol: (isExpanded) => (isExpanded ? textLocale?.collapse : textLocale?.expand),
  });
  const [expanded, setExpanded] = useMergedState(ellipsisConfig.defaultExpanded || false, {
    value: ellipsisConfig.expanded,
  });

  const mergedEnableEllipsis =
    enableEllipsis && (!expanded || ellipsisConfig.expandable === 'collapsible');

  // Shared prop to reduce bundle size
  const { rows = 1 } = ellipsisConfig;

  const needMeasureEllipsis = React.useMemo(
    () =>
      // Disable ellipsis
      mergedEnableEllipsis &&
      // Provide suffix
      (ellipsisConfig.suffix !== undefined ||
        ellipsisConfig.onEllipsis ||
        // Can't use css ellipsis since we need to provide the place for button
        ellipsisConfig.expandable ||
        enableEdit ||
        enableCopy),
    [mergedEnableEllipsis, ellipsisConfig, enableEdit, enableCopy],
  );

  useLayoutEffect(() => {
    if (enableEllipsis && !needMeasureEllipsis) {
      setIsLineClampSupport(isStyleSupport('webkitLineClamp'));
      setIsTextOverflowSupport(isStyleSupport('textOverflow'));
    }
  }, [needMeasureEllipsis, enableEllipsis]);

  const [cssEllipsis, setCssEllipsis] = React.useState(mergedEnableEllipsis);

  const canUseCssEllipsis = React.useMemo(() => {
    if (needMeasureEllipsis) {
      return false;
    }

    if (rows === 1) {
      return isTextOverflowSupport;
    }

    return isLineClampSupport;
  }, [needMeasureEllipsis, isTextOverflowSupport, isLineClampSupport]);

  // We use effect to change from css ellipsis to js ellipsis.
  // To make SSR still can see the ellipsis.
  useLayoutEffect(() => {
    setCssEllipsis(canUseCssEllipsis && mergedEnableEllipsis);
  }, [canUseCssEllipsis, mergedEnableEllipsis]);

  const isMergedEllipsis = mergedEnableEllipsis && (cssEllipsis ? isNativeEllipsis : isJsEllipsis);

  const cssTextOverflow = mergedEnableEllipsis && rows === 1 && cssEllipsis;
  const cssLineClamp = mergedEnableEllipsis && rows > 1 && cssEllipsis;

  // >>>>> Expand
  const onExpandClick: EllipsisConfig['onExpand'] = (e, info) => {
    setExpanded(info.expanded);
    ellipsisConfig.onExpand?.(e, info);
  };

  const [ellipsisWidth, setEllipsisWidth] = React.useState(0);
  const onResize = ({ offsetWidth }: { offsetWidth: number }) => {
    setEllipsisWidth(offsetWidth);
  };

  // >>>>> JS Ellipsis
  const onJsEllipsis = (jsEllipsis: boolean) => {
    setIsJsEllipsis(jsEllipsis);

    // Trigger if changed
    if (isJsEllipsis !== jsEllipsis) {
      ellipsisConfig.onEllipsis?.(jsEllipsis);
    }
  };

  // >>>>> Native ellipsis
  React.useEffect(() => {
    const textEle = typographyRef.current;

    if (enableEllipsis && cssEllipsis && textEle) {
      const currentEllipsis = isEleEllipsis(textEle);

      if (isNativeEllipsis !== currentEllipsis) {
        setIsNativeEllipsis(currentEllipsis);
      }
    }
  }, [enableEllipsis, cssEllipsis, children, cssLineClamp, isNativeVisible, ellipsisWidth]);

  // https://github.com/ant-design/ant-design/issues/36786
  // Use IntersectionObserver to check if element is invisible
  React.useEffect(() => {
    const textEle = typographyRef.current;
    if (
      typeof IntersectionObserver === 'undefined' ||
      !textEle ||
      !cssEllipsis ||
      !mergedEnableEllipsis
    ) {
      return;
    }

    /* eslint-disable-next-line compat/compat */
    const observer = new IntersectionObserver(() => {
      setIsNativeVisible(!!textEle.offsetParent);
    });
    observer.observe(textEle!);

    return () => {
      observer.disconnect();
    };
  }, [cssEllipsis, mergedEnableEllipsis]);

  // ========================== Tooltip ===========================
  const tooltipProps = useTooltipProps(ellipsisConfig.tooltip, editConfig.text, children);

  const topAriaLabel = React.useMemo(() => {
    if (!enableEllipsis || cssEllipsis) {
      return undefined;
    }
    return [editConfig.text, children, title, tooltipProps.title].find(isValidText);
  }, [enableEllipsis, cssEllipsis, title, tooltipProps.title, isMergedEllipsis]);

  // =========================== Render ===========================
  // >>>>>>>>>>> Editing input
  if (editing) {
    return (
      <Editable
        value={editConfig.text ?? (typeof children === 'string' ? children : '')}
        onSave={onEditChange}
        onCancel={onEditCancel}
        onEnd={editConfig.onEnd}
        prefixCls={prefixCls}
        className={className}
        style={style}
        direction={direction}
        component={component}
        maxLength={editConfig.maxLength}
        autoSize={editConfig.autoSize}
        enterIcon={editConfig.enterIcon}
      />
    );
  }

  // >>>>>>>>>>> Typography
  // Expand
  const renderExpand = () => {
    const { expandable, symbol } = ellipsisConfig;
    return expandable ? (
      <button
        type="button"
        key="expand"
        className={`${prefixCls}-${expanded ? 'collapse' : 'expand'}`}
        onClick={(e) => onExpandClick(e!, { expanded: !expanded })}
        aria-label={expanded ? textLocale.collapse : textLocale?.expand}
      >
        {typeof symbol === 'function' ? symbol(expanded) : symbol}
      </button>
    ) : null;
  };

  // Edit
  const renderEdit = () => {
    if (!enableEdit) {
      return;
    }

    const { icon, tooltip, tabIndex } = editConfig;

    const editTitle = toArray(tooltip)[0] || textLocale?.edit;
    const ariaLabel = typeof editTitle === 'string' ? editTitle : '';

    return triggerType.includes('icon') ? (
      <Tooltip key="edit" title={tooltip === false ? '' : editTitle}>
        <button
          type="button"
          ref={editIconRef}
          className={`${prefixCls}-edit`}
          onClick={onEditClick}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
        >
          {icon || <EditOutlined role="button" />}
        </button>
      </Tooltip>
    ) : null;
  };

  // Copy
  const renderCopy = () => {
    if (!enableCopy) {
      return null;
    }

    return (
      <CopyBtn
        key="copy"
        {...copyConfig}
        prefixCls={prefixCls}
        copied={copied}
        locale={textLocale}
        onCopy={onCopyClick}
        loading={copyLoading}
        iconOnly={children === null || children === undefined}
      />
    );
  };

  const renderOperations = (canEllipsis: boolean) => [
    canEllipsis && renderExpand(),
    renderEdit(),
    renderCopy(),
  ];

  const renderEllipsis = (canEllipsis: boolean) => [
    canEllipsis && !expanded && (
      <span aria-hidden key="ellipsis">
        {ELLIPSIS_STR}
      </span>
    ),
    ellipsisConfig.suffix,
    renderOperations(canEllipsis),
  ];

  return (
    <ResizeObserver onResize={onResize} disabled={!mergedEnableEllipsis}>
      {(resizeRef: React.RefObject<HTMLElement>) => (
        <EllipsisTooltip
          tooltipProps={tooltipProps}
          enableEllipsis={mergedEnableEllipsis}
          isEllipsis={isMergedEllipsis}
        >
          <Typography
            className={classNames(
              {
                [`${prefixCls}-${type}`]: type,
                [`${prefixCls}-disabled`]: disabled,
                [`${prefixCls}-ellipsis`]: enableEllipsis,
                [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
                [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp,
              },
              className,
            )}
            prefixCls={customizePrefixCls}
            style={{
              ...style,
              WebkitLineClamp: cssLineClamp ? rows : undefined,
            }}
            component={component}
            ref={composeRef(resizeRef, typographyRef, ref)}
            direction={direction}
            onClick={triggerType.includes('text') ? onEditClick : undefined}
            aria-label={topAriaLabel?.toString()}
            title={title}
            {...textProps}
          >
            <Ellipsis
              enableMeasure={mergedEnableEllipsis && !cssEllipsis}
              text={children}
              rows={rows}
              width={ellipsisWidth}
              onEllipsis={onJsEllipsis}
              expanded={expanded}
              miscDeps={[copied, expanded, copyLoading, enableEdit, enableCopy, textLocale]}
            >
              {(node, canEllipsis) =>
                wrapperDecorations(
                  props,
                  <>
                    {node.length > 0 && canEllipsis && !expanded && topAriaLabel ? (
                      <span key="show-content" aria-hidden>
                        {node}
                      </span>
                    ) : (
                      node
                    )}
                    {renderEllipsis(canEllipsis)}
                  </>,
                )
              }
            </Ellipsis>
          </Typography>
        </EllipsisTooltip>
      )}
    </ResizeObserver>
  );
});

export default Base;
