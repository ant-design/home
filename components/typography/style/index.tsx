// deps-lint-skip-all
import type { CSSInterpolation } from '@ant-design/cssinjs';
import { useStyleRegister, useToken } from '../../_util/theme';
import { operationUnit } from '../../_util/theme/util/operationUnit';
import {
  getTitleStyles,
  getResetStyles,
  getEditableStyles,
  getCopiableStyles,
  getEllipsisStyles,
} from './mixins';
import type { TypographyToken } from './mixins';

const genTypographyStyle = ({
  prefixCls,
  token,
}: {
  prefixCls: string;
  token: TypographyToken;
}): CSSInterpolation => ({
  [`.${prefixCls}`]: {
    color: token.textColor,
    overflowWrap: 'break-word',
    '&&-secondary': {
      color: token.textColorSecondary,
    },

    '&&-success': {
      color: token.successColor,
    },

    '&&-warning': {
      color: token.warningColor,
    },

    '&&-danger': {
      color: token.errorColor,
      'a&:active, a&:focus, a&:hover': {
        color: token.errorColors[4],
      },
    },

    '&&-disabled': {
      color: token.disabledColor,
      cursor: 'not-allowed',
      userSelect: 'none',
    },

    [`
      div&,
      p
    `]: {
      marginBottom: '1em',
    },

    ...getTitleStyles(token),

    [`
    & + h1&,
    & + h2&,
    & + h3&,
    & + h4&,
    & + h5&
    `]: {
      marginTop: token.typography.titleMarginTop,
    },

    [`
    div,
    ul,
    li,
    p,
    h1,
    h2,
    h3,
    h4,
    h5`]: {
      [`
      + h1,
      + h2,
      + h3,
      + h4,
      + h5
      `]: {
        marginTop: token.typography.titleMarginTop,
      },
    },

    ...getResetStyles(),

    // Operation
    [`
    .${prefixCls}-expand,
    .${prefixCls}-edit,
    .${prefixCls}-copy
    `]: {
      ...operationUnit(token),
      marginInlineStart: 4,
    },

    ...getEditableStyles(token),

    ...getCopiableStyles(token),

    ...getEllipsisStyles(),

    '&-rtl': {
      direction: 'rtl',
    },
  },
});

// ============================== Export ==============================
export default function useStyle(prefixCls: string) {
  const [theme, token, hashId] = useToken();

  const typographyToken: TypographyToken = {
    ...token,
    typography: {
      titleMarginTop: '1.2em',
      titleMarginBottom: '0.5em',
      titleFontWeight: 600,
    },
  };

  return [
    useStyleRegister({ theme, token, hashId, path: [prefixCls] }, () => [
      genTypographyStyle({ prefixCls, token: typographyToken }),
    ]),
    hashId,
  ];
}
