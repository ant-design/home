import { unit } from '@ant-design/cssinjs';

import { resetComponent } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  /**
   * @desc 指示点宽度
   * @descEN Width of indicator
   */
  dotWidth: number;
  /**
   * @desc 指示点高度
   * @descEN Height of indicator
   */
  dotHeight: number;
  /**
   * @desc 指示点之间的间距
   * @descEN margin of indicator
   */
  dotMargin: number;
  /**
   * @desc 指示点距离边缘的距离
   * @descEN dot offset to Carousel edge
   */
  dotOffset: number;
  /** @deprecated Use `dotActiveWidth` instead. */
  dotWidthActive: number;
  /**
   * @desc 激活态指示点宽度
   * @descEN Width of active indicator
   */
  dotActiveWidth: number;
  /**
   * @desc 切换箭头大小
   * @descEN Size of arrows
   */
  arrowSize: number;
  /**
   * @desc 切换箭头边距
   * @descEN arrows offset to Carousel edge
   */
  arrowOffset: number;
}

interface CarouselToken extends FullToken<'Carousel'> {}

const genCarouselStyle: GenerateStyle<CarouselToken> = (token) => {
  const { componentCls, antCls } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),

      '.slick-slider': {
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',
        touchAction: 'pan-y',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',

        '.slick-track, .slick-list': {
          transform: 'translate3d(0, 0, 0)',
          touchAction: 'pan-y',
        },
      },

      '.slick-list': {
        position: 'relative',
        display: 'block',
        margin: 0,
        padding: 0,
        overflow: 'hidden',

        '&:focus': {
          outline: 'none',
        },

        '&.dragging': {
          cursor: 'pointer',
        },

        '.slick-slide': {
          pointerEvents: 'none',

          // https://github.com/ant-design/ant-design/issues/23294
          [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
            visibility: 'hidden',
          },

          '&.slick-active': {
            pointerEvents: 'auto',

            [`input${antCls}-radio-input, input${antCls}-checkbox-input`]: {
              visibility: 'visible',
            },
          },

          // fix Carousel content height not match parent node
          // when children is empty node
          // https://github.com/ant-design/ant-design/issues/25878
          '> div > div': {
            verticalAlign: 'bottom',
          },
        },
      },

      '.slick-track': {
        position: 'relative',
        top: 0,
        insetInlineStart: 0,
        display: 'block',

        '&::before, &::after': {
          display: 'table',
          content: '""',
        },

        '&::after': {
          clear: 'both',
        },
      },

      '.slick-slide': {
        display: 'none',
        float: 'left',
        height: '100%',
        minHeight: 1,

        img: {
          display: 'block',
        },

        '&.dragging img': {
          pointerEvents: 'none',
        },
      },

      '.slick-initialized .slick-slide': {
        display: 'block',
      },

      '.slick-vertical .slick-slide': {
        display: 'block',
        height: 'auto',
      },
    },
  };
};

const genCarouselVerticalStyle: GenerateStyle<CarouselToken> = (token) => {
  const { componentCls, dotOffset, marginXXS } = token;

  const reverseSizeOfDot = {
    width: token.dotHeight,
    height: token.dotWidth,
  };

  return {
    [`${componentCls}-vertical`]: {
      '.slick-dots': {
        top: '50%',
        bottom: 'auto',
        flexDirection: 'column',
        width: token.dotHeight,
        height: 'auto',
        margin: 0,
        transform: 'translateY(-50%)',

        '&-left': {
          insetInlineEnd: 'auto',
          insetInlineStart: dotOffset,
        },

        '&-right': {
          insetInlineEnd: dotOffset,
          insetInlineStart: 'auto',
        },

        li: {
          // reverse width and height in vertical situation
          ...reverseSizeOfDot,
          margin: `${unit(marginXXS)} 0`,
          verticalAlign: 'baseline',

          button: reverseSizeOfDot,

          '&.slick-active': {
            ...reverseSizeOfDot,

            button: reverseSizeOfDot,
          },
        },
      },
    },
  };
};

const genCarouselRtlStyle: GenerateStyle<CarouselToken> = (token) => {
  const { componentCls } = token;

  return [
    {
      [`${componentCls}-rtl`]: {
        direction: 'rtl',

        // Dots
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'row-reverse',
          },
        },
      },
    },
    {
      [`${componentCls}-vertical`]: {
        '.slick-dots': {
          [`${componentCls}-rtl&`]: {
            flexDirection: 'column',
          },
        },
      },
    },
  ];
};

const genArrowsStyle: GenerateStyle<CarouselToken> = (token) => {
  const { componentCls, motionDurationSlow, arrowSize, arrowOffset } = token;

  return [
    {
      [componentCls]: {
        // Arrows
        '.slick-prev, .slick-next': {
          position: 'absolute',
          top: '50%',
          width: arrowSize,
          height: arrowSize,
          fontSize: arrowSize,
          transform: 'translateY(-50%)',
          color: '#fff',
          opacity: 0.5,
          background: 'transparent',
          padding: 0,
          lineHeight: 0,
          border: 0,
          outline: 'none',
          cursor: 'pointer',
          zIndex: 1,
          transition: `opacity ${motionDurationSlow}`,

          '&:hover, &:focus': {
            opacity: 1,
          },

          '&.slick-disabled:': {
            pointerEvents: 'none',
            visibility: 'hidden',
          },
        },

        '.slick-prev': {
          insetInlineStart: arrowOffset,

          '&::before': {
            content: '"←"',
          },
        },

        '.slick-next': {
          insetInlineEnd: arrowOffset,

          '&::before': {
            content: '"→"',
          },
        },
      },
    },
  ];
};

const genDostStyle: GenerateStyle<CarouselToken> = (token) => {
  const {
    componentCls,
    dotOffset,
    dotWidth,
    dotHeight,
    dotMargin,
    colorBgContainer,
    motionDurationSlow,
  } = token;
  return [
    {
      [componentCls]: {
        '.slick-dots': {
          position: 'absolute',
          insetInlineEnd: 0,
          bottom: 0,
          insetInlineStart: 0,
          zIndex: 15,
          display: 'flex !important',
          justifyContent: 'center',
          paddingInlineStart: 0,
          margin: 0,
          listStyle: 'none',

          '&-bottom': {
            bottom: dotOffset,
          },

          '&-top': {
            top: dotOffset,
            bottom: 'auto',
          },

          li: {
            position: 'relative',
            display: 'inline-block',
            flex: '0 1 auto',
            boxSizing: 'content-box',
            width: dotWidth,
            height: dotHeight,
            marginInline: dotMargin,
            padding: 0,
            textAlign: 'center',
            textIndent: -999,
            verticalAlign: 'top',
            transition: `all ${motionDurationSlow}`,

            button: {
              position: 'relative',
              display: 'block',
              width: '100%',
              height: dotHeight,
              padding: 0,
              color: 'transparent',
              fontSize: 0,
              background: colorBgContainer,
              border: 0,
              borderRadius: dotHeight,
              outline: 'none',
              cursor: 'pointer',
              opacity: 0.3,
              transition: `all ${motionDurationSlow}`,

              '&: hover, &:focus': {
                opacity: 0.75,
              },

              '&::after': {
                position: 'absolute',
                inset: token.calc(dotMargin).mul(-1).equal(),
                content: '""',
              },
            },

            '&.slick-active': {
              width: token.dotActiveWidth,

              '& button': {
                background: colorBgContainer,
                opacity: 1,
              },

              '&: hover, &:focus': {
                opacity: 1,
              },
            },
          },
        },
      },
    },
  ];
};

export const prepareComponentToken: GetDefaultToken<'Carousel'> = (token) => {
  const dotActiveWidth = 24;

  return {
    arrowSize: 20,
    arrowOffset: token.paddingXS,
    dotWidth: 16,
    dotHeight: 3,
    dotMargin: token.marginXXS,
    dotOffset: 12,
    dotWidthActive: dotActiveWidth,
    dotActiveWidth,
  };
};

// ============================== Export ==============================
export default genStyleHooks(
  'Carousel',
  (token) => [
    genCarouselStyle(token),
    genCarouselVerticalStyle(token),
    genCarouselRtlStyle(token),
    genArrowsStyle(token),
    genDostStyle(token),
  ],
  prepareComponentToken,
  {
    deprecatedTokens: [['dotWidthActive', 'dotActiveWidth']],
  },
);
