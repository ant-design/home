import type { CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import { clearFix, resetComponent } from '../../style';
import { genCompactItemStyle } from '../../style/compact-item';
import type { GenerateStyle } from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';
import type { ComponentToken, InputToken } from './token';
import { initComponentToken, initInputToken } from './token';
import {
  genBorderlessStyle,
  genFilledGroupStyle,
  genFilledStyle,
  genOutlinedGroupStyle,
  genOutlinedStyle,
} from './variants';

export type { ComponentToken };
export { initComponentToken, initInputToken };

export const genPlaceholderStyle = (color: string): CSSObject => ({
  // Firefox
  '&::-moz-placeholder': {
    opacity: 1,
  },
  '&::placeholder': {
    color,
    userSelect: 'none', // https://github.com/ant-design/ant-design/pull/32639
  },
  '&:placeholder-shown': {
    textOverflow: 'ellipsis',
  },
});

export const genActiveStyle = (token: InputToken) => ({
  borderColor: token.activeBorderColor,
  boxShadow: token.activeShadow,
  outline: 0,
  backgroundColor: token.activeBg,
});

const genInputLargeStyle = (token: InputToken): CSSObject => {
  const { paddingBlockLG, lineHeightLG, borderRadiusLG, paddingInlineLG } = token;

  return {
    padding: `${unit(paddingBlockLG)} ${unit(paddingInlineLG)}`,
    fontSize: token.inputFontSizeLG,
    lineHeight: lineHeightLG,
    borderRadius: borderRadiusLG,
  };
};

export const genInputSmallStyle = (token: InputToken): CSSObject => ({
  padding: `${unit(token.paddingBlockSM)} ${unit(token.paddingInlineSM)}`,
  fontSize: token.inputFontSizeSM,
  borderRadius: token.borderRadiusSM,
});

export const genBasicInputStyle = (token: InputToken): CSSObject => ({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  minWidth: 0,
  padding: `${unit(token.paddingBlock)} ${unit(token.paddingInline)}`,
  color: token.colorText,
  fontSize: token.inputFontSize,
  lineHeight: token.lineHeight,
  borderRadius: token.borderRadius,
  transition: `all ${token.motionDurationMid}`,
  ...genPlaceholderStyle(token.colorTextPlaceholder),

  // Reset height for `textarea`s
  'textarea&': {
    maxWidth: '100%', // prevent textarea resize from coming out of its container
    height: 'auto',
    minHeight: token.controlHeight,
    lineHeight: token.lineHeight,
    verticalAlign: 'bottom',
    transition: `all ${token.motionDurationSlow}, height 0s`,
    resize: 'vertical',
  },

  // Size
  '&-lg': {
    ...genInputLargeStyle(token),
  },
  '&-sm': {
    ...genInputSmallStyle(token),
  },

  // RTL
  '&-rtl, &-textarea-rtl': {
    direction: 'rtl',
  },
});

export const genInputGroupStyle = (token: InputToken): CSSObject => {
  const { componentCls, antCls } = token;

  return {
    position: 'relative',
    display: 'table',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,

    // Undo padding and float of grid classes
    "&[class*='col-']": {
      paddingInlineEnd: token.paddingXS,

      '&:last-child': {
        paddingInlineEnd: 0,
      },
    },

    // Sizing options
    [`&-lg ${componentCls}, &-lg > ${componentCls}-group-addon`]: {
      ...genInputLargeStyle(token),
    },

    [`&-sm ${componentCls}, &-sm > ${componentCls}-group-addon`]: {
      ...genInputSmallStyle(token),
    },

    // Fix https://github.com/ant-design/ant-design/issues/5754
    [`&-lg ${antCls}-select-single ${antCls}-select-selector`]: {
      height: token.controlHeightLG,
    },

    [`&-sm ${antCls}-select-single ${antCls}-select-selector`]: {
      height: token.controlHeightSM,
    },

    [`> ${componentCls}`]: {
      display: 'table-cell',

      '&:not(:first-child):not(:last-child)': {
        borderRadius: 0,
      },
    },

    [`${componentCls}-group`]: {
      '&-addon, &-wrap': {
        display: 'table-cell',
        width: 1,
        whiteSpace: 'nowrap',
        verticalAlign: 'middle',

        '&:not(:first-child):not(:last-child)': {
          borderRadius: 0,
        },
      },

      '&-wrap > *': {
        display: 'block !important',
      },

      '&-addon': {
        position: 'relative',
        padding: `0 ${unit(token.paddingInline)}`,
        color: token.colorText,
        fontWeight: 'normal',
        fontSize: token.inputFontSize,
        textAlign: 'center',
        borderRadius: token.borderRadius,
        transition: `all ${token.motionDurationSlow}`,
        lineHeight: 1,

        // Reset Select's style in addon
        [`${antCls}-select`]: {
          margin: `${unit(token.calc(token.paddingBlock).add(1).mul(-1).equal())} ${unit(
            token.calc(token.paddingInline).mul(-1).equal(),
          )}`,

          [`&${antCls}-select-single:not(${antCls}-select-customize-input):not(${antCls}-pagination-size-changer)`]:
            {
              [`${antCls}-select-selector`]: {
                backgroundColor: 'inherit',
                border: `${unit(token.lineWidth)} ${token.lineType} transparent`,
                boxShadow: 'none',
              },
            },
        },

        // https://github.com/ant-design/ant-design/issues/31333
        [`${antCls}-cascader-picker`]: {
          margin: `-9px ${unit(token.calc(token.paddingInline).mul(-1).equal())}`,
          backgroundColor: 'transparent',
          [`${antCls}-cascader-input`]: {
            textAlign: 'start',
            border: 0,
            boxShadow: 'none',
          },
        },
      },
    },

    [componentCls]: {
      width: '100%',
      marginBottom: 0,
      textAlign: 'inherit',

      '&:focus': {
        zIndex: 1, // Fix https://gw.alipayobjects.com/zos/rmsportal/DHNpoqfMXSfrSnlZvhsJ.png
        borderInlineEndWidth: 1,
      },

      '&:hover': {
        zIndex: 1,
        borderInlineEndWidth: 1,

        [`${componentCls}-search-with-button &`]: {
          zIndex: 0,
        },
      },
    },

    // Reset rounded corners
    [`> ${componentCls}:first-child, ${componentCls}-group-addon:first-child`]: {
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,

      // Reset Select's style in addon
      [`${antCls}-select ${antCls}-select-selector`]: {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
      },
    },

    [`> ${componentCls}-affix-wrapper`]: {
      [`&:not(:first-child) ${componentCls}`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
      },

      [`&:not(:last-child) ${componentCls}`]: {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
      },
    },

    [`> ${componentCls}:last-child, ${componentCls}-group-addon:last-child`]: {
      borderStartStartRadius: 0,
      borderEndStartRadius: 0,

      // Reset Select's style in addon
      [`${antCls}-select ${antCls}-select-selector`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
      },
    },

    [`${componentCls}-affix-wrapper`]: {
      '&:not(:last-child)': {
        borderStartEndRadius: 0,
        borderEndEndRadius: 0,
        [`${componentCls}-search &`]: {
          borderStartStartRadius: token.borderRadius,
          borderEndStartRadius: token.borderRadius,
        },
      },

      [`&:not(:first-child), ${componentCls}-search &:not(:first-child)`]: {
        borderStartStartRadius: 0,
        borderEndStartRadius: 0,
      },
    },

    [`&${componentCls}-group-compact`]: {
      display: 'block',
      ...clearFix(),

      [`${componentCls}-group-addon, ${componentCls}-group-wrap, > ${componentCls}`]: {
        '&:not(:first-child):not(:last-child)': {
          borderInlineEndWidth: token.lineWidth,

          '&:hover, &:focus': {
            zIndex: 1,
          },
        },
      },

      '& > *': {
        display: 'inline-flex',
        float: 'none',
        verticalAlign: 'top', // https://github.com/ant-design/ant-design-pro/issues/139
        borderRadius: 0,
      },

      [`
        & > ${componentCls}-affix-wrapper,
        & > ${componentCls}-number-affix-wrapper,
        & > ${antCls}-picker-range
      `]: {
        display: 'inline-flex',
      },

      '& > *:not(:last-child)': {
        marginInlineEnd: token.calc(token.lineWidth).mul(-1).equal(),
        borderInlineEndWidth: token.lineWidth,
      },

      // Undo float for .ant-input-group .ant-input
      [componentCls]: {
        float: 'none',
      },

      // reset border for Select, DatePicker, AutoComplete, Cascader, Mention, TimePicker, Input
      [`& > ${antCls}-select > ${antCls}-select-selector,
      & > ${antCls}-select-auto-complete ${componentCls},
      & > ${antCls}-cascader-picker ${componentCls},
      & > ${componentCls}-group-wrapper ${componentCls}`]: {
        borderInlineEndWidth: token.lineWidth,
        borderRadius: 0,

        '&:hover, &:focus': {
          zIndex: 1,
        },
      },

      [`& > ${antCls}-select-focused`]: {
        zIndex: 1,
      },

      // update z-index for arrow icon
      [`& > ${antCls}-select > ${antCls}-select-arrow`]: {
        zIndex: 1, // https://github.com/ant-design/ant-design/issues/20371
      },

      [`& > *:first-child,
      & > ${antCls}-select:first-child > ${antCls}-select-selector,
      & > ${antCls}-select-auto-complete:first-child ${componentCls},
      & > ${antCls}-cascader-picker:first-child ${componentCls}`]: {
        borderStartStartRadius: token.borderRadius,
        borderEndStartRadius: token.borderRadius,
      },

      [`& > *:last-child,
      & > ${antCls}-select:last-child > ${antCls}-select-selector,
      & > ${antCls}-cascader-picker:last-child ${componentCls},
      & > ${antCls}-cascader-picker-focused:last-child ${componentCls}`]: {
        borderInlineEndWidth: token.lineWidth,
        borderStartEndRadius: token.borderRadius,
        borderEndEndRadius: token.borderRadius,
      },

      // https://github.com/ant-design/ant-design/issues/12493
      [`& > ${antCls}-select-auto-complete ${componentCls}`]: {
        verticalAlign: 'top',
      },

      [`${componentCls}-group-wrapper + ${componentCls}-group-wrapper`]: {
        marginInlineStart: token.calc(token.lineWidth).mul(-1).equal(),
        [`${componentCls}-affix-wrapper`]: {
          borderRadius: 0,
        },
      },

      [`${componentCls}-group-wrapper:not(:last-child)`]: {
        [`&${componentCls}-search > ${componentCls}-group`]: {
          [`& > ${componentCls}-group-addon > ${componentCls}-search-button`]: {
            borderRadius: 0,
          },

          [`& > ${componentCls}`]: {
            borderStartStartRadius: token.borderRadius,
            borderStartEndRadius: 0,
            borderEndEndRadius: 0,
            borderEndStartRadius: token.borderRadius,
          },
        },
      },
    },
  };
};

const genInputStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { componentCls, controlHeightSM, lineWidth, calc } = token;

  const FIXED_CHROME_COLOR_HEIGHT = 16;
  const colorSmallPadding = calc(controlHeightSM)
    .sub(calc(lineWidth).mul(2))
    .sub(FIXED_CHROME_COLOR_HEIGHT)
    .div(2)
    .equal();

  return {
    [componentCls]: {
      ...resetComponent(token),
      ...genBasicInputStyle(token),

      // Variants
      ...genOutlinedStyle(token),
      ...genFilledStyle(token),
      ...genBorderlessStyle(token),

      '&[type="color"]': {
        height: token.controlHeight,

        [`&${componentCls}-lg`]: {
          height: token.controlHeightLG,
        },
        [`&${componentCls}-sm`]: {
          height: controlHeightSM,
          paddingTop: colorSmallPadding,
          paddingBottom: colorSmallPadding,
        },
      },

      '&[type="search"]::-webkit-search-cancel-button, &[type="search"]::-webkit-search-decoration':
        {
          '-webkit-appearance': 'none',
        },
    },
  };
};

const genAllowClearStyle = (token: InputToken): CSSObject => {
  const { componentCls } = token;
  return {
    // ========================= Input =========================
    [`${componentCls}-clear-icon`]: {
      margin: 0,
      padding: 0,
      lineHeight: 0,
      color: token.colorTextQuaternary,
      fontSize: token.fontSizeIcon,
      verticalAlign: -1,
      // https://github.com/ant-design/ant-design/pull/18151
      // https://codesandbox.io/s/wizardly-sun-u10br
      cursor: 'pointer',
      transition: `color ${token.motionDurationSlow}`,
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        color: token.colorTextTertiary,
      },

      '&:active': {
        color: token.colorText,
      },

      '&-hidden': {
        visibility: 'hidden',
      },

      '&-has-suffix': {
        margin: `0 ${unit(token.inputAffixPadding)}`,
      },
    },
  };
};

const genAffixStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const {
    componentCls,
    inputAffixPadding,
    colorTextDescription,
    motionDurationSlow,
    colorIcon,
    colorIconHover,
    iconCls,
  } = token;

  const affixCls = `${componentCls}-affix-wrapper`;
  const affixClsDisabled = `${componentCls}-affix-wrapper-disabled`;

  return {
    [affixCls]: {
      ...genBasicInputStyle(token),
      display: 'inline-flex',

      [`&:not(${componentCls}-disabled):hover`]: {
        zIndex: 1,
        [`${componentCls}-search-with-button &`]: {
          zIndex: 0,
        },
      },

      '&-focused, &:focus': {
        zIndex: 1,
      },

      [`> input${componentCls}`]: {
        padding: 0,
      },

      [`> input${componentCls}, > textarea${componentCls}`]: {
        fontSize: 'inherit',
        border: 'none',
        borderRadius: 0,
        outline: 'none',
        background: 'transparent',
        color: 'inherit',

        '&::-ms-reveal': {
          display: 'none',
        },

        '&:focus': {
          boxShadow: 'none !important',
        },
      },

      '&::before': {
        display: 'inline-block',
        width: 0,
        visibility: 'hidden',
        content: '"\\a0"',
      },

      [componentCls]: {
        '&-prefix, &-suffix': {
          display: 'flex',
          flex: 'none',
          alignItems: 'center',

          '> *:not(:last-child)': {
            marginInlineEnd: token.paddingXS,
          },
        },

        '&-show-count-suffix': {
          color: colorTextDescription,
        },

        '&-show-count-has-suffix': {
          marginInlineEnd: token.paddingXXS,
        },

        '&-prefix': {
          marginInlineEnd: inputAffixPadding,
        },

        '&-suffix': {
          marginInlineStart: inputAffixPadding,
        },
      },

      ...genAllowClearStyle(token),

      // password
      [`${iconCls}${componentCls}-password-icon`]: {
        color: colorIcon,
        cursor: 'pointer',
        transition: `all ${motionDurationSlow}`,

        '&:hover': {
          color: colorIconHover,
        },
      },
    },
    [affixClsDisabled]: {
      // password disabled
      [`${iconCls}${componentCls}-password-icon`]: {
        color: colorIcon,
        cursor: 'not-allowed',

        '&:hover': {
          color: colorIcon,
        },
      },
    },
  };
};

const genGroupStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { componentCls, borderRadiusLG, borderRadiusSM } = token;

  return {
    [`${componentCls}-group`]: {
      // Style for input-group: input with label, with button or dropdown...
      ...resetComponent(token),
      ...genInputGroupStyle(token),

      '&-rtl': {
        direction: 'rtl',
      },

      '&-wrapper': {
        display: 'inline-block',
        width: '100%',
        textAlign: 'start',
        verticalAlign: 'top', // https://github.com/ant-design/ant-design/issues/6403

        '&-rtl': {
          direction: 'rtl',
        },

        // Size
        '&-lg': {
          [`${componentCls}-group-addon`]: {
            borderRadius: borderRadiusLG,
            fontSize: token.inputFontSizeLG,
          },
        },
        '&-sm': {
          [`${componentCls}-group-addon`]: {
            borderRadius: borderRadiusSM,
          },
        },

        // Variants
        ...genOutlinedGroupStyle(token),
        ...genFilledGroupStyle(token),

        // '&-disabled': {
        //   [`${componentCls}-group-addon`]: {
        //     ...genDisabledStyle(token),
        //   },
        // },

        // Fix the issue of using icons in Space Compact mode
        // https://github.com/ant-design/ant-design/issues/42122
        [`&:not(${componentCls}-compact-first-item):not(${componentCls}-compact-last-item)${componentCls}-compact-item`]:
          {
            [`${componentCls}, ${componentCls}-group-addon`]: {
              borderRadius: 0,
            },
          },

        [`&:not(${componentCls}-compact-last-item)${componentCls}-compact-first-item`]: {
          [`${componentCls}, ${componentCls}-group-addon`]: {
            borderStartEndRadius: 0,
            borderEndEndRadius: 0,
          },
        },

        [`&:not(${componentCls}-compact-first-item)${componentCls}-compact-last-item`]: {
          [`${componentCls}, ${componentCls}-group-addon`]: {
            borderStartStartRadius: 0,
            borderEndStartRadius: 0,
          },
        },

        // Fix the issue of input use show-count param in space compact mode
        // https://github.com/ant-design/ant-design/issues/46872
        [`&:not(${componentCls}-compact-last-item)${componentCls}-compact-item`]: {
          [`${componentCls}-affix-wrapper`]: {
            borderStartEndRadius: 0,
            borderEndEndRadius: 0,
          },
        },
        // Fix the issue of input use `addonAfter` param in space compact mode
        // https://github.com/ant-design/ant-design/issues/52483
        [`&:not(${componentCls}-compact-first-item)${componentCls}-compact-item`]: {
          [`${componentCls}-affix-wrapper`]: {
            borderStartStartRadius: 0,
            borderEndStartRadius: 0,
          },
        },
      },
    },
  };
};

const genSearchInputStyle: GenerateStyle<InputToken> = (token: InputToken) => {
  const { componentCls, antCls } = token;
  const searchPrefixCls = `${componentCls}-search`;
  return {
    [searchPrefixCls]: {
      [componentCls]: {
        '&:hover, &:focus': {
          [`+ ${componentCls}-group-addon ${searchPrefixCls}-button:not(${antCls}-btn-primary)`]: {
            borderInlineStartColor: token.colorPrimaryHover,
          },
        },
      },

      [`${componentCls}-affix-wrapper`]: {
        height: token.controlHeight,
        borderRadius: 0,
      },

      // fix slight height diff in Firefox:
      // https://ant.design/components/auto-complete-cn/#auto-complete-demo-certain-category
      [`${componentCls}-lg`]: {
        lineHeight: token.calc(token.lineHeightLG).sub(0.0002).equal(),
      },

      [`> ${componentCls}-group`]: {
        [`> ${componentCls}-group-addon:last-child`]: {
          insetInlineStart: -1,
          padding: 0,
          border: 0,

          [`${searchPrefixCls}-button`]: {
            // Fix https://github.com/ant-design/ant-design/issues/47150
            marginInlineEnd: -1,
            borderStartStartRadius: 0,
            borderEndStartRadius: 0,
            boxShadow: 'none',
          },

          [`${searchPrefixCls}-button:not(${antCls}-btn-primary)`]: {
            color: token.colorTextDescription,

            '&:hover': {
              color: token.colorPrimaryHover,
            },

            '&:active': {
              color: token.colorPrimaryActive,
            },

            [`&${antCls}-btn-loading::before`]: {
              insetInlineStart: 0,
              insetInlineEnd: 0,
              insetBlockStart: 0,
              insetBlockEnd: 0,
            },
          },
        },
      },

      [`${searchPrefixCls}-button`]: {
        height: token.controlHeight,

        '&:hover, &:focus': {
          zIndex: 1,
        },
      },

      '&-large': {
        [`${componentCls}-affix-wrapper, ${searchPrefixCls}-button`]: {
          height: token.controlHeightLG,
        },
      },

      '&-small': {
        [`${componentCls}-affix-wrapper, ${searchPrefixCls}-button`]: {
          height: token.controlHeightSM,
        },
      },

      '&-rtl': {
        direction: 'rtl',
      },

      // ===================== Compact Item Customized Styles =====================
      [`&${componentCls}-compact-item`]: {
        [`&:not(${componentCls}-compact-last-item)`]: {
          [`${componentCls}-group-addon`]: {
            [`${componentCls}-search-button`]: {
              marginInlineEnd: token.calc(token.lineWidth).mul(-1).equal(),
              borderRadius: 0,
            },
          },
        },

        [`&:not(${componentCls}-compact-first-item)`]: {
          [`${componentCls},${componentCls}-affix-wrapper`]: {
            borderRadius: 0,
          },
        },

        [`> ${componentCls}-group-addon ${componentCls}-search-button,
        > ${componentCls},
        ${componentCls}-affix-wrapper`]: {
          '&:hover, &:focus, &:active': {
            zIndex: 2,
          },
        },

        [`> ${componentCls}-affix-wrapper-focused`]: {
          zIndex: 2,
        },
      },
    },
  };
};

const genTextAreaStyle: GenerateStyle<InputToken> = (token) => {
  const { componentCls, paddingLG } = token;
  const textareaPrefixCls = `${componentCls}-textarea`;

  return {
    [textareaPrefixCls]: {
      position: 'relative',

      '&-show-count': {
        // https://github.com/ant-design/ant-design/issues/33049
        [`> ${componentCls}`]: {
          height: '100%',
        },

        [`${componentCls}-data-count`]: {
          position: 'absolute',
          bottom: token.calc(token.fontSize).mul(token.lineHeight).mul(-1).equal(),
          insetInlineEnd: 0,
          color: token.colorTextDescription,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        },
      },

      [`
        &-allow-clear > ${componentCls},
        &-affix-wrapper${textareaPrefixCls}-has-feedback ${componentCls}
      `]: {
        paddingInlineEnd: paddingLG,
      },

      [`&-affix-wrapper${componentCls}-affix-wrapper`]: {
        padding: 0,
        height: token.controlHeight,
        [`> textarea${componentCls}`]: {
          fontSize: 'inherit',
          border: 'none',
          outline: 'none',
          background: 'transparent',
          minHeight: token
            .calc(token.controlHeight)
            .sub(token.calc(token.lineWidth).mul(2))
            .equal(),

          '&:focus': {
            boxShadow: 'none !important',
          },
        },

        [`${componentCls}-suffix`]: {
          margin: 0,

          '> *:not(:last-child)': {
            marginInline: 0,
          },

          // Clear Icon
          [`${componentCls}-clear-icon`]: {
            position: 'absolute',
            insetInlineEnd: token.paddingInline,
            insetBlockStart: token.paddingXS,
          },

          // Feedback Icon
          [`${textareaPrefixCls}-suffix`]: {
            position: 'absolute',
            top: 0,
            insetInlineEnd: token.paddingInline,
            bottom: 0,
            zIndex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            margin: 'auto',
            pointerEvents: 'none',
          },
        },
      },

      [`&-affix-wrapper${componentCls}-affix-wrapper-sm`]: {
        [`${componentCls}-suffix`]: {
          [`${componentCls}-clear-icon`]: {
            insetInlineEnd: token.paddingInlineSM,
          },
        },
      },
    },
  };
};

// ============================== Range ===============================
const genRangeStyle: GenerateStyle<InputToken> = (token) => {
  const { componentCls } = token;

  return {
    [`${componentCls}-out-of-range`]: {
      [`&, & input, & textarea, ${componentCls}-show-count-suffix, ${componentCls}-data-count`]: {
        color: token.colorError,
      },
    },
  };
};

// ============================== Export ==============================
export default genStyleHooks(
  'Input',
  (token) => {
    const inputToken = mergeToken<InputToken>(token, initInputToken(token));

    return [
      genInputStyle(inputToken),
      genTextAreaStyle(inputToken),
      genAffixStyle(inputToken),
      genGroupStyle(inputToken),
      genSearchInputStyle(inputToken),
      genRangeStyle(inputToken),
      // =====================================================
      // ==             Space Compact                       ==
      // =====================================================
      genCompactItemStyle(inputToken),
    ];
  },
  initComponentToken,
  {
    resetFont: false,
  },
);
