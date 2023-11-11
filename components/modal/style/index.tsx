import type React from 'react';

import { genFocusStyle, resetComponent } from '../../style';
import { initFadeMotion, initZoomMotion } from '../../style/motion';
import type { GlobalToken } from '../../theme';
import type { AliasToken, FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import type { GenStyleFn, TokenWithCommonCls } from '../../theme/util/genComponentStyleHook';
import { unit } from '@ant-design/cssinjs';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
  /**
   * @desc 顶部背景色
   * @descEN Background color of header
   */
  headerBg: string;
  /**
   * @desc 标题行高
   * @descEN Line height of title
   */
  titleLineHeight: number;
  /**
   * @desc 标题字体大小
   * @descEN Font size of title
   */
  titleFontSize: number;
  /**
   * @desc 标题字体颜色
   * @descEN Font color of title
   */
  titleColor: string;
  /**
   * @desc 内容区域背景色
   * @descEN Background color of content
   */
  contentBg: string;
  /**
   * @desc 底部区域背景色
   * @descEN Background color of footer
   */
  footerBg: string;
}

export interface ModalToken extends FullToken<'Modal'> {
  // Custom token here
  modalHeaderHeight: number | string;
  modalBodyPadding: number;
  modalHeaderPadding: string;
  modalHeaderBorderWidth: number;
  modalHeaderBorderStyle: string;
  modalHeaderBorderColorSplit: string;
  modalFooterBorderColorSplit: string;
  modalFooterBorderStyle: string;
  modalFooterPaddingVertical: number;
  modalFooterPaddingHorizontal: number;
  modalFooterBorderWidth: number;
  modalIconHoverColor: string;
  modalCloseIconColor: string;
  modalCloseBtnSize: number | string;
  modalConfirmIconSize: number | string;
  modalTitleHeight: number | string;
  modalContentHeight: number | string;
  /**
   * @desc 标题高度
   * @descEN Height of title
   */
  titleHeight: number;
  /**
   * @desc 内容区域高度
   * @descEN Height of content
   */
  contentHeight: number;
}

function box(position: React.CSSProperties['position']): React.CSSProperties {
  return {
    position,
    inset: 0,
  };
}

export const genModalMaskStyle: GenerateStyle<TokenWithCommonCls<AliasToken>> = (token) => {
  const { componentCls, antCls } = token;

  return [
    {
      [`${componentCls}-root`]: {
        [`${componentCls}${antCls}-zoom-enter, ${componentCls}${antCls}-zoom-appear`]: {
          // reset scale avoid mousePosition bug
          transform: 'none',
          opacity: 0,
          animationDuration: token.motionDurationSlow,
          // https://github.com/ant-design/ant-design/issues/11777
          userSelect: 'none',
        },

        // https://github.com/ant-design/ant-design/issues/37329
        // https://github.com/ant-design/ant-design/issues/40272
        [`${componentCls}${antCls}-zoom-leave ${componentCls}-content`]: {
          pointerEvents: 'none',
        },

        [`${componentCls}-mask`]: {
          ...box('fixed'),
          zIndex: token.zIndexPopupBase,
          height: '100%',
          backgroundColor: token.colorBgMask,
          pointerEvents: 'none',

          [`${componentCls}-hidden`]: {
            display: 'none',
          },
        },

        [`${componentCls}-wrap`]: {
          ...box('fixed'),
          zIndex: token.zIndexPopupBase,
          overflow: 'auto',
          outline: 0,
          WebkitOverflowScrolling: 'touch',

          // Note: Firefox not support `:has` yet
          [`&:has(${componentCls}${antCls}-zoom-enter), &:has(${componentCls}${antCls}-zoom-appear)`]:
            {
              pointerEvents: 'none',
            },
        },
      },
    },
    { [`${componentCls}-root`]: initFadeMotion(token) },
  ];
};

const genModalStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls } = token;

  return [
    // ======================== Root =========================
    {
      [`${componentCls}-root`]: {
        [`${componentCls}-wrap-rtl`]: {
          direction: 'rtl',
        },

        [`${componentCls}-centered`]: {
          textAlign: 'center',

          '&::before': {
            display: 'inline-block',
            width: 0,
            height: '100%',
            verticalAlign: 'middle',
            content: '""',
          },
          [componentCls]: {
            top: 0,
            display: 'inline-block',
            paddingBottom: 0,
            textAlign: 'start',
            verticalAlign: 'middle',
          },
        },

        [`@media (max-width: ${token.screenSMMax})`]: {
          [componentCls]: {
            maxWidth: 'calc(100vw - 16px)',
            margin: `${unit(token.marginXS)} auto`,
          },
          [`${componentCls}-centered`]: {
            [componentCls]: {
              flex: 1,
            },
          },
        },
      },
    },

    // ======================== Modal ========================
    {
      [componentCls]: {
        ...resetComponent(token),
        pointerEvents: 'none',
        position: 'relative',
        top: 100,
        width: 'auto',
        maxWidth: `calc(100vw - ${unit(token.calc(token.margin).mul(2).equal())})`,
        margin: '0 auto',
        paddingBottom: token.paddingLG,

        [`${componentCls}-title`]: {
          margin: 0,
          color: token.titleColor,
          fontWeight: token.fontWeightStrong,
          fontSize: token.titleFontSize,
          lineHeight: token.titleLineHeight,
          wordWrap: 'break-word',
        },

        [`${componentCls}-content`]: {
          position: 'relative',
          backgroundColor: token.contentBg,
          backgroundClip: 'padding-box',
          border: 0,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadow,
          pointerEvents: 'auto',
          padding: `${unit(token.paddingMD)} ${unit(token.paddingContentHorizontalLG)}`,
        },

        [`${componentCls}-close`]: {
          position: 'absolute',
          top: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
          insetInlineEnd: token
            .calc(token.modalHeaderHeight)
            .sub(token.modalCloseBtnSize)
            .div(2)
            .equal(),
          zIndex: token.calc(token.zIndexPopupBase).add(10).equal(),
          padding: 0,
          color: token.modalCloseIconColor,
          fontWeight: token.fontWeightStrong,
          lineHeight: 1,
          textDecoration: 'none',
          background: 'transparent',
          borderRadius: token.borderRadiusSM,
          width: token.modalCloseBtnSize,
          height: token.modalCloseBtnSize,
          border: 0,
          outline: 0,
          cursor: 'pointer',
          transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,

          '&-x': {
            display: 'flex',
            fontSize: token.fontSizeLG,
            fontStyle: 'normal',
            lineHeight: `${unit(token.modalCloseBtnSize)}`,
            justifyContent: 'center',
            textTransform: 'none',
            textRendering: 'auto',
          },

          '&:hover': {
            color: token.modalIconHoverColor,
            backgroundColor: token.wireframe ? 'transparent' : token.colorFillContent,
            textDecoration: 'none',
          },

          '&:active': {
            backgroundColor: token.wireframe ? 'transparent' : token.colorFillContentHover,
          },

          ...genFocusStyle(token),
        },

        [`${componentCls}-header`]: {
          color: token.colorText,
          background: token.headerBg,
          borderRadius: `${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)} 0 0`,
          marginBottom: token.marginXS,
        },

        [`${componentCls}-body`]: {
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
          wordWrap: 'break-word',
        },

        [`${componentCls}-footer`]: {
          textAlign: 'end',
          background: token.footerBg,
          marginTop: token.marginSM,

          [`${token.antCls}-btn + ${token.antCls}-btn:not(${token.antCls}-dropdown-trigger)`]: {
            marginBottom: 0,
            marginInlineStart: token.marginXS,
          },
        },

        [`${componentCls}-open`]: {
          overflow: 'hidden',
        },
      },
    },

    // ======================== Pure =========================
    {
      [`${componentCls}-pure-panel`]: {
        top: 'auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',

        [`${componentCls}-content,
          ${componentCls}-body,
          ${componentCls}-confirm-body-wrapper`]: {
          display: 'flex',
          flexDirection: 'column',
          flex: 'auto',
        },

        [`${componentCls}-confirm-body`]: {
          marginBottom: 'auto',
        },
      },
    },
  ];
};

const genWireframeStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls, antCls } = token;
  const confirmComponentCls = `${componentCls}-confirm`;

  return {
    [componentCls]: {
      [`${componentCls}-content`]: {
        padding: 0,
      },

      [`${componentCls}-header`]: {
        padding: token.modalHeaderPadding,
        borderBottom: `${unit(token.modalHeaderBorderWidth)} ${token.modalHeaderBorderStyle} ${
          token.modalHeaderBorderColorSplit
        }`,
        marginBottom: 0,
      },

      [`${componentCls}-body`]: {
        padding: token.modalBodyPadding,
      },

      [`${componentCls}-footer`]: {
        padding: `${unit(token.modalFooterPaddingVertical)} ${unit(
          token.modalFooterPaddingHorizontal,
        )}`,
        borderTop: `${unit(token.modalFooterBorderWidth)} ${token.modalFooterBorderStyle} ${
          token.modalFooterBorderColorSplit
        }`,
        borderRadius: `0 0 ${unit(token.borderRadiusLG)} ${unit(token.borderRadiusLG)}`,
        marginTop: 0,
      },
    },

    [confirmComponentCls]: {
      [`${antCls}-modal-body`]: {
        padding: `${unit(token.calc(token.padding).mul(2).equal())} ${unit(
          token.calc(token.padding).mul(2).equal(),
        )} ${unit(token.paddingLG)}`,
      },
      [`${confirmComponentCls}-body > ${token.iconCls}`]: {
        marginInlineEnd: token.margin,
      },
      [`${confirmComponentCls}-btns`]: {
        marginTop: token.marginLG,
      },
    },
  };
};

const genRTLStyle: GenerateStyle<ModalToken> = (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-root`]: {
      [`${componentCls}-wrap-rtl`]: {
        direction: 'rtl',

        [`${componentCls}-confirm-body`]: {
          direction: 'rtl',
        },
      },
    },
  };
};

// ============================== Export ==============================
export const prepareToken: (token: Parameters<GenStyleFn<'Modal'>>[0]) => ModalToken = (token) => {
  const headerPaddingVertical = token.padding;
  const headerFontSize = token.fontSizeHeading5;
  const headerLineHeight = token.lineHeightHeading5;

  const modalToken = mergeToken<ModalToken>(token, {
    modalBodyPadding: token.paddingLG,
    modalHeaderPadding: `${unit(headerPaddingVertical)} ${unit(token.paddingLG)}`,
    modalHeaderBorderWidth: token.lineWidth,
    modalHeaderBorderStyle: token.lineType,
    modalHeaderBorderColorSplit: token.colorSplit,
    modalHeaderHeight: token
      .calc(headerLineHeight)
      .mul(headerFontSize)
      .add(token.calc(headerPaddingVertical).mul(2))
      .equal(),
    modalFooterBorderColorSplit: token.colorSplit,
    modalFooterBorderStyle: token.lineType,
    modalFooterPaddingVertical: token.paddingXS,
    modalFooterPaddingHorizontal: token.padding,
    modalFooterBorderWidth: token.lineWidth,
    modalIconHoverColor: token.colorIconHover,
    modalCloseIconColor: token.colorIcon,
    modalCloseBtnSize: token.calc(token.fontSize).mul(token.lineHeight).equal(),
    modalConfirmIconSize: token.calc(token.fontSize).mul(token.lineHeight).equal(),
  });

  return modalToken;
};

export const prepareComponentToken = (token: GlobalToken) => ({
  footerBg: 'transparent',
  headerBg: token.colorBgElevated,
  titleLineHeight: token.lineHeightHeading5,
  titleFontSize: token.fontSizeHeading5,
  contentBg: token.colorBgElevated,
  titleColor: token.colorTextHeading,
  titleHeight: Math.round(token.fontSizeHeading5 * token.lineHeightHeading5),
  contentHeight: Math.round(token.fontSize * token.lineHeight),
});

export default genComponentStyleHook(
  'Modal',
  (token) => {
    const modalToken = prepareToken(token);

    return [
      genModalStyle(modalToken),
      genRTLStyle(modalToken),
      genModalMaskStyle(modalToken),
      token.wireframe && genWireframeStyle(modalToken),
      initZoomMotion(modalToken, 'zoom'),
    ];
  },
  prepareComponentToken,
);
