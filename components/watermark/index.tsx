import React, { useEffect } from 'react';
import { useMutateObserver } from '@rc-component/mutate-observer';
import classNames from 'classnames';
import useEvent from 'rc-util/lib/hooks/useEvent';

import toList from '../_util/toList';
import { useToken } from '../theme/internal';
import WatermarkContext from './context';
import type { WatermarkContextProps } from './context';
import useClips, { FontGap } from './useClips';
import useRafDebounce from './useRafDebounce';
import useWatermark from './useWatermark';
import { getPixelRatio, reRendering } from './utils';

export interface WatermarkProps {
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  content?: string | string[];
  font?: {
    color?: CanvasFillStrokeStyles['fillStyle'];
    fontSize?: number | string;
    fontWeight?: 'normal' | 'light' | 'weight' | number;
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique';
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
  };
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  gap?: [number, number];
  offset?: [number, number];
  children?: React.ReactNode;
  inherit?: boolean;
}

/**
 * Only return `next` when size changed.
 * This is only used for elements compare, not a shallow equal!
 */
function getSizeDiff<T>(prev: Set<T>, next: Set<T>) {
  return prev.size === next.size ? prev : next;
}

const DEFAULT_GAP_X = 100;
const DEFAULT_GAP_Y = 100;

const fixedStyle: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

const Watermark: React.FC<WatermarkProps> = (props) => {
  const {
    /**
     * The antd content layer zIndex is basically below 10
     * https://github.com/ant-design/ant-design/blob/6192403b2ce517c017f9e58a32d58774921c10cd/components/style/themes/default.less#L335
     */
    zIndex = 9,
    rotate = -22,
    width,
    height,
    image,
    content,
    font = {},
    style,
    className,
    rootClassName,
    gap = [DEFAULT_GAP_X, DEFAULT_GAP_Y],
    offset,
    children,
    inherit = true,
  } = props;

  const mergedStyle = {
    ...fixedStyle,
    ...style,
  };

  const [, token] = useToken();
  const {
    color = token.colorFill,
    fontSize = token.fontSizeLG,
    fontWeight = 'normal',
    fontStyle = 'normal',
    fontFamily = 'sans-serif',
    textAlign = 'center',
  } = font;

  const [gapX = DEFAULT_GAP_X, gapY = DEFAULT_GAP_Y] = gap;
  const gapXCenter = gapX / 2;
  const gapYCenter = gapY / 2;
  const offsetLeft = offset?.[0] ?? gapXCenter;
  const offsetTop = offset?.[1] ?? gapYCenter;

  const markStyle = React.useMemo(() => {
    const mergedMarkStyle: React.CSSProperties = {
      zIndex,
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundRepeat: 'repeat',
    };

    /** Calculate the style of the offset */
    let positionLeft = offsetLeft - gapXCenter;
    let positionTop = offsetTop - gapYCenter;
    if (positionLeft > 0) {
      mergedMarkStyle.left = `${positionLeft}px`;
      mergedMarkStyle.width = `calc(100% - ${positionLeft}px)`;
      positionLeft = 0;
    }
    if (positionTop > 0) {
      mergedMarkStyle.top = `${positionTop}px`;
      mergedMarkStyle.height = `calc(100% - ${positionTop}px)`;
      positionTop = 0;
    }
    mergedMarkStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

    return mergedMarkStyle;
  }, [zIndex, offsetLeft, gapXCenter, offsetTop, gapYCenter]);

  const [container, setContainer] = React.useState<HTMLDivElement | null>();

  // Used for nest case like Modal, Drawer
  const [subElements, setSubElements] = React.useState(new Set<HTMLElement>());

  // Nest elements should also support watermark
  const targetElements = React.useMemo(() => {
    const list = container ? [container] : [];
    return [...list, ...Array.from(subElements)];
  }, [container, subElements]);

  // ============================ Content =============================
  /**
   * Get the width and height of the watermark. The default values are as follows
   * Image: [120, 64]; Content: It's calculated by content;
   */
  const getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = 120;
    let defaultHeight = 64;
    if (!image && ctx.measureText) {
      ctx.font = `${Number(fontSize)}px ${fontFamily}`;
      const contents = toList(content);
      const sizes = contents.map((item) => {
        const metrics = ctx.measureText(item!);

        return [metrics.width, metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent];
      });
      defaultWidth = Math.ceil(Math.max(...sizes.map((size) => size[0])));
      defaultHeight =
        Math.ceil(Math.max(...sizes.map((size) => size[1]))) * contents.length +
        (contents.length - 1) * FontGap;
    }
    return [width ?? defaultWidth, height ?? defaultHeight] as const;
  };

  const getClips = useClips();

  const [watermarkInfo, setWatermarkInfo] = React.useState<[base64: string, contentWidth: number]>(
    null!,
  );

  // Generate new Watermark content
  const renderWatermark = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const ratio = getPixelRatio();
      const [markWidth, markHeight] = getMarkSize(ctx);

      const drawCanvas = (
        drawContent?: NonNullable<WatermarkProps['content']> | HTMLImageElement,
      ) => {
        const [nextClips, clipWidth] = getClips(
          drawContent || '',
          rotate,
          ratio,
          markWidth,
          markHeight,
          {
            color,
            fontSize,
            fontStyle,
            fontWeight,
            fontFamily,
            textAlign,
          },
          gapX,
          gapY,
        );

        setWatermarkInfo([nextClips, clipWidth]);
      };

      if (image) {
        const img = new Image();
        img.onload = () => {
          drawCanvas(img);
        };
        img.onerror = () => {
          drawCanvas(content);
        };
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = image;
      } else {
        drawCanvas(content);
      }
    }
  };

  const syncWatermark = useRafDebounce(renderWatermark);

  // ============================= Effect =============================
  // Append watermark to the container
  const [appendWatermark, removeWatermark, isWatermarkEle] = useWatermark(markStyle);

  useEffect(() => {
    if (watermarkInfo) {
      targetElements.forEach((holder) => {
        appendWatermark(watermarkInfo[0], watermarkInfo[1], holder);
      });
    }
    // The useEffect must listen to watermarkInfo because watermarkInfo is reassigned whenever the DOM changes, ensuring that the DOM cannot be deleted.
  }, [watermarkInfo, targetElements]);

  // ============================ Observe =============================
  const onMutate = useEvent((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (reRendering(mutation, isWatermarkEle)) {
        syncWatermark();
      } else if (mutation.target === container && mutation.attributeName === 'style') {
        // We've only force container not modify.
        // Not consider nest case.
        const keyStyles = Object.keys(fixedStyle);

        for (let i = 0; i < keyStyles.length; i += 1) {
          const key = keyStyles[i];
          const oriValue = (mergedStyle as any)[key];
          const currentValue = (container.style as any)[key];

          if (oriValue && oriValue !== currentValue) {
            (container.style as any)[key] = oriValue;
          }
        }
      }
    });
  });

  useMutateObserver(targetElements, onMutate);

  useEffect(syncWatermark, [
    rotate,
    zIndex,
    width,
    height,
    image,
    content,
    color,
    fontSize,
    fontWeight,
    fontStyle,
    fontFamily,
    textAlign,
    gapX,
    gapY,
    offsetLeft,
    offsetTop,
  ]);

  // ============================ Context =============================
  const watermarkContext = React.useMemo<WatermarkContextProps>(
    () => ({
      add: (ele) => {
        setSubElements((prev) => {
          const clone = new Set(prev);
          clone.add(ele);
          return getSizeDiff(prev, clone);
        });
      },
      remove: (ele) => {
        removeWatermark(ele);

        setSubElements((prev) => {
          const clone = new Set(prev);
          clone.delete(ele);

          return getSizeDiff(prev, clone);
        });
      },
    }),
    [],
  );

  // ============================= Render =============================
  const childNode = inherit ? (
    <WatermarkContext.Provider value={watermarkContext}>{children}</WatermarkContext.Provider>
  ) : (
    children
  );

  return (
    <div ref={setContainer} className={classNames(className, rootClassName)} style={mergedStyle}>
      {childNode}
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Watermark.displayName = 'Watermark';
}

export default Watermark;
