import * as React from 'react';
import classNames from 'classnames';

export type ElementSemanticName = 'root' | 'content';

export interface SkeletonElementProps {
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  style?: React.CSSProperties;
  size?: 'large' | 'small' | 'default' | number;
  shape?: 'circle' | 'square' | 'round' | 'default';
  active?: boolean;
  classNames?: Record<ElementSemanticName, string>;
  styles?: Record<ElementSemanticName, React.CSSProperties>;
}

const Element: React.FC<SkeletonElementProps> = (props) => {
  const { prefixCls, className, style, size, shape } = props;

  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small',
  });

  const shapeCls = classNames({
    [`${prefixCls}-circle`]: shape === 'circle',
    [`${prefixCls}-square`]: shape === 'square',
    [`${prefixCls}-round`]: shape === 'round',
  });

  const sizeStyle = React.useMemo<React.CSSProperties>(
    () =>
      typeof size === 'number'
        ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
          }
        : {},
    [size],
  );

  return (
    <span
      className={classNames(prefixCls, sizeCls, shapeCls, className)}
      style={{ ...sizeStyle, ...style }}
    />
  );
};

export default Element;
