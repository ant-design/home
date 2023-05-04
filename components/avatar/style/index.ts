import type { CSSObject } from '@ant-design/cssinjs';
import { resetComponent } from '../../style';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

export interface ComponentToken {
  avatarBg: string;
  avatarColor: string;
  avatarSizeBase: number;
  avatarSizeLG: number;
  avatarSizeSM: number;
  avatarFontSizeBase: number;
  avatarFontSizeLG: number;
  avatarFontSizeSM: number;
  avatarGroupSpace: number;
  avatarGroupBorderColor: string;
}

type AvatarToken = FullToken<'Avatar'> & {};

const genBaseStyle: GenerateStyle<AvatarToken> = (token) => {
  const {
    antCls,
    componentCls,
    iconCls,
    avatarBg,
    avatarColor,
    avatarSizeBase,
    avatarSizeLG,
    avatarSizeSM,
    avatarFontSizeBase,
    avatarFontSizeLG,
    avatarFontSizeSM,
    borderRadius,
    borderRadiusLG,
    borderRadiusSM,
    lineWidth,
    lineType,
  } = token;

  // Avatar size style
  const avatarSizeStyle = (size: number, fontSize: number, radius: number): CSSObject => ({
    width: size,
    height: size,
    lineHeight: `${size - lineWidth * 2}px`,
    borderRadius: '50%',

    [`&${componentCls}-square`]: {
      borderRadius: radius,
    },

    [`${componentCls}-string`]: {
      position: 'absolute',
      left: {
        _skip_check_: true,
        value: '50%',
      },
      transformOrigin: '0 center',
    },

    [`&${componentCls}-icon`]: {
      fontSize,
      [`> ${iconCls}`]: {
        margin: 0,
      },
    },
  });

  return {
    [componentCls]: {
      ...resetComponent(token),
      position: 'relative',
      display: 'inline-block',
      overflow: 'hidden',
      color: avatarColor,
      whiteSpace: 'nowrap',
      textAlign: 'center',
      verticalAlign: 'middle',
      background: avatarBg,
      border: `${lineWidth}px ${lineType} transparent`,

      [`&-image`]: {
        background: 'transparent',
      },

      [`${antCls}-image-img`]: {
        display: 'block',
      },

      ...avatarSizeStyle(avatarSizeBase, avatarFontSizeBase, borderRadius),

      [`&-lg`]: {
        ...avatarSizeStyle(avatarSizeLG, avatarFontSizeLG, borderRadiusLG),
      },

      [`&-sm`]: {
        ...avatarSizeStyle(avatarSizeSM, avatarFontSizeSM, borderRadiusSM),
      },

      '> img': {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
  };
};

const genGroupStyle: GenerateStyle<AvatarToken> = (token) => {
  const { componentCls, avatarGroupBorderColor, avatarGroupSpace } = token;

  return {
    [`${componentCls}-group`]: {
      display: 'inline-flex',

      [`${componentCls}`]: {
        borderColor: avatarGroupBorderColor,
      },

      [`> *:not(:first-child)`]: {
        marginInlineStart: avatarGroupSpace,
      },
    },
  };
};

export default genComponentStyleHook(
  'Avatar',
  (token) => {
    const avatarToken = mergeToken<AvatarToken>(token, {});
    return [genBaseStyle(avatarToken), genGroupStyle(avatarToken)];
  },
  (token) => {
    const {
      colorTextLightSolid,

      controlHeight,
      controlHeightLG,
      controlHeightSM,

      fontSize,
      fontSizeLG,
      fontSizeXL,
      fontSizeHeading3,

      marginXS,
      colorBorderBg,
      colorTextPlaceholder,
    } = token;
    return {
      avatarSizeBase: controlHeight,
      avatarSizeLG: controlHeightLG,
      avatarSizeSM: controlHeightSM,

      avatarFontSizeBase: Math.round((fontSizeLG + fontSizeXL) / 2),
      avatarFontSizeLG: fontSizeHeading3,
      avatarFontSizeSM: fontSize,

      avatarBg: colorTextPlaceholder,
      avatarColor: colorTextLightSolid,
      avatarGroupSpace: -marginXS,
      avatarGroupBorderColor: colorBorderBg,
    };
  },
);
