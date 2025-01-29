import type { CSSProperties } from 'react';
import { unit } from '@ant-design/cssinjs';

import { genFocusStyle, resetComponent, resetIcon } from '../../style';
import { genCollapseMotion } from '../../style/motion';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
  /**
   * @desc 折叠面板头部内边距
   * @descEN Padding of header
   */
  headerPadding: CSSProperties['padding'];
  /**
   * @desc 折叠面板头部背景
   * @descEN Background of header
   */
  headerBg: string;
  /**
   * @desc 折叠面板内容内边距
   * @descEN Padding of content
   */
  contentPadding: CSSProperties['padding'];
  /**
   * @desc 折叠面板内容背景
   * @descEN Background of content
   */
  contentBg: string;
}

type CollapseToken = FullToken<'Collapse'> & {
  /**
   * @desc 小号折叠面板头部内边距
   * @descEN Padding of small header
   */
  collapseHeaderPaddingSM: string;
  /**
   * @desc 大号折叠面板头部内边距
   * @descEN Padding of large header
   */
  collapseHeaderPaddingLG: string;
  /**
   * @desc 折叠面板边框圆角
   * @descEN Border radius of collapse panel
   */
  collapsePanelBorderRadius: number;
};

export const genBaseStyle: GenerateStyle<CollapseToken> = (token) => {
  const {
    componentCls,
    contentBg,
    padding,
    headerBg,
    headerPadding,
    collapseHeaderPaddingSM,
    collapseHeaderPaddingLG,
    collapsePanelBorderRadius,

    lineWidth,
    lineType,
    colorBorder,
    colorText,
    colorTextHeading,
    colorTextDisabled,
    fontSizeLG,
    lineHeight,
    lineHeightLG,
    marginSM,
    paddingSM,
    paddingLG,
    paddingXS,
    motionDurationSlow,
    fontSizeIcon,
    contentPadding,
    fontHeight,
    fontHeightLG,
  } = token;

  const borderBase = `${unit(lineWidth)} ${lineType} ${colorBorder}`;

  return {
    [componentCls]: {
      ...resetComponent(token),
      backgroundColor: headerBg,
      border: borderBase,
      borderRadius: collapsePanelBorderRadius,

      '&-rtl': {
        direction: 'rtl',
      },

      [`& > ${componentCls}-item`]: {
        borderBottom: borderBase,
        '&:first-child': {
          [`
            &,
            & > ${componentCls}-header`]: {
            borderRadius: `${unit(collapsePanelBorderRadius)} ${unit(collapsePanelBorderRadius)} 0 0`,
          },
        },

        '&:last-child': {
          [`
            &,
            & > ${componentCls}-header`]: {
            borderRadius: `0 0 ${unit(collapsePanelBorderRadius)} ${unit(
              collapsePanelBorderRadius,
            )}`,
          },
        },

        [`> ${componentCls}-header`]: {
          position: 'relative', // Compatible with old version of antd, should remove in next version
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          padding: headerPadding,
          color: colorTextHeading,
          lineHeight,
          cursor: 'pointer',
          transition: `all ${motionDurationSlow}, visibility 0s`,
          ...genFocusStyle(token),

          [`> ${componentCls}-header-text`]: {
            flex: 'auto',
          },

          // >>>>> Arrow
          [`${componentCls}-expand-icon`]: {
            height: fontHeight,
            display: 'flex',
            alignItems: 'center',
            paddingInlineEnd: marginSM,
          },

          [`${componentCls}-arrow`]: {
            ...resetIcon(),
            fontSize: fontSizeIcon,
            // when `transform: rotate()` is applied to icon's root element
            transition: `transform ${motionDurationSlow}`,
            // when `transform: rotate()` is applied to icon's child element
            svg: {
              transition: `transform ${motionDurationSlow}`,
            },
          },

          // >>>>> Text
          [`${componentCls}-header-text`]: {
            marginInlineEnd: 'auto',
          },
        },

        [`${componentCls}-collapsible-header`]: {
          cursor: 'default',
          [`${componentCls}-header-text`]: {
            flex: 'none',
            cursor: 'pointer',
          },
        },

        [`${componentCls}-collapsible-icon`]: {
          cursor: 'unset',

          [`${componentCls}-expand-icon`]: {
            cursor: 'pointer',
          },
        },
      },

      [`${componentCls}-content`]: {
        color: colorText,
        backgroundColor: contentBg,
        borderTop: borderBase,

        [`& > ${componentCls}-content-box`]: {
          padding: contentPadding,
        },

        '&-hidden': {
          display: 'none',
        },
      },

      '&-small': {
        [`> ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            padding: collapseHeaderPaddingSM,
            paddingInlineStart: paddingXS,

            [`> ${componentCls}-expand-icon`]: {
              // Arrow offset
              marginInlineStart: token.calc(paddingSM).sub(paddingXS).equal(),
            },
          },
          [`> ${componentCls}-content > ${componentCls}-content-box`]: {
            padding: paddingSM,
          },
        },
      },

      '&-large': {
        [`> ${componentCls}-item`]: {
          fontSize: fontSizeLG,
          lineHeight: lineHeightLG,
          [`> ${componentCls}-header`]: {
            padding: collapseHeaderPaddingLG,
            paddingInlineStart: padding,

            [`> ${componentCls}-expand-icon`]: {
              height: fontHeightLG,
              // Arrow offset
              marginInlineStart: token.calc(paddingLG).sub(padding).equal(),
            },
          },
          [`> ${componentCls}-content > ${componentCls}-content-box`]: {
            padding: paddingLG,
          },
        },
      },

      [`${componentCls}-item:last-child`]: {
        borderBottom: 0,

        [`> ${componentCls}-content`]: {
          borderRadius: `0 0 ${unit(collapsePanelBorderRadius)} ${unit(collapsePanelBorderRadius)}`,
        },
      },

      [`& ${componentCls}-item-disabled > ${componentCls}-header`]: {
        [`
          &,
          & > .arrow
        `]: {
          color: colorTextDisabled,
          cursor: 'not-allowed',
        },
      },

      // ========================== Icon Position ==========================
      [`&${componentCls}-icon-position-end`]: {
        [`& > ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            [`${componentCls}-expand-icon`]: {
              order: 1,
              paddingInlineEnd: 0,
              paddingInlineStart: marginSM,
            },
          },
        },
      },
      [`&${componentCls}-icon-vertical-position-center`]: {
        [`& > ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            [`${componentCls}-expand-icon`]: {
              alignSelf: 'center',
            },
          },
        },
      },
      [`&${componentCls}-icon-vertical-position-end`]: {
        [`& > ${componentCls}-item`]: {
          [`> ${componentCls}-header`]: {
            [`${componentCls}-expand-icon`]: {
              alignSelf: 'end',
            },
          },
        },
      },
    },
  };
};

const genArrowStyle: GenerateStyle<CollapseToken> = (token) => {
  const { componentCls } = token;

  const fixedSelector = `> ${componentCls}-item > ${componentCls}-header ${componentCls}-arrow`;

  return {
    [`${componentCls}-rtl`]: {
      [fixedSelector]: {
        transform: `rotate(180deg)`,
      },
    },
  };
};

const genBorderlessStyle: GenerateStyle<CollapseToken> = (token) => {
  const {
    componentCls,
    headerBg,
    paddingXXS,

    colorBorder,
  } = token;

  return {
    [`${componentCls}-borderless`]: {
      backgroundColor: headerBg,
      border: 0,

      [`> ${componentCls}-item`]: {
        borderBottom: `1px solid ${colorBorder}`,
      },

      [`
        > ${componentCls}-item:last-child,
        > ${componentCls}-item:last-child ${componentCls}-header
      `]: {
        borderRadius: 0,
      },

      [`> ${componentCls}-item:last-child`]: {
        borderBottom: 0,
      },

      [`> ${componentCls}-item > ${componentCls}-content`]: {
        backgroundColor: 'transparent',
        borderTop: 0,
      },

      [`> ${componentCls}-item > ${componentCls}-content > ${componentCls}-content-box`]: {
        paddingTop: paddingXXS,
      },
    },
  };
};

const genGhostStyle: GenerateStyle<CollapseToken> = (token) => {
  const { componentCls, paddingSM } = token;

  return {
    [`${componentCls}-ghost`]: {
      backgroundColor: 'transparent',
      border: 0,
      [`> ${componentCls}-item`]: {
        borderBottom: 0,
        [`> ${componentCls}-content`]: {
          backgroundColor: 'transparent',
          border: 0,
          [`> ${componentCls}-content-box`]: {
            paddingBlock: paddingSM,
          },
        },
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Collapse'> = (token) => ({
  headerPadding: `${token.paddingSM}px ${token.padding}px`,
  headerBg: token.colorFillAlter,
  contentPadding: `${token.padding}px 16px`, // Fixed Value
  contentBg: token.colorBgContainer,
});

export default genStyleHooks(
  'Collapse',
  (token) => {
    const collapseToken = mergeToken<CollapseToken>(token, {
      collapseHeaderPaddingSM: `${unit(token.paddingXS)} ${unit(token.paddingSM)}`,
      collapseHeaderPaddingLG: `${unit(token.padding)} ${unit(token.paddingLG)}`,
      collapsePanelBorderRadius: token.borderRadiusLG,
    });

    return [
      genBaseStyle(collapseToken),
      genBorderlessStyle(collapseToken),
      genGhostStyle(collapseToken),
      genArrowStyle(collapseToken),
      genCollapseMotion(collapseToken),
    ];
  },
  prepareComponentToken,
);
