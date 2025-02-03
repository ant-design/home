import type { CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import type { StepsToken } from '.';
import type { GenerateStyle } from '../../theme/internal';

const genStepsProgressStyle: GenerateStyle<StepsToken, CSSObject> = (token) => {
  const {
    antCls,
    componentCls,
    iconSize,
    iconSizeSM,
    processIconColor,
    marginXXS,
    lineWidthBold,
    lineWidth,
    paddingXXS,
  } = token;

  const progressSize = token.calc(iconSize).add(token.calc(lineWidthBold).mul(4).equal()).equal();
  const progressSizeSM = token
    .calc(iconSizeSM)
    .add(token.calc(token.lineWidth).mul(4).equal())
    .equal();

  return {
    [`&${componentCls}-with-progress`]: {
      [`${componentCls}-item`]: {
        paddingTop: paddingXXS,

        [`&-process ${componentCls}-item-container ${componentCls}-item-icon ${componentCls}-icon`]:
          {
            color: processIconColor,
          },
      },

      [`&${componentCls}-vertical > ${componentCls}-item `]: {
        paddingInlineStart: paddingXXS,
        [`> ${componentCls}-item-container > ${componentCls}-item-tail`]: {
          top: marginXXS,
          insetInlineStart: token.calc(iconSize).div(2).sub(lineWidth).add(paddingXXS).equal(),
        },
      },

      [`&, &${componentCls}-small`]: {
        [`&${componentCls}-horizontal ${componentCls}-item:first-child`]: {
          paddingBottom: paddingXXS,
          paddingInlineStart: paddingXXS,
        },
      },

      [`&${componentCls}-small${componentCls}-vertical > ${componentCls}-item > ${componentCls}-item-container > ${componentCls}-item-tail`]:
        {
          insetInlineStart: token.calc(iconSizeSM).div(2).sub(lineWidth).add(paddingXXS).equal(),
        },

      [`&${componentCls}-label-vertical ${componentCls}-item ${componentCls}-item-tail`]: {
        top: token.calc(iconSize).div(2).add(paddingXXS).equal(),
      },

      [`${componentCls}-item-icon`]: {
        position: 'relative',

        [`${antCls}-progress`]: {
          position: 'absolute',
          insetInlineStart: '50%',
          top: '50%',
          transform: 'translate(50%, -50%)',

          '&-inner': {
            width: `${unit(progressSize)} !important`,
            height: `${unit(progressSize)} !important`,
          },
        },
      },

      // ============================== Small size ==============================
      [`&${componentCls}-small`]: {
        [`&${componentCls}-label-vertical ${componentCls}-item ${componentCls}-item-tail`]: {
          top: token.calc(iconSizeSM).div(2).add(paddingXXS).equal(),
        },

        [`${componentCls}-item-icon ${antCls}-progress-inner`]: {
          width: `${unit(progressSizeSM)} !important`,
          height: `${unit(progressSizeSM)} !important`,
        },
      },
    },
  };
};

export default genStepsProgressStyle;
