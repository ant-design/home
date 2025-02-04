import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import { genFocusStyle, resetIcon } from '../../style';
import { PresetColors } from '../../theme/interface';
import type { GenerateStyle, PresetColorKey } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';
import type { ButtonVariantType } from '../buttonHelpers';
import genGroupStyle from './group';
import type { ButtonToken, ComponentToken } from './token';
import { prepareComponentToken, prepareToken } from './token';

export type { ComponentToken };

// ============================== Shared ==============================
const genSharedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token): CSSObject => {
  const {
    componentCls,
    iconCls,
    fontWeight,
    opacityLoading,
    motionDurationSlow,
    motionEaseInOut,
    marginXS,
    calc,
  } = token;

  return {
    [componentCls]: {
      outline: 'none',
      position: 'relative',
      display: 'inline-flex',
      gap: token.marginXS,
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      backgroundImage: 'none',
      background: 'transparent',
      border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
      cursor: 'pointer',
      transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      userSelect: 'none',
      touchAction: 'manipulation',
      color: token.colorText,

      '&:disabled > *': {
        pointerEvents: 'none',
      },

      // https://github.com/ant-design/ant-design/issues/51380
      [`${componentCls}-icon > svg`]: resetIcon(),

      '> a': {
        color: 'currentColor',
      },

      '&:not(:disabled)': genFocusStyle(token),

      [`&${componentCls}-two-chinese-chars::first-letter`]: {
        letterSpacing: '0.34em',
      },

      [`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
        marginInlineEnd: '-0.34em',
        letterSpacing: '0.34em',
      },

      [`&${componentCls}-icon-only`]: {
        paddingInline: 0,

        // make `btn-icon-only` not too narrow
        [`&${componentCls}-compact-item`]: {
          flex: 'none',
        },

        [`&${componentCls}-round`]: {
          width: 'auto',
        },
      },

      // Loading
      [`&${componentCls}-loading`]: {
        opacity: opacityLoading,
        cursor: 'default',
      },

      [`${componentCls}-loading-icon`]: {
        transition: ['width', 'opacity', 'margin']
          .map((transition) => `${transition} ${motionDurationSlow} ${motionEaseInOut}`)
          .join(','),
      },

      // iconPosition
      [`&:not(${componentCls}-icon-end)`]: {
        [`${componentCls}-loading-icon-motion`]: {
          '&-appear-start, &-enter-start': {
            marginInlineEnd: calc(marginXS).mul(-1).equal(),
          },
          '&-appear-active, &-enter-active': {
            marginInlineEnd: 0,
          },
          '&-leave-start': {
            marginInlineEnd: 0,
          },
          '&-leave-active': {
            marginInlineEnd: calc(marginXS).mul(-1).equal(),
          },
        },
      },

      '&-icon-end': {
        flexDirection: 'row-reverse',

        [`${componentCls}-loading-icon-motion`]: {
          '&-appear-start, &-enter-start': {
            marginInlineStart: calc(marginXS).mul(-1).equal(),
          },
          '&-appear-active, &-enter-active': {
            marginInlineStart: 0,
          },
          '&-leave-start': {
            marginInlineStart: 0,
          },
          '&-leave-active': {
            marginInlineStart: calc(marginXS).mul(-1).equal(),
          },
        },
      },
    },
  };
};

const genHoverActiveButtonStyle = (
  btnCls: string,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
): CSSObject => ({
  [`&:not(:disabled):not(${btnCls}-disabled)`]: {
    '&:hover': hoverStyle,
    '&:active': activeStyle,
  },
});

// ============================== Shape ===============================
const genCircleButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  minWidth: token.controlHeight,
  paddingInlineStart: 0,
  paddingInlineEnd: 0,
  borderRadius: '50%',
});

const genRoundButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  borderRadius: token.controlHeight,
  paddingInlineStart: token.calc(token.controlHeight).div(2).equal(),
  paddingInlineEnd: token.calc(token.controlHeight).div(2).equal(),
});

const genDisabledStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  cursor: 'not-allowed',
  borderColor: token.borderColorDisabled,
  color: token.colorTextDisabled,
  background: token.colorBgContainerDisabled,
  boxShadow: 'none',
});

const genGhostButtonStyle = (
  btnCls: string,
  background: string,
  textColor: string | false,
  borderColor: string | false,
  textColorDisabled: string | false,
  borderColorDisabled: string | false,
  hoverStyle?: CSSObject,
  activeStyle?: CSSObject,
): CSSObject => ({
  [`&${btnCls}-background-ghost`]: {
    color: textColor || undefined,
    background,
    borderColor: borderColor || undefined,
    boxShadow: 'none',

    ...genHoverActiveButtonStyle(
      btnCls,
      {
        background,
        ...hoverStyle,
      },
      {
        background,
        ...activeStyle,
      },
    ),

    '&:disabled': {
      cursor: 'not-allowed',
      color: textColorDisabled || undefined,
      borderColor: borderColorDisabled || undefined,
    },
  },
});

const genSolidDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  [`&:disabled, &${token.componentCls}-disabled`]: {
    ...genDisabledStyle(token),
  },
});

const genPureDisabledButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  [`&:disabled, &${token.componentCls}-disabled`]: {
    cursor: 'not-allowed',
    color: token.colorTextDisabled,
  },
});

// ============================== Variant =============================
const genVariantButtonStyle = (
  token: ButtonToken,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
  variant?: ButtonVariantType,
): CSSObject => {
  const isPureDisabled = variant && ['link', 'text'].includes(variant);
  const genDisabledButtonStyle = isPureDisabled
    ? genPureDisabledButtonStyle
    : genSolidDisabledButtonStyle;

  return {
    ...genDisabledButtonStyle(token),

    ...genHoverActiveButtonStyle(token.componentCls, hoverStyle, activeStyle),
  };
};

const genSolidButtonStyle = (
  token: ButtonToken,
  textColor: string,
  background: string,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
): CSSObject => ({
  [`&${token.componentCls}-variant-solid`]: {
    color: textColor,
    background,

    ...genVariantButtonStyle(token, hoverStyle, activeStyle),
  },
});

const genOutlinedDashedButtonStyle = (
  token: ButtonToken,
  borderColor: string,
  background: string,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
) => ({
  [`&${token.componentCls}-variant-outlined, &${token.componentCls}-variant-dashed`]: {
    borderColor,
    background,

    ...genVariantButtonStyle(token, hoverStyle, activeStyle),
  },
});

const genDashedButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  [`&${token.componentCls}-variant-dashed`]: {
    borderStyle: 'dashed',
  },
});

const genFilledButtonStyle = (
  token: ButtonToken,
  background: string,
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
) => ({
  [`&${token.componentCls}-variant-filled`]: {
    boxShadow: 'none',
    background,

    ...genVariantButtonStyle(token, hoverStyle, activeStyle),
  },
});

const genTextLinkButtonStyle = (
  token: ButtonToken,
  textColor: string,
  variant: 'text' | 'link',
  hoverStyle: CSSObject,
  activeStyle: CSSObject,
) => ({
  [`&${token.componentCls}-variant-${variant}`]: {
    color: textColor,
    boxShadow: 'none',

    ...genVariantButtonStyle(token, hoverStyle, activeStyle, variant),
  },
});

// =============================== Color ==============================
const genPresetColorStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => {
  const { componentCls } = token;

  return PresetColors.reduce<CSSObject>((prev: CSSObject, colorKey: PresetColorKey) => {
    const darkColor = token[`${colorKey}6`];
    const lightColor = token[`${colorKey}1`];
    const hoverColor = token[`${colorKey}5`];
    const lightHoverColor = token[`${colorKey}2`];
    const lightBorderColor = token[`${colorKey}3`];
    const activeColor = token[`${colorKey}7`];
    const boxShadow = `0 ${unit(token.controlOutlineWidth)} 0 ${token[`${colorKey}1`]}`;

    return {
      ...prev,
      [`&${componentCls}-color-${colorKey}`]: {
        color: darkColor,
        boxShadow,

        ...genSolidButtonStyle(
          token,
          token.colorTextLightSolid,
          darkColor,
          {
            background: hoverColor,
          },
          {
            background: activeColor,
          },
        ),

        ...genOutlinedDashedButtonStyle(
          token,
          darkColor,
          token.colorBgContainer,
          {
            color: hoverColor,
            borderColor: hoverColor,
            background: token.colorBgContainer,
          },
          {
            color: activeColor,
            borderColor: activeColor,
            background: token.colorBgContainer,
          },
        ),

        ...genDashedButtonStyle(token),

        ...genFilledButtonStyle(
          token,
          lightColor,
          {
            background: lightHoverColor,
          },
          {
            background: lightBorderColor,
          },
        ),

        ...genTextLinkButtonStyle(
          token,
          darkColor,
          'link',
          {
            color: hoverColor,
          },
          {
            color: activeColor,
          },
        ),

        ...genTextLinkButtonStyle(
          token,
          darkColor,
          'text',
          {
            color: hoverColor,
            background: lightColor,
          },
          {
            color: activeColor,
            background: lightBorderColor,
          },
        ),
      },
    };
  }, {});
};

const genDefaultButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  color: token.defaultColor,

  boxShadow: token.defaultShadow,

  ...genSolidButtonStyle(
    token,
    token.solidTextColor,
    token.colorBgSolid,
    {
      color: token.solidTextColor,
      background: token.colorBgSolidHover,
    },
    {
      color: token.solidTextColor,
      background: token.colorBgSolidActive,
    },
  ),

  ...genDashedButtonStyle(token),

  ...genFilledButtonStyle(
    token,
    token.colorFillTertiary,
    {
      background: token.colorFillSecondary,
    },
    {
      background: token.colorFill,
    },
  ),

  ...genTextLinkButtonStyle(
    token,
    token.textTextColor,
    'link',
    {
      color: token.colorLinkHover,
      background: token.linkHoverBg,
    },
    {
      color: token.colorLinkActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.ghostBg,
    token.defaultGhostColor,
    token.defaultGhostBorderColor,
    token.colorTextDisabled,
    token.colorBorder,
  ),
});

const genPrimaryButtonStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  color: token.colorPrimary,

  boxShadow: token.primaryShadow,

  ...genOutlinedDashedButtonStyle(
    token,
    token.colorPrimary,
    token.colorBgContainer,
    {
      color: token.colorPrimaryTextHover,
      borderColor: token.colorPrimaryHover,
      background: token.colorBgContainer,
    },
    {
      color: token.colorPrimaryTextActive,
      borderColor: token.colorPrimaryActive,
      background: token.colorBgContainer,
    },
  ),

  ...genDashedButtonStyle(token),

  ...genFilledButtonStyle(
    token,
    token.colorPrimaryBg,
    {
      background: token.colorPrimaryBgHover,
    },
    {
      background: token.colorPrimaryBorder,
    },
  ),

  ...genTextLinkButtonStyle(
    token,
    token.colorPrimary,
    'text',
    {
      color: token.colorPrimaryTextHover,
      background: token.colorPrimaryBg,
    },
    {
      color: token.colorPrimaryTextActive,
      background: token.colorPrimaryBorder,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.ghostBg,
    token.colorPrimary,
    token.colorPrimary,
    token.colorTextDisabled,
    token.colorBorder,
    {
      color: token.colorPrimaryHover,
      borderColor: token.colorPrimaryHover,
    },
    {
      color: token.colorPrimaryActive,
      borderColor: token.colorPrimaryActive,
    },
  ),
});

const genDangerousStyle: GenerateStyle<ButtonToken, CSSObject> = (token) => ({
  color: token.colorError,
  boxShadow: token.dangerShadow,

  ...genSolidButtonStyle(
    token,
    token.dangerColor,
    token.colorError,
    {
      background: token.colorErrorHover,
    },
    {
      background: token.colorErrorActive,
    },
  ),

  ...genOutlinedDashedButtonStyle(
    token,
    token.colorError,
    token.colorBgContainer,
    {
      color: token.colorErrorHover,
      borderColor: token.colorErrorBorderHover,
    },
    {
      color: token.colorErrorActive,
      borderColor: token.colorErrorActive,
    },
  ),

  ...genDashedButtonStyle(token),

  ...genFilledButtonStyle(
    token,
    token.colorErrorBg,
    {
      background: token.colorErrorBgFilledHover,
    },
    {
      background: token.colorErrorBgActive,
    },
  ),

  ...genTextLinkButtonStyle(
    token,
    token.colorError,
    'text',
    {
      color: token.colorErrorHover,
      background: token.colorErrorBg,
    },
    {
      color: token.colorErrorHover,
      background: token.colorErrorBgActive,
    },
  ),

  ...genTextLinkButtonStyle(
    token,
    token.colorError,
    'link',
    {
      color: token.colorErrorHover,
    },
    {
      color: token.colorErrorActive,
    },
  ),

  ...genGhostButtonStyle(
    token.componentCls,
    token.ghostBg,
    token.colorError,
    token.colorError,
    token.colorTextDisabled,
    token.colorBorder,
    {
      color: token.colorErrorHover,
      borderColor: token.colorErrorHover,
    },
    {
      color: token.colorErrorActive,
      borderColor: token.colorErrorActive,
    },
  ),
});

const genColorButtonStyle: GenerateStyle<ButtonToken> = (token) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-color-default`]: genDefaultButtonStyle(token),
    [`${componentCls}-color-primary`]: genPrimaryButtonStyle(token),
    [`${componentCls}-color-dangerous`]: genDangerousStyle(token),

    ...genPresetColorStyle(token),
  };
};

// =========== Compatible with versions earlier than 5.21.0 ===========
const genCompatibleButtonStyle: GenerateStyle<ButtonToken> = (token) => ({
  // default + outlined
  ...genOutlinedDashedButtonStyle(
    token,
    token.defaultBorderColor,
    token.defaultBg,
    {
      color: token.defaultHoverColor,
      borderColor: token.defaultHoverBorderColor,
      background: token.defaultHoverBg,
    },
    {
      color: token.defaultActiveColor,
      borderColor: token.defaultActiveBorderColor,
      background: token.defaultActiveBg,
    },
  ),

  // default + text
  ...genTextLinkButtonStyle(
    token,
    token.textTextColor,
    'text',
    {
      color: token.textTextHoverColor,
      background: token.textHoverBg,
    },
    {
      color: token.textTextActiveColor,
      background: token.colorBgTextActive,
    },
  ),

  // primary + solid
  ...genSolidButtonStyle(
    token,
    token.primaryColor,
    token.colorPrimary,
    {
      background: token.colorPrimaryHover,
      color: token.primaryColor,
    },
    {
      background: token.colorPrimaryActive,
      color: token.primaryColor,
    },
  ),

  // primary + link
  ...genTextLinkButtonStyle(
    token,
    token.colorLink,
    'link',
    {
      color: token.colorLinkHover,
      background: token.linkHoverBg,
    },
    {
      color: token.colorLinkActive,
    },
  ),
});

// =============================== Size ===============================
const genButtonStyle = (token: ButtonToken, prefixCls = ''): CSSInterpolation => {
  const {
    componentCls,
    controlHeight,
    fontSize,
    borderRadius,
    buttonPaddingHorizontal,
    iconCls,
    buttonPaddingVertical,
    buttonIconOnlyFontSize,
  } = token;

  return [
    {
      [prefixCls]: {
        fontSize,
        height: controlHeight,
        padding: `${unit(buttonPaddingVertical!)} ${unit(buttonPaddingHorizontal!)}`,
        borderRadius,

        [`&${componentCls}-icon-only`]: {
          width: controlHeight,

          [iconCls]: {
            fontSize: buttonIconOnlyFontSize,
          },
        },
      },
    },
    // Shape - patch prefixCls again to override solid border radius style
    {
      [`${componentCls}${componentCls}-circle${prefixCls}`]: genCircleButtonStyle(token),
    },
    {
      [`${componentCls}${componentCls}-round${prefixCls}`]: genRoundButtonStyle(token),
    },
  ];
};

const genSizeBaseButtonStyle: GenerateStyle<ButtonToken> = (token) => {
  const baseToken = mergeToken<ButtonToken>(token, {
    fontSize: token.contentFontSize,
  });
  return genButtonStyle(baseToken, token.componentCls);
};

const genSizeSmallButtonStyle: GenerateStyle<ButtonToken> = (token) => {
  const smallToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightSM,
    fontSize: token.contentFontSizeSM,
    padding: token.paddingXS,
    buttonPaddingHorizontal: token.paddingInlineSM,
    buttonPaddingVertical: 0,
    borderRadius: token.borderRadiusSM,
    buttonIconOnlyFontSize: token.onlyIconSizeSM,
  });

  return genButtonStyle(smallToken, `${token.componentCls}-sm`);
};

const genSizeLargeButtonStyle: GenerateStyle<ButtonToken> = (token) => {
  const largeToken = mergeToken<ButtonToken>(token, {
    controlHeight: token.controlHeightLG,
    fontSize: token.contentFontSizeLG,
    buttonPaddingHorizontal: token.paddingInlineLG,
    buttonPaddingVertical: 0,
    borderRadius: token.borderRadiusLG,
    buttonIconOnlyFontSize: token.onlyIconSizeLG,
  });

  return genButtonStyle(largeToken, `${token.componentCls}-lg`);
};

const genBlockButtonStyle: GenerateStyle<ButtonToken> = (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      [`&${componentCls}-block`]: {
        width: '100%',
      },
    },
  };
};

// ============================== Export ==============================
export default genStyleHooks(
  'Button',
  (token) => {
    const buttonToken = prepareToken(token);

    return [
      // Shared
      genSharedButtonStyle(buttonToken),

      // Size
      genSizeBaseButtonStyle(buttonToken),
      genSizeSmallButtonStyle(buttonToken),
      genSizeLargeButtonStyle(buttonToken),

      // Block
      genBlockButtonStyle(buttonToken),

      // Color
      genColorButtonStyle(buttonToken),

      // https://github.com/ant-design/ant-design/issues/50969
      genCompatibleButtonStyle(buttonToken),

      // Button Group
      genGroupStyle(buttonToken),
    ];
  },
  prepareComponentToken,
  {
    unitless: {
      fontWeight: true,
      contentLineHeight: true,
      contentLineHeightSM: true,
      contentLineHeightLG: true,
    },
  },
);
