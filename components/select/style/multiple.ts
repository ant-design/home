import type { CSSInterpolation, CSSObject } from '@ant-design/cssinjs';
import { unit } from '@ant-design/cssinjs';

import { resetIcon } from '../../style';
import { mergeToken } from '../../theme/internal';
import type { AliasToken, TokenWithCommonCls } from '../../theme/internal';
import type { SelectToken } from './token';

type SelectItemToken = Pick<
  SelectToken,
  | 'multipleSelectItemHeight'
  | 'multipleSelectorBgDisabled'
  | 'multipleItemColorDisabled'
  | 'multipleItemBorderColorDisabled'
  | 'selectHeight'
  | 'lineWidth'
  | 'calc'
  | 'inputPaddingHorizontalBase'
  | 'INTERNAL_FIXED_ITEM_MARGIN'
  | 'selectAffixPadding'
>;

/**
 * Get multiple selector needed style. The calculation:
 *
 * ContainerPadding = BasePadding - ItemMargin
 *
 * Border:                    ╔═══════════════════════════╗                 ┬
 * ContainerPadding:          ║                           ║                 │
 *                            ╟───────────────────────────╢     ┬           │
 * Item Margin:               ║                           ║     │           │
 *                            ║             ┌──────────┐  ║     │           │
 * Item(multipleItemHeight):  ║ BasePadding │   Item   │  ║  Overflow  Container(ControlHeight)
 *                            ║             └──────────┘  ║     │           │
 * Item Margin:               ║                           ║     │           │
 *                            ╟───────────────────────────╢     ┴           │
 * ContainerPadding:          ║                           ║                 │
 * Border:                    ╚═══════════════════════════╝                 ┴
 */
export const getMultipleSelectorUnit = (
  token: Pick<
    SelectToken,
    | 'max'
    | 'calc'
    | 'multipleSelectItemHeight'
    | 'paddingXXS'
    | 'lineWidth'
    | 'INTERNAL_FIXED_ITEM_MARGIN'
  >,
) => {
  const { multipleSelectItemHeight, paddingXXS, lineWidth, INTERNAL_FIXED_ITEM_MARGIN } = token;

  const basePadding = token.max(token.calc(paddingXXS).sub(lineWidth).equal(), 0);
  const containerPadding = token.max(
    token.calc(basePadding).sub(INTERNAL_FIXED_ITEM_MARGIN).equal(),
    0,
  );

  return {
    basePadding,
    containerPadding,
    itemHeight: unit(multipleSelectItemHeight),
    itemLineHeight: unit(
      token.calc(multipleSelectItemHeight).sub(token.calc(token.lineWidth).mul(2)).equal(),
    ),
  };
};

const getSelectItemStyle = (token: SelectItemToken): number | string => {
  const { multipleSelectItemHeight, selectHeight, lineWidth } = token;
  const selectItemDist = token
    .calc(selectHeight)
    .sub(multipleSelectItemHeight)
    .div(2)
    .sub(lineWidth)
    .equal();
  return selectItemDist;
};

/**
 * Get the `rc-overflow` needed style.
 * It's a share style which means not affected by `size`.
 */
export const genOverflowStyle = (
  token: Pick<
    SelectToken,
    | 'calc'
    | 'componentCls'
    | 'iconCls'
    | 'borderRadiusSM'
    | 'motionDurationSlow'
    | 'paddingXS'
    | 'multipleItemColorDisabled'
    | 'multipleItemBorderColorDisabled'
    | 'colorIcon'
    | 'colorIconHover'
    | 'INTERNAL_FIXED_ITEM_MARGIN'
  >,
): CSSObject => {
  const {
    componentCls,
    iconCls,
    borderRadiusSM,
    motionDurationSlow,
    paddingXS,
    multipleItemColorDisabled,
    multipleItemBorderColorDisabled,
    colorIcon,
    colorIconHover,
    INTERNAL_FIXED_ITEM_MARGIN,
  } = token;

  const selectOverflowPrefixCls = `${componentCls}-selection-overflow`;

  return {
    /**
     * Do not merge `height` & `line-height` under style with `selection` & `search`, since chrome
     * may update to redesign with its align logic.
     */
    // =========================== Overflow ===========================
    [selectOverflowPrefixCls]: {
      position: 'relative',
      display: 'flex',
      flex: 'auto',
      flexWrap: 'wrap',
      maxWidth: '100%',

      '&-item': {
        flex: 'none',
        alignSelf: 'center',
        maxWidth: '100%',
        display: 'inline-flex',
      },

      // ======================== Selections ==========================
      [`${componentCls}-selection-item`]: {
        display: 'flex',
        alignSelf: 'center',
        flex: 'none',
        boxSizing: 'border-box',
        maxWidth: '100%',
        marginBlock: INTERNAL_FIXED_ITEM_MARGIN,
        borderRadius: borderRadiusSM,
        cursor: 'default',
        transition: `font-size ${motionDurationSlow}, line-height ${motionDurationSlow}, height ${motionDurationSlow}`,
        marginInlineEnd: token.calc(INTERNAL_FIXED_ITEM_MARGIN).mul(2).equal(),
        paddingInlineStart: paddingXS,
        paddingInlineEnd: token.calc(paddingXS).div(2).equal(),

        [`${componentCls}-disabled&`]: {
          color: multipleItemColorDisabled,
          borderColor: multipleItemBorderColorDisabled,
          cursor: 'not-allowed',
        },

        // It's ok not to do this, but 24px makes bottom narrow in view should adjust
        '&-content': {
          display: 'inline-block',
          marginInlineEnd: token.calc(paddingXS).div(2).equal(),
          overflow: 'hidden',
          whiteSpace: 'pre', // fix whitespace wrapping. custom tags display all whitespace within.
          textOverflow: 'ellipsis',
        },

        '&-remove': {
          ...resetIcon(),

          display: 'inline-flex',
          alignItems: 'center',
          color: colorIcon,
          fontWeight: 'bold',
          fontSize: 10,
          lineHeight: 'inherit',
          cursor: 'pointer',

          [`> ${iconCls}`]: {
            verticalAlign: '-0.2em',
          },

          '&:hover': {
            color: colorIconHover,
          },
        },
      },
    },
  };
};

const genSelectionStyle = (
  token: TokenWithCommonCls<AliasToken> & SelectItemToken,
  suffix?: string,
): CSSObject => {
  const { componentCls, INTERNAL_FIXED_ITEM_MARGIN } = token;

  const selectOverflowPrefixCls = `${componentCls}-selection-overflow`;

  const selectItemHeight = token.multipleSelectItemHeight;
  const selectItemDist = getSelectItemStyle(token);

  const suffixCls = suffix ? `${componentCls}-${suffix}` : '';

  const multipleSelectorUnit = getMultipleSelectorUnit(token);

  return {
    [`${componentCls}-multiple${suffixCls}`]: {
      // ========================= Overflow =========================
      ...genOverflowStyle(token),

      // ========================= Selector =========================
      [`${componentCls}-selector`]: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        // Multiple is little different that horizontal is follow the vertical
        paddingInline: multipleSelectorUnit.basePadding,
        paddingBlock: multipleSelectorUnit.containerPadding,
        borderRadius: token.borderRadius,

        [`${componentCls}-disabled&`]: {
          background: token.multipleSelectorBgDisabled,
          cursor: 'not-allowed',
        },

        '&:after': {
          display: 'inline-block',
          width: 0,
          margin: `${unit(INTERNAL_FIXED_ITEM_MARGIN)} 0`,
          lineHeight: unit(selectItemHeight),
          visibility: 'hidden',
          content: '"\\a0"',
        },
      },

      [`${componentCls}-selection-wrap`]: {
        width: '100%',
        overflow: 'hidden',
      },

      // ======================== Selections ========================
      [`${componentCls}-selection-item`]: {
        height: multipleSelectorUnit.itemHeight,
        lineHeight: unit(multipleSelectorUnit.itemLineHeight),
      },

      // ========================== Input ==========================
      [`${selectOverflowPrefixCls}-item + ${selectOverflowPrefixCls}-item`]: {
        [`${componentCls}-selection-search`]: {
          marginInlineStart: 0,
        },
      },

      // https://github.com/ant-design/ant-design/issues/44754
      [`${selectOverflowPrefixCls}-item-suffix`]: {
        height: '100%',
        // https://github.com/ant-design/ant-design/issues/51037
        flexGrow: 1,
      },

      [`${componentCls}-selection-search`]: {
        display: 'inline-flex',
        position: 'relative',
        maxWidth: '100%',
        marginInlineStart: token.calc(token.inputPaddingHorizontalBase).sub(selectItemDist).equal(),
        flexGrow: 1,

        [`
          &-input,
          &-mirror
        `]: {
          height: selectItemHeight,
          fontFamily: token.fontFamily,
          lineHeight: unit(selectItemHeight),
          transition: `all ${token.motionDurationSlow}`,
        },

        '&-input': {
          width: '100%',
          minWidth: 4.1, // fix search cursor missing
        },

        '&-mirror': {
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 'auto',
          zIndex: 999,
          whiteSpace: 'pre', // fix whitespace wrapping caused width calculation bug
          visibility: 'hidden',
        },
      },

      // ======================= Placeholder =======================
      [`${componentCls}-selection-placeholder`]: {
        position: 'absolute',
        top: '50%',
        insetInlineStart: token.inputPaddingHorizontalBase,
        insetInlineEnd: token.inputPaddingHorizontalBase,
        transform: 'translateY(-50%)',
        transition: `all ${token.motionDurationSlow}`,
      },

      [`${componentCls}-prefix`]: {
        height: multipleSelectorUnit.itemHeight,
        lineHeight: unit(multipleSelectorUnit.itemLineHeight),
        marginInlineStart: `calc(${unit(token.inputPaddingHorizontalBase)} - ${unit(multipleSelectorUnit.basePadding)})`,
        marginInlineEnd: token.selectAffixPadding,
      },
    },
  };
};

function genSizeStyle(token: SelectToken, suffix?: string): CSSInterpolation {
  const { componentCls } = token;

  const suffixCls = suffix ? `${componentCls}-${suffix}` : '';

  const rawStyle: CSSObject = {
    [`${componentCls}-multiple${suffixCls}`]: {
      fontSize: token.fontSize,

      // ========================= Selector =========================
      [`${componentCls}-selector`]: {
        [`${componentCls}-show-search&`]: {
          cursor: 'text',
        },
      },

      [`
        &${componentCls}-show-arrow ${componentCls}-selector,
        &${componentCls}-allow-clear ${componentCls}-selector
      `]: {
        paddingInlineEnd: token
          .calc(token.fontSizeIcon)
          .add(token.controlPaddingHorizontal)
          .equal(),
      },
    },
  };

  return [genSelectionStyle(token, suffix), rawStyle];
}

const genMultipleStyle = (token: SelectToken): CSSInterpolation => {
  const { componentCls } = token;

  const smallToken = mergeToken<SelectToken>(token, {
    selectHeight: token.controlHeightSM,
    multipleSelectItemHeight: token.multipleItemHeightSM,
    borderRadius: token.borderRadiusSM,
    borderRadiusSM: token.borderRadiusXS,
  });

  const largeToken = mergeToken<SelectToken>(token, {
    fontSize: token.fontSizeLG,
    selectHeight: token.controlHeightLG,
    multipleSelectItemHeight: token.multipleItemHeightLG,
    borderRadius: token.borderRadiusLG,
    borderRadiusSM: token.borderRadius,
  });

  return [
    genSizeStyle(token),
    // ======================== Small ========================
    genSizeStyle(smallToken, 'sm'),

    // Padding
    {
      [`${componentCls}-multiple${componentCls}-sm`]: {
        [`${componentCls}-selection-placeholder`]: {
          insetInline: token.calc(token.controlPaddingHorizontalSM).sub(token.lineWidth).equal(),
        },

        // https://github.com/ant-design/ant-design/issues/29559
        [`${componentCls}-selection-search`]: {
          marginInlineStart: 2, // Magic Number
        },
      },
    },

    // ======================== Large ========================
    genSizeStyle(largeToken, 'lg'),
  ];
};

export default genMultipleStyle;
