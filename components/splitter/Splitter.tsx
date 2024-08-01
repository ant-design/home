import type { ReactNode } from 'react';
import React, { Children, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import { SplitterContext } from './context';
import type { InternalPanelProps } from './Panel';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';
import useStyle from './style';
import useResize, { sizeTransform } from './useResize';

export interface SplitterProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  rootClassName?: string;

  layout?: 'horizontal' | 'vertical';
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
}

const SPLIT_BAR_SIZE = 2;

const SplitterComp: React.FC<SplitterProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    layout = 'horizontal',
    children,

    rootClassName,

    onResizeStart,
    onResize,
    onResizeEnd,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('splitter', customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  const [containerSize, setContainerSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // panel size
  const [basicsState, setBasicsState] = useState<number[]>([]);

  // panel info
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const panelCount = Children.count(children);
  const gutter = ((panelCount - 1) * SPLIT_BAR_SIZE) / panelCount;
  const items = useMemo(() => {
    const infos: InternalPanelProps[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        infos.push({ ...child.props });
      }
    });
    return infos;
  }, [children]);

  const childrenNode = useMemo(
    () =>
      items.reduce((node: ReactNode[], item, idx) => {
        node.push(
          <InternalPanel
            {...item}
            ref={(ref) => {
              panelsRef.current[idx] = ref;
            }}
            key={`panel${`-${idx}`}`}
            size={basicsState[idx]}
            prefixCls={prefixCls}
            gutter={gutter}
          />,
        );

        if (idx + 1 < panelCount) {
          node.push(
            <SplitBar
              key={`split-bar${`-${idx}`}`}
              prefixCls={prefixCls}
              size={SPLIT_BAR_SIZE}
              index={idx}
              resizable={item.resizable}
              collapsible={item.collapsible}
            />,
          );
        }
        return node;
      }, []),

    [items, basicsState],
  );

  const { resizing, resizeStart, setSize } = useResize({
    containerSize,
    panelsRef,
    layout,
    gutter,
    items,
    basicsData: basicsState,
    onResizeStart,
    onResize,
    onResizeEnd,
    setBasicsState,
  });

  const containerClassName = classNames(
    prefixCls,
    className,
    {
      [`${prefixCls}-horizontal`]: layout === 'horizontal',
      [`${prefixCls}-vertical`]: layout === 'vertical',
      [`${prefixCls}-resizing`]: resizing,
    },
    rootClassName,
    cssVarCls,
    rootCls,
    hashId,
  );

  useEffect(() => {
    // 计算初始值
    const getInitialBasics = (sizeCount: number) => {
      const sizes: (number | undefined)[] = [];
      let sum = 0;
      let count = 0;

      items.forEach((child) => {
        let currentSize = child.size || child.defaultSize;
        if (currentSize === undefined) {
          sizes.push(undefined);
          return;
        }

        currentSize = sizeTransform(currentSize, sizeCount);
        sum += currentSize;
        count += 1;
        sizes.push(currentSize);
      });

      const averageSize = sum > 100 ? 0 : (100 - sum) / (panelCount - count);
      items.forEach((_, idx) => {
        if (sizes[idx] === undefined) {
          sizes[idx] = averageSize;
        }
      });
      return sizes as number[];
    };

    setBasicsState(getInitialBasics(containerSize));
    // item.size 改变时，重新计算 flexBasis
  }, [JSON.stringify(items.map((item) => item.size)), containerSize, panelCount]);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerSize(layout === 'horizontal' ? clientWidth : clientHeight);
    }
  }, [layout]);

  return wrapCSSVar(
    <SplitterContext.Provider value={{ layout, resizing, basicsState, resizeStart, setSize }}>
      <div ref={containerRef} style={style} className={containerClassName}>
        {childrenNode}
      </div>
    </SplitterContext.Provider>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  SplitterComp.displayName = 'Splitter';
}

export default SplitterComp;
