import * as React from 'react';
import toArray from '@rc-component/util/lib/Children/toArray';
import classNames from 'classnames';

import { isPresetSize, isValidGapNumber } from '../_util/gapSize';
import { useComponentConfig } from '../config-provider/context';
import type { SizeType } from '../config-provider/SizeContext';
import Compact from './Compact';
import { SpaceContextProvider } from './context';
import type { SpaceContextType } from './context';
import Item from './Item';
import useStyle from './style';

export { SpaceContext } from './context';

export type SpaceSize = SizeType | number;
type SemanticName = 'root' | 'item';

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  size?: SpaceSize | [SpaceSize, SpaceSize];
  direction?: 'horizontal' | 'vertical';
  // No `stretch` since many components do not support that.
  align?: 'start' | 'end' | 'center' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
  classNames?: Partial<Record<SemanticName, string>>;
  styles?: Partial<Record<SemanticName, React.CSSProperties>>;
}

const InternalSpace = React.forwardRef<HTMLDivElement, SpaceProps>((props, ref) => {
  const {
    getPrefixCls,
    direction: directionConfig,
    size: contextSize,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles,
  } = useComponentConfig('space');

  const {
    size = contextSize ?? 'small',
    align,
    className,
    rootClassName,
    children,
    direction = 'horizontal',
    prefixCls: customizePrefixCls,
    split,
    style,
    wrap = false,
    classNames: spaceClassNames,
    styles,
    ...restProps
  } = props;

  const [horizontalSize, verticalSize] = Array.isArray(size) ? size : ([size, size] as const);

  const isPresetVerticalSize = isPresetSize(verticalSize);

  const isPresetHorizontalSize = isPresetSize(horizontalSize);

  const isValidVerticalSize = isValidGapNumber(verticalSize);

  const isValidHorizontalSize = isValidGapNumber(horizontalSize);

  const childNodes = toArray(children, { keepEmpty: true });

  const mergedAlign = align === undefined && direction === 'horizontal' ? 'center' : align;
  const prefixCls = getPrefixCls('space', customizePrefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const rootClassNames = classNames(
    prefixCls,
    contextClassName,
    hashId,
    `${prefixCls}-${direction}`,
    {
      [`${prefixCls}-rtl`]: directionConfig === 'rtl',
      [`${prefixCls}-align-${mergedAlign}`]: mergedAlign,
      [`${prefixCls}-gap-row-${verticalSize}`]: isPresetVerticalSize,
      [`${prefixCls}-gap-col-${horizontalSize}`]: isPresetHorizontalSize,
    },
    className,
    rootClassName,
    cssVarCls,
    spaceClassNames?.root,
    contextClassNames.root,
  );

  const itemClassName = classNames(
    `${prefixCls}-item`,
    spaceClassNames?.item,
    contextClassNames.item,
  );

  // Calculate latest one
  let latestIndex = 0;
  const nodes = childNodes.map<React.ReactNode>((child, i) => {
    if (child !== null && child !== undefined) {
      latestIndex = i;
    }

    const key = child?.key || `${itemClassName}-${i}`;

    return (
      <Item
        className={itemClassName}
        key={key}
        index={i}
        split={split}
        style={styles?.item ?? contextStyles.item}
      >
        {child}
      </Item>
    );
  });

  const spaceContext = React.useMemo<SpaceContextType>(() => ({ latestIndex }), [latestIndex]);

  // =========================== Render ===========================
  if (childNodes.length === 0) {
    return null;
  }

  const gapStyle: React.CSSProperties = {};

  if (wrap) {
    gapStyle.flexWrap = 'wrap';
  }

  if (!isPresetHorizontalSize && isValidHorizontalSize) {
    gapStyle.columnGap = horizontalSize;
  }

  if (!isPresetVerticalSize && isValidVerticalSize) {
    gapStyle.rowGap = verticalSize;
  }

  return wrapCSSVar(
    <div
      ref={ref}
      className={rootClassNames}
      style={{ ...gapStyle, ...contextStyles.root, ...contextStyle, ...styles?.root, ...style }}
      {...restProps}
    >
      <SpaceContextProvider value={spaceContext}>{nodes}</SpaceContextProvider>
    </div>,
  );
});

type CompoundedComponent = typeof InternalSpace & {
  Compact: typeof Compact;
};

const Space = InternalSpace as CompoundedComponent;

Space.Compact = Compact;

if (process.env.NODE_ENV !== 'production') {
  Space.displayName = 'Space';
}

export default Space;
