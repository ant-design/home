import type { CSSProperties } from 'react';
import type { CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import { resetComponent } from '../../style';
import { genCollapseMotion, zoomIn } from '../../style/motion';
import type {
  AliasToken,
  FullToken,
  GenerateStyle,
  GenStyleFn,
  GetDefaultToken,
} from '../../theme/internal';
import { genStyleHooks, mergeToken } from '../../theme/internal';
import genFormValidateMotionStyle from './explain';

export interface ComponentToken {
  /**
   * @desc 必填项标记颜色
   * @descEN Required mark color
   */
  labelRequiredMarkColor: string;
  /**
   * @desc 标签颜色
   * @descEN Label color
   */
  labelColor: string;
  /**
   * @desc 标签字体大小
   * @descEN Label font size
   */
  labelFontSize: number;
  /**
   * @desc 标签高度
   * @descEN Label height
   */
  labelHeight: number | string;
  /**
   * @desc 标签冒号前间距
   * @descEN Label colon margin-inline-start
   */
  labelColonMarginInlineStart: number;
  /**
   * @desc 标签冒号后间距
   * @descEN Label colon margin-inline-end
   */
  labelColonMarginInlineEnd: number;
  /**
   * @desc 表单项间距
   * @descEN Form item margin bottom
   */
  itemMarginBottom: number;
  /**
   * @desc 行内布局表单项间距
   * @descEN Inline layout form item margin bottom
   */
  inlineItemMarginBottom: number;
  /**
   * @desc 垂直布局标签内边距
   * @descEN Vertical layout label padding
   */
  verticalLabelPadding: CSSProperties['padding'];
  /**
   * @desc 垂直布局标签外边距
   * @descEN Vertical layout label margin
   */
  verticalLabelMargin: CSSProperties['margin'];
}

/**
 * @desc Form 组件的 Token
 * @descEN Token for Form component
 */
export interface FormToken extends FullToken<'Form'> {
  /**
   * @desc 表单项类名
   * @descEN Form item class name
   */
  formItemCls: string;
  /**
   * @desc 根前缀类名
   * @descEN Root prefix class name
   */
  rootPrefixCls: string;
}

const resetForm = (token: AliasToken): CSSObject => ({
  legend: {
    display: 'block',
    width: '100%',
    marginBottom: token.marginLG,
    padding: 0,
    color: token.colorTextDescription,
    fontSize: token.fontSizeLG,
    lineHeight: 'inherit',
    border: 0,
    borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.colorBorder}`,
  },

  'input[type="search"]': {
    boxSizing: 'border-box',
  },

  // Position radios and checkboxes better
  'input[type="radio"], input[type="checkbox"]': {
    lineHeight: 'normal',
  },

  'input[type="file"]': {
    display: 'block',
  },

  // Make range inputs behave like textual form controls
  'input[type="range"]': {
    display: 'block',
    width: '100%',
  },

  // Make multiple select elements height not fixed
  'select[multiple], select[size]': {
    height: 'auto',
  },

  // Focus for file, radio, and checkbox
  [`input[type='file']:focus,
  input[type='radio']:focus,
  input[type='checkbox']:focus`]: {
    outline: 0,
    boxShadow: `0 0 0 ${unit(token.controlOutlineWidth)} ${token.controlOutline}`,
  },

  // Adjust output element
  output: {
    display: 'block',
    paddingTop: 15,
    color: token.colorText,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
  },
});

const genFormSize = (token: FormToken, height: number): CSSObject => {
  const { formItemCls } = token;

  return {
    [formItemCls]: {
      [`${formItemCls}-label > label`]: {
        height,
      },

      [`${formItemCls}-control-input`]: {
        minHeight: height,
      },
    },
  };
};

const genFormStyle: GenerateStyle<FormToken> = (token) => {
  const { componentCls } = token;

  return {
    [token.componentCls]: {
      ...resetComponent(token),
      ...resetForm(token),

      [`${componentCls}-text`]: {
        display: 'inline-block',
        paddingInlineEnd: token.paddingSM,
      },

      // ================================================================
      // =                             Size                             =
      // ================================================================
      '&-small': {
        ...genFormSize(token, token.controlHeightSM),
      },

      '&-large': {
        ...genFormSize(token, token.controlHeightLG),
      },
    },
  };
};

const genFormItemStyle: GenerateStyle<FormToken> = (token) => {
  const {
    formItemCls,
    iconCls,
    componentCls,
    rootPrefixCls,
    antCls,
    labelRequiredMarkColor,
    labelColor,
    labelFontSize,
    labelHeight,
    labelColonMarginInlineStart,
    labelColonMarginInlineEnd,
    itemMarginBottom,
  } = token;

  return {
    [formItemCls]: {
      ...resetComponent(token),

      marginBottom: itemMarginBottom,
      verticalAlign: 'top',

      '&-with-help': {
        transition: 'none',
      },

      [`&-hidden,
        &-hidden${antCls}-row`]: {
        // https://github.com/ant-design/ant-design/issues/26141
        display: 'none',
      },

      '&-has-warning': {
        [`${formItemCls}-split`]: {
          color: token.colorError,
        },
      },

      '&-has-error': {
        [`${formItemCls}-split`]: {
          color: token.colorWarning,
        },
      },

      // ==============================================================
      // =                            Label                           =
      // ==============================================================
      [`${formItemCls}-label`]: {
        flexGrow: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textAlign: 'end',
        verticalAlign: 'middle',

        '&-left': {
          textAlign: 'start',
        },

        '&-wrap': {
          overflow: 'unset',
          lineHeight: token.lineHeight,
          whiteSpace: 'unset',
        },

        '> label': {
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: '100%',
          height: labelHeight,
          color: labelColor,
          fontSize: labelFontSize,

          [`> ${iconCls}`]: {
            fontSize: token.fontSize,
            verticalAlign: 'top',
          },

          // Required mark
          [`&${formItemCls}-required:not(${formItemCls}-required-mark-optional)::before`]: {
            display: 'inline-block',
            marginInlineEnd: token.marginXXS,
            color: labelRequiredMarkColor,
            fontSize: token.fontSize,
            fontFamily: 'SimSun, sans-serif',
            lineHeight: 1,
            content: '"*"',

            [`${componentCls}-hide-required-mark &`]: {
              display: 'none',
            },
          },

          // Optional mark
          [`${formItemCls}-optional`]: {
            display: 'inline-block',
            marginInlineStart: token.marginXXS,
            color: token.colorTextDescription,

            [`${componentCls}-hide-required-mark &`]: {
              display: 'none',
            },
          },

          // Optional mark
          [`${formItemCls}-tooltip`]: {
            color: token.colorTextDescription,
            cursor: 'help',
            writingMode: 'horizontal-tb',
            marginInlineStart: token.marginXXS,
          },

          '&::after': {
            content: '":"',
            position: 'relative',
            marginBlock: 0,
            marginInlineStart: labelColonMarginInlineStart,
            marginInlineEnd: labelColonMarginInlineEnd,
          },

          [`&${formItemCls}-no-colon::after`]: {
            content: '"\\a0"',
          },
        },
      },

      // ==============================================================
      // =                            Input                           =
      // ==============================================================
      [`${formItemCls}-control`]: {
        ['--ant-display' as any]: 'flex',
        flexDirection: 'column',
        flexGrow: 1,

        [`&:first-child:not([class^="'${rootPrefixCls}-col-'"]):not([class*="' ${rootPrefixCls}-col-'"])`]:
          {
            width: '100%',
          },

        '&-input': {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: token.controlHeight,

          '&-content': {
            flex: 'auto',
            maxWidth: '100%',
          },
        },
      },

      // ==============================================================
      // =                           Explain                          =
      // ==============================================================
      [formItemCls]: {
        '&-additional': {
          display: 'flex',
          flexDirection: 'column',
        },

        '&-explain, &-extra': {
          clear: 'both',
          color: token.colorTextDescription,
          fontSize: token.fontSize,
          lineHeight: token.lineHeight,
        },

        '&-explain-connected': {
          width: '100%',
        },

        '&-extra': {
          minHeight: token.controlHeightSM,
          transition: `color ${token.motionDurationMid} ${token.motionEaseOut}`, // sync input color transition
        },

        '&-explain': {
          '&-error': {
            color: token.colorError,
          },

          '&-warning': {
            color: token.colorWarning,
          },
        },
      },

      [`&-with-help ${formItemCls}-explain`]: {
        height: 'auto',
        opacity: 1,
      },

      // ==============================================================
      // =                        Feedback Icon                       =
      // ==============================================================
      [`${formItemCls}-feedback-icon`]: {
        fontSize: token.fontSize,
        textAlign: 'center',
        visibility: 'visible',
        animationName: zoomIn,
        animationDuration: token.motionDurationMid,
        animationTimingFunction: token.motionEaseOutBack,
        pointerEvents: 'none',

        '&-success': {
          color: token.colorSuccess,
        },

        '&-error': {
          color: token.colorError,
        },

        '&-warning': {
          color: token.colorWarning,
        },

        '&-validating': {
          color: token.colorPrimary,
        },
      },
    },
  };
};

const genHorizontalStyle = (token: FormToken, className: string): CSSObject => {
  const { formItemCls } = token;

  return {
    [`${className}-horizontal`]: {
      [`${formItemCls}-label`]: {
        flexGrow: 0,
      },

      [`${formItemCls}-control`]: {
        flex: '1 1 0',
        // https://github.com/ant-design/ant-design/issues/32777
        // https://github.com/ant-design/ant-design/issues/33773
        minWidth: 0,
      },

      // Do not change this to `ant-col-24`! `-24` match all the responsive rules
      // https://github.com/ant-design/ant-design/issues/32980
      // https://github.com/ant-design/ant-design/issues/34903
      // https://github.com/ant-design/ant-design/issues/44538
      [`${formItemCls}-label[class$='-24'], ${formItemCls}-label[class*='-24 ']`]: {
        [`& + ${formItemCls}-control`]: {
          minWidth: 'unset',
        },
      },
    },
  };
};

const genInlineStyle: GenerateStyle<FormToken> = (token) => {
  const { componentCls, formItemCls, inlineItemMarginBottom } = token;

  return {
    [`${componentCls}-inline`]: {
      display: 'flex',
      flexWrap: 'wrap',

      [formItemCls]: {
        flex: 'none',
        marginInlineEnd: token.margin,
        marginBottom: inlineItemMarginBottom,

        '&-row': {
          flexWrap: 'nowrap',
        },

        [`> ${formItemCls}-label,
        > ${formItemCls}-control`]: {
          display: 'inline-block',
          verticalAlign: 'top',
        },

        [`> ${formItemCls}-label`]: {
          flex: 'none',
        },

        [`${componentCls}-text`]: {
          display: 'inline-block',
        },

        [`${formItemCls}-has-feedback`]: {
          display: 'inline-block',
        },
      },
    },
  };
};

const makeVerticalLayoutLabel = (token: FormToken): CSSObject => ({
  padding: token.verticalLabelPadding,
  margin: token.verticalLabelMargin,
  whiteSpace: 'initial',
  textAlign: 'start',

  '> label': {
    margin: 0,

    '&::after': {
      // https://github.com/ant-design/ant-design/issues/43538
      visibility: 'hidden',
    },
  },
});

const makeVerticalLayout = (token: FormToken): CSSObject => {
  const { componentCls, formItemCls, rootPrefixCls } = token;

  return {
    [`${formItemCls} ${formItemCls}-label`]: makeVerticalLayoutLabel(token),
    // ref: https://github.com/ant-design/ant-design/issues/45122
    [`${componentCls}:not(${componentCls}-inline)`]: {
      [formItemCls]: {
        flexWrap: 'wrap',

        [`${formItemCls}-label, ${formItemCls}-control`]: {
          // When developer pass `xs: { span }`,
          // It should follow the `xs` screen config
          // ref: https://github.com/ant-design/ant-design/issues/44386
          [`&:not([class*=" ${rootPrefixCls}-col-xs"])`]: {
            flex: '0 0 100%',
            maxWidth: '100%',
          },
        },
      },
    },
  };
};

const genVerticalStyle: GenerateStyle<FormToken> = (token) => {
  const { componentCls, formItemCls, antCls } = token;

  return {
    [`${componentCls}-vertical`]: {
      [`${formItemCls}:not(${formItemCls}-horizontal)`]: {
        [`${formItemCls}-row`]: {
          flexDirection: 'column',
        },

        [`${formItemCls}-label > label`]: {
          height: 'auto',
        },

        [`${formItemCls}-control`]: {
          width: '100%',
        },
        [`${formItemCls}-label,
        ${antCls}-col-24${formItemCls}-label,
        ${antCls}-col-xl-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
      },
    },

    [`@media (max-width: ${unit(token.screenXSMax)})`]: [
      makeVerticalLayout(token),
      {
        [componentCls]: {
          [`${formItemCls}:not(${formItemCls}-horizontal)`]: {
            [`${antCls}-col-xs-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
          },
        },
      },
    ],

    [`@media (max-width: ${unit(token.screenSMMax)})`]: {
      [componentCls]: {
        [`${formItemCls}:not(${formItemCls}-horizontal)`]: {
          [`${antCls}-col-sm-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
        },
      },
    },

    [`@media (max-width: ${unit(token.screenMDMax)})`]: {
      [componentCls]: {
        [`${formItemCls}:not(${formItemCls}-horizontal)`]: {
          [`${antCls}-col-md-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
        },
      },
    },

    [`@media (max-width: ${unit(token.screenLGMax)})`]: {
      [componentCls]: {
        [`${formItemCls}:not(${formItemCls}-horizontal)`]: {
          [`${antCls}-col-lg-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
        },
      },
    },
  };
};

const genItemVerticalStyle: GenerateStyle<FormToken> = (token) => {
  const { formItemCls, antCls } = token;
  return {
    [`${formItemCls}-vertical`]: {
      [`${formItemCls}-row`]: {
        flexDirection: 'column',
      },

      [`${formItemCls}-label > label`]: {
        height: 'auto',
      },

      [`${formItemCls}-control`]: {
        width: '100%',
        flex: 'none',
      },
    },

    [`${formItemCls}-vertical ${formItemCls}-label,
      ${antCls}-col-24${formItemCls}-label,
      ${antCls}-col-xl-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),

    [`@media (max-width: ${unit(token.screenXSMax)})`]: [
      makeVerticalLayout(token),
      {
        [formItemCls]: {
          [`${antCls}-col-xs-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
        },
      },
    ],

    [`@media (max-width: ${unit(token.screenSMMax)})`]: {
      [formItemCls]: {
        [`${antCls}-col-sm-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
      },
    },

    [`@media (max-width: ${unit(token.screenMDMax)})`]: {
      [formItemCls]: {
        [`${antCls}-col-md-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
      },
    },

    [`@media (max-width: ${unit(token.screenLGMax)})`]: {
      [formItemCls]: {
        [`${antCls}-col-lg-24${formItemCls}-label`]: makeVerticalLayoutLabel(token),
      },
    },
  };
};

// ============================== Export ==============================
export const prepareComponentToken: GetDefaultToken<'Form'> = (token) => ({
  labelRequiredMarkColor: token.colorError,
  labelColor: token.colorTextHeading,
  labelFontSize: token.fontSize,
  labelHeight: token.controlHeight,
  labelColonMarginInlineStart: token.marginXXS / 2,
  labelColonMarginInlineEnd: token.marginXS,
  itemMarginBottom: token.marginLG,
  verticalLabelPadding: `0 0 ${token.paddingXS}px`,
  verticalLabelMargin: 0,
  inlineItemMarginBottom: 0,
});

export const prepareToken: (
  token: Parameters<GenStyleFn<'Form'>>[0],
  rootPrefixCls: string,
) => FormToken = (token, rootPrefixCls) => {
  const formToken = mergeToken<FormToken>(token, {
    formItemCls: `${token.componentCls}-item`,
    rootPrefixCls,
  });

  return formToken;
};

export default genStyleHooks(
  'Form',
  (token, { rootPrefixCls }) => {
    const formToken = prepareToken(token, rootPrefixCls);

    return [
      genFormStyle(formToken),
      genFormItemStyle(formToken),
      genFormValidateMotionStyle(formToken),
      genHorizontalStyle(formToken, formToken.componentCls),
      genHorizontalStyle(formToken, formToken.formItemCls),
      genInlineStyle(formToken),
      genVerticalStyle(formToken),
      genItemVerticalStyle(formToken),
      genCollapseMotion(formToken),
      zoomIn,
    ];
  },
  prepareComponentToken,
  {
    // Let From style before the Grid
    // ref https://github.com/ant-design/ant-design/issues/44386
    order: -1000,
  },
);
