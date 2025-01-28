import * as React from 'react';
import ResizeObserver from '@rc-component/resize-observer';
import { composeRef } from '@rc-component/util/lib/ref';
import classNames from 'classnames';

import type { Breakpoint } from '../_util/responsiveObserver';
import { responsiveArray } from '../_util/responsiveObserver';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import useSize from '../config-provider/hooks/useSize';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import type { AvatarContextType, AvatarSize } from './AvatarContext';
import AvatarContext from './AvatarContext';
import useStyle from './style';

export interface AvatarProps {
  /** Shape of avatar, options: `circle`, `square` */
  shape?: 'circle' | 'square';
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size?: AvatarSize;
  gap?: number;
  /** Src of image avatar */
  src?: React.ReactNode;
  /** Srcset of image avatar */
  srcSet?: string;
  draggable?: boolean | 'true' | 'false';
  /** Icon to be used in avatar */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  children?: React.ReactNode;
  alt?: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  /* callback when img load error */
  /* return false to prevent Avatar show default fallback behavior, then you can do fallback by yourself */
  onError?: () => boolean;
}

const InternalAvatar: React.ForwardRefRenderFunction<HTMLSpanElement, AvatarProps> = (
  props,
  ref,
) => {
  const [scale, setScale] = React.useState(1);
  const [mounted, setMounted] = React.useState(false);
  const [isImgExist, setIsImgExist] = React.useState(true);

  const avatarNodeRef = React.useRef<HTMLSpanElement>(null);
  const avatarChildrenRef = React.useRef<HTMLSpanElement>(null);
  const avatarNodeMergedRef = composeRef<HTMLSpanElement>(ref, avatarNodeRef);

  const { getPrefixCls, avatar } = React.useContext(ConfigContext);

  const avatarCtx = React.useContext<AvatarContextType>(AvatarContext);

  const setScaleParam = () => {
    if (!avatarChildrenRef.current || !avatarNodeRef.current) {
      return;
    }
    const childrenWidth = avatarChildrenRef.current.offsetWidth; // offsetWidth avoid affecting be transform scale
    const nodeWidth = avatarNodeRef.current.offsetWidth;
    // denominator is 0 is no meaning
    if (childrenWidth !== 0 && nodeWidth !== 0) {
      const { gap = 4 } = props;
      if (gap * 2 < nodeWidth) {
        setScale(nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1);
      }
    }
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setIsImgExist(true);
    setScale(1);
  }, [props.src]);

  React.useEffect(setScaleParam, [props.gap]);

  const handleImgLoadError = () => {
    const { onError } = props;
    const errorFlag = onError?.();
    if (errorFlag !== false) {
      setIsImgExist(false);
    }
  };

  const {
    prefixCls: customizePrefixCls,
    shape,
    size: customSize,
    src,
    srcSet,
    icon,
    className,
    rootClassName,
    alt,
    draggable,
    children,
    crossOrigin,
    ...others
  } = props;

  const size = useSize((ctxSize) => customSize ?? avatarCtx?.size ?? ctxSize ?? 'default');

  const needResponsive = Object.keys(typeof size === 'object' ? size || {} : {}).some((key) =>
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key),
  );
  const screens = useBreakpoint(needResponsive);
  const responsiveSizeStyle = React.useMemo<React.CSSProperties>(() => {
    if (typeof size !== 'object') {
      return {};
    }

    const currentBreakpoint: Breakpoint = responsiveArray.find((screen) => screens[screen])!;

    const currentSize = size[currentBreakpoint];

    return currentSize
      ? {
          width: currentSize,
          height: currentSize,
          fontSize: currentSize && (icon || children) ? currentSize / 2 : 18,
        }
      : {};
  }, [screens, size]);

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Avatar');

    warning(
      !(typeof icon === 'string' && icon.length > 2),
      'breaking',
      `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
    );
  }

  const prefixCls = getPrefixCls('avatar', customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small',
  });

  const hasImageElement = React.isValidElement(src);

  const mergedShape = shape || avatarCtx?.shape || 'circle';

  const classString = classNames(
    prefixCls,
    sizeCls,
    avatar?.className,
    `${prefixCls}-${mergedShape}`,
    {
      [`${prefixCls}-image`]: hasImageElement || (src && isImgExist),
      [`${prefixCls}-icon`]: !!icon,
    },
    cssVarCls,
    rootCls,
    className,
    rootClassName,
    hashId,
  );

  const sizeStyle: React.CSSProperties =
    typeof size === 'number'
      ? {
          width: size,
          height: size,
          fontSize: icon ? size / 2 : 18,
        }
      : {};

  let childrenToRender: React.ReactNode;
  if (typeof src === 'string' && isImgExist) {
    childrenToRender = (
      <img
        src={src}
        draggable={draggable}
        srcSet={srcSet}
        onError={handleImgLoadError}
        alt={alt}
        crossOrigin={crossOrigin}
      />
    );
  } else if (hasImageElement) {
    childrenToRender = src;
  } else if (icon) {
    childrenToRender = icon;
  } else if (mounted || scale !== 1) {
    const transformString = `scale(${scale})`;
    const childrenStyle: React.CSSProperties = {
      msTransform: transformString,
      WebkitTransform: transformString,
      transform: transformString,
    };

    childrenToRender = (
      <ResizeObserver onResize={setScaleParam}>
        <span
          className={`${prefixCls}-string`}
          ref={avatarChildrenRef}
          style={{ ...childrenStyle }}
        >
          {children}
        </span>
      </ResizeObserver>
    );
  } else {
    childrenToRender = (
      <span className={`${prefixCls}-string`} style={{ opacity: 0 }} ref={avatarChildrenRef}>
        {children}
      </span>
    );
  }

  // The event is triggered twice from bubbling up the DOM tree.
  // see https://codesandbox.io/s/kind-snow-9lidz
  delete others.onError;
  delete others.gap;

  return wrapCSSVar(
    <span
      {...others}
      style={{ ...sizeStyle, ...responsiveSizeStyle, ...avatar?.style, ...others.style }}
      className={classString}
      ref={avatarNodeMergedRef}
    >
      {childrenToRender}
    </span>,
  );
};

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(InternalAvatar);

if (process.env.NODE_ENV !== 'production') {
  Avatar.displayName = 'Avatar';
}

export default Avatar;
