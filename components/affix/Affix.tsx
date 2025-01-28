import React from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';

import throttleByAnimationFrame from '../_util/throttleByAnimationFrame';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import useStyle from './style';
import { getFixedBottom, getFixedTop, getTargetRect } from './utils';

const TRIGGER_EVENTS: (keyof WindowEventMap)[] = [
  'resize',
  'scroll',
  'touchstart',
  'touchmove',
  'touchend',
  'pageshow',
  'load',
];

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

// Affix
export interface AffixProps {
  /** Triggered when the specified offset is reached from the top of the window */
  offsetTop?: number;
  /** Triggered when the specified offset is reached from the bottom of the window */
  offsetBottom?: number;
  style?: React.CSSProperties;
  /** Callback function triggered when fixed state changes */
  onChange?: (affixed?: boolean) => void;
  /** Set the element that Affix needs to listen to its scroll event, the value is a function that returns the corresponding DOM element */
  target?: () => Window | HTMLElement | null;
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  children: React.ReactNode;
}
const AFFIX_STATUS_NONE = 0;
const AFFIX_STATUS_PREPARE = 1;

type AffixStatus = typeof AFFIX_STATUS_NONE | typeof AFFIX_STATUS_PREPARE;

interface AffixState {
  affixStyle?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
  status: AffixStatus;
  lastAffix: boolean;
  prevTarget: Window | HTMLElement | null;
}

export interface AffixRef {
  updatePosition: ReturnType<typeof throttleByAnimationFrame>;
}

type InternalAffixProps = AffixProps & { onTestUpdatePosition?: any };
const Affix = React.forwardRef<AffixRef, InternalAffixProps>((props, ref) => {
  const {
    style,
    offsetTop,
    offsetBottom,
    prefixCls,
    className,
    rootClassName,
    children,
    target,
    onChange,
    onTestUpdatePosition,
    ...restProps
  } = props;

  const { getPrefixCls, getTargetContainer } = React.useContext<ConfigConsumerProps>(ConfigContext);

  const affixPrefixCls = getPrefixCls('affix', prefixCls);

  const [lastAffix, setLastAffix] = React.useState(false);
  const [affixStyle, setAffixStyle] = React.useState<React.CSSProperties>();
  const [placeholderStyle, setPlaceholderStyle] = React.useState<React.CSSProperties>();

  const status = React.useRef<AffixStatus>(AFFIX_STATUS_NONE);

  const prevTarget = React.useRef<Window | HTMLElement | null>(null);
  const prevListener = React.useRef<EventListener>(null);

  const placeholderNodeRef = React.useRef<HTMLDivElement>(null);
  const fixedNodeRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetFunc = target ?? getTargetContainer ?? getDefaultTarget;

  const internalOffsetTop = offsetBottom === undefined && offsetTop === undefined ? 0 : offsetTop;

  // =================== Measure ===================
  const measure = () => {
    if (
      status.current !== AFFIX_STATUS_PREPARE ||
      !fixedNodeRef.current ||
      !placeholderNodeRef.current ||
      !targetFunc
    ) {
      return;
    }

    const targetNode = targetFunc();
    if (targetNode) {
      const newState: Partial<AffixState> = {
        status: AFFIX_STATUS_NONE,
      };
      const placeholderRect = getTargetRect(placeholderNodeRef.current);

      if (
        placeholderRect.top === 0 &&
        placeholderRect.left === 0 &&
        placeholderRect.width === 0 &&
        placeholderRect.height === 0
      ) {
        return;
      }

      const targetRect = getTargetRect(targetNode);
      const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop);
      const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
        newState.placeholderStyle = {
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
        newState.placeholderStyle = {
          width: placeholderRect.width,
          height: placeholderRect.height,
        };
      }

      newState.lastAffix = !!newState.affixStyle;

      if (lastAffix !== newState.lastAffix) {
        onChange?.(newState.lastAffix);
      }

      status.current = newState.status!;
      setAffixStyle(newState.affixStyle);
      setPlaceholderStyle(newState.placeholderStyle);
      setLastAffix(newState.lastAffix);
    }
  };

  const prepareMeasure = () => {
    status.current = AFFIX_STATUS_PREPARE;
    measure();
    if (process.env.NODE_ENV === 'test') {
      onTestUpdatePosition?.();
    }
  };

  const updatePosition = throttleByAnimationFrame(() => {
    prepareMeasure();
  });

  const lazyUpdatePosition = throttleByAnimationFrame(() => {
    // Check position change before measure to make Safari smooth
    if (targetFunc && affixStyle) {
      const targetNode = targetFunc();
      if (targetNode && placeholderNodeRef.current) {
        const targetRect = getTargetRect(targetNode);
        const placeholderRect = getTargetRect(placeholderNodeRef.current);
        const fixedTop = getFixedTop(placeholderRect, targetRect, internalOffsetTop);
        const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

        if (
          (fixedTop !== undefined && affixStyle.top === fixedTop) ||
          (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
        ) {
          return;
        }
      }
    }

    // Directly call prepare measure since it's already throttled.
    prepareMeasure();
  });

  const addListeners = () => {
    const listenerTarget = targetFunc?.();
    if (!listenerTarget) {
      return;
    }
    TRIGGER_EVENTS.forEach((eventName) => {
      if (prevListener.current) {
        prevTarget.current?.removeEventListener(eventName, prevListener.current);
      }
      listenerTarget?.addEventListener(eventName, lazyUpdatePosition);
    });
    prevTarget.current = listenerTarget;
    prevListener.current = lazyUpdatePosition;
  };

  const removeListeners = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const newTarget = targetFunc?.();
    TRIGGER_EVENTS.forEach((eventName) => {
      newTarget?.removeEventListener(eventName, lazyUpdatePosition);
      if (prevListener.current) {
        prevTarget.current?.removeEventListener(eventName, prevListener.current);
      }
    });
    updatePosition.cancel();
    lazyUpdatePosition.cancel();
  };

  React.useImperativeHandle(ref, () => ({ updatePosition }));

  // mount & unmount
  React.useEffect(() => {
    // [Legacy] Wait for parent component ref has its value.
    // We should use target as directly element instead of function which makes element check hard.
    timer.current = setTimeout(addListeners);
    return () => removeListeners();
  }, []);

  React.useEffect(() => {
    addListeners();
  }, [target, affixStyle]);

  React.useEffect(() => {
    updatePosition();
  }, [target, offsetTop, offsetBottom]);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(affixPrefixCls);

  const rootCls = classNames(rootClassName, hashId, affixPrefixCls, cssVarCls);

  const mergedCls = classNames({ [rootCls]: affixStyle });

  return wrapCSSVar(
    <ResizeObserver onResize={updatePosition}>
      <div style={style} className={className} ref={placeholderNodeRef} {...restProps}>
        {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
        <div className={mergedCls} ref={fixedNodeRef} style={affixStyle}>
          <ResizeObserver onResize={updatePosition}>{children}</ResizeObserver>
        </div>
      </div>
    </ResizeObserver>,
  );
});

if (process.env.NODE_ENV !== 'production') {
  Affix.displayName = 'Affix';
}

export default Affix;
