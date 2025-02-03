import type { CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import { resetComponent } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  /**
   * @desc 轨迹颜色
   * @descEN Line color
   */
  tailColor: string;
  /**
   * @desc 轨迹宽度
   * @descEN Line width
   */
  tailWidth: number | string;
  /**
   * @desc 节点边框宽度
   * @descEN Border width of node
   */
  dotBorderWidth: number | string;
  /**
   * @desc 节点背景色
   * @descEN Background color of node
   */
  dotBg: string;
  /**
   * @desc 时间项下间距
   * @descEN Bottom padding of item
   */
  itemPaddingBottom: number;
}

interface TimelineToken extends FullToken<'Timeline'> {
  itemHeadSize: number;
  customHeadPaddingVertical: number;
  paddingInlineEnd: number;
}

const genTimelineStyle: GenerateStyle<TimelineToken, CSSObject> = (token) => {
  const { componentCls, calc } = token;

  return {
    [componentCls]: {
      ...resetComponent(token),
      margin: 0,
      padding: 0,
      listStyle: 'none',

      [`${componentCls}-item`]: {
        position: 'relative',
        margin: 0,
        paddingBottom: token.itemPaddingBottom,
        fontSize: token.fontSize,
        listStyle: 'none',

        '&-tail': {
          position: 'absolute',
          insetBlockStart: token.itemHeadSize,
          insetInlineStart: calc(calc(token.itemHeadSize).sub(token.tailWidth)).div(2).equal(),
          height: `calc(100% - ${unit(token.itemHeadSize)})`,
          borderInlineStart: `${unit(token.tailWidth)} ${token.lineType} ${token.tailColor}`,
        },

        '&-pending': {
          [`${componentCls}-item-head`]: {
            fontSize: token.fontSizeSM,
            backgroundColor: 'transparent',
          },

          [`${componentCls}-item-tail`]: {
            display: 'none',
          },
        },

        '&-head': {
          position: 'absolute',
          width: token.itemHeadSize,
          height: token.itemHeadSize,
          backgroundColor: token.dotBg,
          border: `${unit(token.dotBorderWidth)} ${token.lineType} transparent`,
          borderRadius: '50%',

          '&-blue': {
            color: token.colorPrimary,
            borderColor: token.colorPrimary,
          },

          '&-red': {
            color: token.colorError,
            borderColor: token.colorError,
          },

          '&-green': {
            color: token.colorSuccess,
            borderColor: token.colorSuccess,
          },

          '&-gray': {
            color: token.colorTextDisabled,
            borderColor: token.colorTextDisabled,
          },
        },

        '&-head-custom': {
          position: 'absolute',
          insetBlockStart: calc(token.itemHeadSize).div(2).equal(),
          insetInlineStart: calc(token.itemHeadSize).div(2).equal(),
          backgroundColor: 'unset',
          width: 'auto',
          height: 'auto',
          marginBlockStart: 0,
          paddingBlock: token.customHeadPaddingVertical,
          lineHeight: 1,
          textAlign: 'center',
          border: 0,
          borderRadius: 0,
          transform: 'translate(-50%, -50%)',
        },

        '&-content': {
          position: 'relative',
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize))
            .mul(-1)
            .add(token.lineWidth)
            .equal(),
          marginInlineStart: calc(token.margin).add(token.itemHeadSize).equal(),
          marginInlineEnd: 0,
          marginBlockStart: 0,
          marginBlockEnd: 0,
          wordBreak: 'break-word',
        },

        '&-last': {
          [`> ${componentCls}-item-tail`]: {
            display: 'none',
          },

          [`> ${componentCls}-item-content`]: {
            minHeight: calc(token.controlHeightLG).mul(1.2).equal(),
          },
        },
      },

      [`&${componentCls}-alternate,
        &${componentCls}-right,
        &${componentCls}-label`]: {
        [`${componentCls}-item`]: {
          '&-tail, &-head, &-head-custom': {
            insetInlineStart: '50%',
          },

          '&-head': {
            marginInlineStart: calc(token.marginXXS).mul(-1).equal(),

            '&-custom': {
              marginInlineStart: calc(token.tailWidth).div(2).equal(),
            },
          },

          '&-left': {
            [`${componentCls}-item-content`]: {
              insetInlineStart: `calc(50% - ${unit(token.marginXXS)})`,
              width: `calc(50% - ${unit(token.marginSM)})`,
              textAlign: 'start',
            },
          },

          '&-right': {
            [`${componentCls}-item-content`]: {
              width: `calc(50% - ${unit(token.marginSM)})`,
              margin: 0,
              textAlign: 'end',
            },
          },
        },
      },

      [`&${componentCls}-right`]: {
        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-tail,
            ${componentCls}-item-head,
            ${componentCls}-item-head-custom`]: {
            insetInlineStart: `calc(100% - ${unit(
              calc(calc(token.itemHeadSize).add(token.tailWidth)).div(2).equal(),
            )})`,
          },

          [`${componentCls}-item-content`]: {
            width: `calc(100% - ${unit(calc(token.itemHeadSize).add(token.marginXS).equal())})`,
          },
        },
      },

      [`&${componentCls}-pending
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: 'block',
        height: `calc(100% - ${unit(token.margin)})`,
        borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
      },

      [`&${componentCls}-reverse
        ${componentCls}-item-last
        ${componentCls}-item-tail`]: {
        display: 'none',
      },

      [`&${componentCls}-reverse ${componentCls}-item-pending`]: {
        [`${componentCls}-item-tail`]: {
          insetBlockStart: token.margin,
          display: 'block',
          height: `calc(100% - ${unit(token.margin)})`,
          borderInlineStart: `${unit(token.tailWidth)} dotted ${token.tailColor}`,
        },

        [`${componentCls}-item-content`]: {
          minHeight: calc(token.controlHeightLG).mul(1.2).equal(),
        },
      },

      [`&${componentCls}-label`]: {
        [`${componentCls}-item-label`]: {
          position: 'absolute',
          insetBlockStart: calc(calc(token.fontSize).mul(token.lineHeight).sub(token.fontSize))
            .mul(-1)
            .add(token.tailWidth)
            .equal(),
          width: `calc(50% - ${unit(token.marginSM)})`,
          textAlign: 'end',
        },

        [`${componentCls}-item-right`]: {
          [`${componentCls}-item-label`]: {
            insetInlineStart: `calc(50% + ${unit(token.marginSM)})`,
            width: `calc(50% - ${unit(token.marginSM)})`,
            textAlign: 'start',
          },
        },
      },

      // ====================== RTL =======================
      '&-rtl': {
        direction: 'rtl',

        [`${componentCls}-item-head-custom`]: {
          transform: `translate(50%, -50%)`,
        },
      },
    },
  };
};

// ============================== Export ==============================
export const prepareComponentToken: GetDefaultToken<'Timeline'> = (token) => ({
  tailColor: token.colorSplit,
  tailWidth: token.lineWidthBold,
  dotBorderWidth: token.wireframe ? token.lineWidthBold : token.lineWidth * 3,
  dotBg: token.colorBgContainer,
  itemPaddingBottom: token.padding * 1.25,
});

export default genStyleHooks(
  'Timeline',
  (token) => {
    const timeLineToken = mergeToken<TimelineToken>(token, {
      itemHeadSize: 10,
      customHeadPaddingVertical: token.paddingXXS,
      paddingInlineEnd: 2,
    });

    return [genTimelineStyle(timeLineToken)];
  },
  prepareComponentToken,
);
