// Style as confirm component
import { unit } from '@ant-design/cssinjs';

import { prepareComponentToken, prepareToken } from '.';
import type { ModalToken } from '.';
import { clearFix } from '../../style';
import { genSubStyleComponent } from '../../theme/internal';
import type { GenerateStyle } from '../../theme/internal';

// ============================= Confirm ==============================

const genModalConfirmStyle: GenerateStyle<ModalToken> = (token) => {
  const {
    componentCls,
    titleFontSize,
    titleLineHeight,
    modalConfirmIconSize,
    fontSize,
    lineHeight,
    modalTitleHeight,
    fontHeight,
    confirmBodyPadding,
  } = token;
  const confirmComponentCls = `${componentCls}-confirm`;

  return {
    [confirmComponentCls]: {
      '&-rtl': {
        direction: 'rtl',
      },
      [`${token.antCls}-modal-header`]: {
        display: 'none',
      },
      [`${confirmComponentCls}-body-wrapper`]: {
        ...clearFix(),
      },
      [`&${componentCls} ${componentCls}-body`]: {
        padding: confirmBodyPadding,
      },

      // ====================== Body ======================
      [`${confirmComponentCls}-body`]: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'start',

        [`> ${confirmComponentCls}-icon`]: {
          display: 'flex',
          flex: 'none',
          fontSize: modalConfirmIconSize,
          marginInlineEnd: token.confirmIconMarginInlineEnd,
          marginTop: token
            .calc(token.calc(fontHeight).sub(modalConfirmIconSize).equal())
            .div(2)
            .equal(),
        },
        [`&-has-title > ${confirmComponentCls}-icon`]: {
          marginTop: token
            .calc(token.calc(modalTitleHeight).sub(modalConfirmIconSize).equal())
            .div(2)
            .equal(),
        },
      },

      [`${confirmComponentCls}-paragraph`]: {
        display: 'flex',
        flexDirection: 'column',
        flex: 'auto',
        rowGap: token.marginXS,
        // https://github.com/ant-design/ant-design/issues/51912
        maxWidth: `calc(100% - ${unit(token.marginSM)})`,
      },

      // https://github.com/ant-design/ant-design/issues/48159
      [`${confirmComponentCls}-icon + ${confirmComponentCls}-paragraph`]: {
        maxWidth: `calc(100% - ${unit(
          token.calc(token.modalConfirmIconSize).add(token.marginSM).equal(),
        )})`,
      },

      [`${confirmComponentCls}-title`]: {
        color: token.colorTextHeading,
        fontWeight: token.fontWeightStrong,
        fontSize: titleFontSize,
        lineHeight: titleLineHeight,
      },

      [`${confirmComponentCls}-content`]: {
        color: token.colorText,
        fontSize,
        lineHeight,
      },

      // ===================== Footer =====================
      [`${confirmComponentCls}-btns`]: {
        textAlign: 'end',
        marginTop: token.confirmBtnsMarginTop,

        [`${token.antCls}-btn + ${token.antCls}-btn`]: {
          marginBottom: 0,
          marginInlineStart: token.marginXS,
        },
      },
    },

    [`${confirmComponentCls}-error ${confirmComponentCls}-body > ${confirmComponentCls}-icon`]: {
      color: token.colorError,
    },

    [`${confirmComponentCls}-warning ${confirmComponentCls}-body > ${confirmComponentCls}-icon,
        ${confirmComponentCls}-confirm ${confirmComponentCls}-body > ${confirmComponentCls}-icon`]:
      {
        color: token.colorWarning,
      },

    [`${confirmComponentCls}-info ${confirmComponentCls}-body > ${confirmComponentCls}-icon`]: {
      color: token.colorInfo,
    },

    [`${confirmComponentCls}-success ${confirmComponentCls}-body > ${confirmComponentCls}-icon`]: {
      color: token.colorSuccess,
    },
  };
};

// ============================== Export ==============================
export default genSubStyleComponent(
  ['Modal', 'confirm'],
  (token) => {
    const modalToken = prepareToken(token);

    return [genModalConfirmStyle(modalToken)];
  },
  prepareComponentToken,
  {
    // confirm is weak than modal since no conflict here
    order: -1000,
  },
);
