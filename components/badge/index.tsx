import * as React from 'react';
import { useMemo, useRef } from 'react';
import classnames from 'classnames';
import CSSMotion from 'rc-motion';

import type { PresetStatusColorType } from '../_util/colors';
import { isPresetColor } from '../_util/colors';
import { cloneElement } from '../_util/reactNode';
import type { LiteralUnion } from '../_util/type';
import { ConfigContext } from '../config-provider';
import type { PresetColorKey } from '../theme/internal';
import Ribbon from './Ribbon';
import ScrollNumber from './ScrollNumber';
import useStyle from './style';

export type { ScrollNumberProps } from './ScrollNumber';

type SemanticName = 'root' | 'indicator';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number to show in badge */
  count?: React.ReactNode;
  showZero?: boolean;
  /** Max count to show */
  overflowCount?: number;
  /** Whether to show red dot without number */
  dot?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  scrollNumberPrefixCls?: string;
  className?: string;
  rootClassName?: string;
  status?: PresetStatusColorType;
  color?: LiteralUnion<PresetColorKey>;
  text?: React.ReactNode;
  size?: 'default' | 'small';
  offset?: [number | string, number | string];
  title?: string;
  children?: React.ReactNode;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
}

const InternalBadge = React.forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    scrollNumberPrefixCls: customizeScrollNumberPrefixCls,
    children,
    status,
    text,
    color,
    count = null,
    overflowCount = 99,
    dot = false,
    size = 'default',
    title,
    offset,
    style,
    className,
    rootClassName,
    classNames,
    styles,
    showZero = false,
    ...restProps
  } = props;
  const { getPrefixCls, direction, badge } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('badge', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  // ================================ Misc ================================
  const numberedDisplayCount = (
    (count as number) > (overflowCount as number) ? `${overflowCount}+` : count
  ) as string | number | null;

  const isZero = numberedDisplayCount === '0' || numberedDisplayCount === 0;

  const ignoreCount = count === null || (isZero && !showZero);

  const hasStatus =
    ((status !== null && status !== undefined) || (color !== null && color !== undefined)) &&
    ignoreCount;

  const showAsDot = dot && !isZero;

  const mergedCount = showAsDot ? '' : numberedDisplayCount;

  const isHidden = useMemo(() => {
    const isEmpty = mergedCount === null || mergedCount === undefined || mergedCount === '';
    return (isEmpty || (isZero && !showZero)) && !showAsDot;
  }, [mergedCount, isZero, showZero, showAsDot]);

  // Count should be cache in case hidden change it
  const countRef = useRef(count);
  if (!isHidden) {
    countRef.current = count;
  }
  const livingCount = countRef.current;

  // We need cache count since remove motion should not change count display
  const displayCountRef = useRef(mergedCount);
  if (!isHidden) {
    displayCountRef.current = mergedCount;
  }
  const displayCount = displayCountRef.current;

  // We will cache the dot status to avoid shaking on leaved motion
  const isDotRef = useRef(showAsDot);
  if (!isHidden) {
    isDotRef.current = showAsDot;
  }

  // =============================== Styles ===============================
  const mergedStyle = useMemo<React.CSSProperties>(() => {
    if (!offset) {
      return { ...badge?.style, ...style };
    }

    const offsetStyle: React.CSSProperties = { marginTop: offset[1] };
    if (direction === 'rtl') {
      offsetStyle.left = parseInt(offset[0] as string, 10);
    } else {
      offsetStyle.right = -parseInt(offset[0] as string, 10);
    }

    return { ...offsetStyle, ...badge?.style, ...style };
  }, [direction, offset, style, badge?.style]);

  // =============================== Render ===============================
  // >>> Title
  const titleNode =
    title ??
    (typeof livingCount === 'string' || typeof livingCount === 'number' ? livingCount : undefined);

  // >>> Status Text
  const statusTextNode =
    isHidden || !text ? null : <span className={`${prefixCls}-status-text`}>{text}</span>;

  // >>> Display Component
  const displayNode =
    !livingCount || typeof livingCount !== 'object'
      ? undefined
      : cloneElement(livingCount, (oriProps) => ({
          style: { ...mergedStyle, ...oriProps.style },
        }));

  // InternalColor
  const isInternalColor = isPresetColor(color, false);

  // Shared styles
  const statusCls = classnames(classNames?.indicator, badge?.classNames?.indicator, {
    [`${prefixCls}-status-dot`]: isZero ? showZero : hasStatus,
    [`${prefixCls}-status-${status}`]: !!status,
    [`${prefixCls}-color-${color}`]: isInternalColor,
  });

  const statusStyle: React.CSSProperties = {};
  if (color && !isInternalColor) {
    statusStyle.color = color;
    statusStyle.background = color;
  }

  const badgeClassName = classnames(
    prefixCls,
    {
      [`${prefixCls}-status`]: hasStatus,
      [`${prefixCls}-not-a-wrapper`]: !children,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
    rootClassName,
    badge?.className,
    badge?.classNames?.root,
    classNames?.root,
    hashId,
    cssVarCls,
  );

  // <Badge status="success" />
  if (!children && hasStatus) {
    const statusTextColor = mergedStyle.color;
    return wrapCSSVar(
      <span
        {...restProps}
        className={badgeClassName}
        style={{ ...styles?.root, ...badge?.styles?.root, ...mergedStyle }}
      >
        <span
          className={statusCls}
          style={{ ...styles?.indicator, ...badge?.styles?.indicator, ...statusStyle }}
        />
        {text && (
          <span style={{ color: statusTextColor }} className={`${prefixCls}-status-text`}>
            {text}
          </span>
        )}
      </span>,
    );
  }

  return wrapCSSVar(
    <span
      ref={ref}
      {...restProps}
      className={badgeClassName}
      style={{ ...badge?.styles?.root, ...styles?.root }}
    >
      {children}
      <CSSMotion
        visible={!isHidden}
        motionName={`${prefixCls}-zoom`}
        motionAppear={false}
        motionDeadline={1000}
      >
        {({ className: motionClassName }) => {
          const scrollNumberPrefixCls = getPrefixCls(
            'scroll-number',
            customizeScrollNumberPrefixCls,
          );

          const isDot = isDotRef.current;

          const scrollNumberCls = classnames(classNames?.indicator, badge?.classNames?.indicator, {
            [`${prefixCls}-dot`]: isDot,
            [`${prefixCls}-count`]: !isDot,
            [`${prefixCls}-count-sm`]: size === 'small',
            [`${prefixCls}-multiple-words`]:
              !isDot && displayCount && displayCount.toString().length > 1,
            [`${prefixCls}-status-${status}`]: !!status,
            [`${prefixCls}-color-${color}`]: isInternalColor,
          });

          let scrollNumberStyle: React.CSSProperties = {
            ...styles?.indicator,
            ...badge?.styles?.indicator,
            ...mergedStyle,
          };

          if (color && !isInternalColor) {
            scrollNumberStyle = scrollNumberStyle || {};
            scrollNumberStyle.background = color;
          }

          return (
            <ScrollNumber
              prefixCls={scrollNumberPrefixCls}
              show={!isHidden}
              motionClassName={motionClassName}
              className={scrollNumberCls}
              count={displayCount}
              title={titleNode}
              style={scrollNumberStyle}
              key="scrollNumber"
            >
              {displayNode}
            </ScrollNumber>
          );
        }}
      </CSSMotion>
      {statusTextNode}
    </span>,
  );
});

type CompoundedComponent = typeof InternalBadge & {
  Ribbon: typeof Ribbon;
};

const Badge = InternalBadge as CompoundedComponent;

Badge.Ribbon = Ribbon;

if (process.env.NODE_ENV !== 'production') {
  Badge.displayName = 'Badge';
}

export default Badge;
