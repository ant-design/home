import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';

import useResponsiveObserver, { responsiveArray, ScreenMap } from '../_util/responsiveObserver';
import { ConfigContext } from '../config-provider';
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls';
import { Gap, Gutter, MasonryProps } from './interface';
import MasonryItem from './MasonryItem';
import useStyle from './style';

const getNearestNumber = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const Masonry: React.FC<MasonryProps> = ({
  columns,
  prefixCls: customizePrefixCls,
  gutter = 0,
  sequential = false,
  items,
  keepAspectRatio = false,
}) => {
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('masonry', customizePrefixCls);
  const rootCls = useCSSVarCls(prefixCls);
  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls, rootCls);

  const gutterRef = useRef<Gutter | [Gutter, Gutter]>(gutter);

  const [itemLayouts, setItemLayouts] = useState<CSSProperties[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [screens, setScreens] = useState<ScreenMap>({
    xs: true,
    sm: true,
    md: true,
    lg: true,
    xl: true,
    xxl: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const responsiveObserver = useResponsiveObserver();
  const itemPrefixCls = `${prefixCls}-item`;
  const mansoryCls = classNames(prefixCls, hashId, cssVarCls);

  useEffect(() => {
    const token = responsiveObserver.subscribe((screen) => {
      const currentGutter = gutterRef.current || 0;
      const gutterHasResponsive =
        (!Array.isArray(currentGutter) && typeof currentGutter === 'object') ||
        (Array.isArray(currentGutter) &&
          (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object'));
      const columnsHasResponsive = typeof columns === 'object';
      if (gutterHasResponsive || columnsHasResponsive) {
        setScreens(screen);
      }
    });
    return () => responsiveObserver.unsubscribe(token);
  }, []);

  const { horizontalGutter = 0, verticalGutter = 0 } = useMemo((): {
    horizontalGutter: Gap | undefined;
    verticalGutter: Gap | undefined;
  } => {
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, undefined];
    const [horizontalGutter, verticalGutter] = normalizedGutter.map((g): Gap => {
      if (typeof g !== 'object') {
        return g;
      }

      // Find first matching responsive breakpoint
      const matchingBreakpoint = responsiveArray.find(
        (breakpoint) => screens[breakpoint] && g[breakpoint] !== undefined,
      );

      return matchingBreakpoint ? (g[matchingBreakpoint] as number) : undefined;
    }) as [Gap, Gap];

    return {
      horizontalGutter: horizontalGutter ?? 0,
      verticalGutter: verticalGutter ?? horizontalGutter ?? 0,
    };
  }, [gutter, screens]);

  const currentColumns = useMemo<number>(() => {
    if (typeof columns === 'number') {
      return columns;
    }

    // Find first matching responsive breakpoint
    const matchingBreakpoint = responsiveArray.find(
      (breakpoint) => screens[breakpoint] && columns[breakpoint] !== undefined,
    );

    if (matchingBreakpoint) {
      return columns[matchingBreakpoint] as number;
    }

    return columns.xxl ?? columns.xl ?? columns.lg ?? columns.md ?? columns.sm ?? columns.xs ?? 1;
  }, [columns, screens]);

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const columnHeights = new Array(currentColumns).fill(0);
      const curContainerWidth = containerRef.current.clientWidth;
      const eachItemWidth = getNearestNumber(
        (curContainerWidth - horizontalGutter * (currentColumns - 1)) / currentColumns,
      );
      const newItemLayouts: CSSProperties[] = [];

      const containerElements = containerRef.current.querySelectorAll(`[data-${itemPrefixCls}]`);

      let skip = false;
      containerElements.forEach((element, index) => {
        if (skip) {
          return;
        }

        const elementHeight = parseFloat(element.getAttribute('data-height')!);
        const elementWidth = parseFloat(element.getAttribute('data-width')!);

        if (elementHeight === 0) {
          skip = true;
          return;
        }

        const aspectRatio = elementWidth / elementHeight;

        const adjustedHeight = keepAspectRatio
          ? getNearestNumber(eachItemWidth / aspectRatio)
          : getNearestNumber(elementHeight);

        let columnIndex: number;
        const existingColumn = element.getAttribute('data-column');

        if (existingColumn !== null) {
          // If item already has a column assigned, keep it there
          columnIndex = parseInt(existingColumn, 10);
        } else if (sequential) {
          columnIndex = index % currentColumns;
        } else {
          columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        }

        // Store column assignment on the element
        element.setAttribute('data-column', columnIndex.toString());

        columnHeights[columnIndex] += adjustedHeight + verticalGutter;

        newItemLayouts.push({
          [`--${itemPrefixCls}-width`]: `${eachItemWidth}px`,
          [`--${itemPrefixCls}-height`]: `${adjustedHeight}px`,
          [`--${itemPrefixCls}-translate-x`]: `${
            direction === 'rtl' ? '-' : ''
          }${getNearestNumber(columnIndex * (eachItemWidth + horizontalGutter))}px`,
          [`--${itemPrefixCls}-translate-y`]: `${getNearestNumber(columnHeights[columnIndex] - adjustedHeight - verticalGutter)}px`,
        });
      });

      if (!skip) {
        setItemLayouts(newItemLayouts);
        setContainerHeight(Math.max(...columnHeights));
      }
    }
  }, [
    currentColumns,
    horizontalGutter,
    verticalGutter,
    sequential,
    items.map((item, index) => item.key ?? index).join(','),
  ]);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const images = containerRef.current.getElementsByTagName('img');
      const imageLoadPromises = Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
      );

      // Update height after all images are loaded
      Promise.all(imageLoadPromises).then(updatePosition);

      // Cleanup
      return () => {
        Array.from(images).forEach((img) => {
          img.removeEventListener('load', updatePosition);
          img.removeEventListener('error', updatePosition);
        });
      };
    }
  }, []);

  useLayoutEffect(() => {
    updatePosition();
  }, [
    currentColumns,
    horizontalGutter,
    verticalGutter,
    sequential,
    items.map((item, index) => item.key ?? index).join(','),
  ]);

  return wrapCSSVar(
    <ResizeObserver onResize={updatePosition}>
      <div
        ref={containerRef}
        data-testid="masonry-container"
        className={mansoryCls}
        style={{ height: containerHeight }}
      >
        {items.map((item, index) => (
          <MasonryItem
            key={item.key ?? index}
            item={item}
            index={index}
            style={itemLayouts[index]}
            prefixCls={prefixCls}
          />
        ))}
      </div>
    </ResizeObserver>,
  );
};

export default Masonry;
