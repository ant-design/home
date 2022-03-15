/*
.typography-title(@fontSize; @fontWeight; @lineHeight; @headingColor; @headingMarginBottom;) {
  margin-bottom: @headingMarginBottom;
  color: @headingColor;
  font-weight: @fontWeight;
  fontSize: @fontSize;
  line-height: @lineHeight;
}
*/
import { gold } from '@ant-design/colors';
import type { CSSObject } from '@ant-design/cssinjs';
import type { DerivativeToken, GenerateStyle } from '../../_util/theme';
import { initInputToken } from '../../input/style';

export interface TypographyToken extends DerivativeToken {
  typography: {
    prefixCls: string;
    titleMarginTop: string;
    titleMarginBottom: string;
    titleFontWeight: number;
  };
}

// eslint-disable-next-line import/prefer-default-export
const getTitleStyle = ({
  fontSize,
  lineHeight,
  color,
  typographyToken,
}: {
  fontSize: number;
  lineHeight: number;
  color: string;
  typographyToken: TypographyToken['typography'];
}) => ({
  marginBottom: typographyToken.titleMarginBottom,
  color,
  fontWeight: typographyToken.titleFontWeight,
  fontSize,
  lineHeight,
});

// eslint-disable-next-line import/prefer-default-export
export const getTitleStyles: GenerateStyle<TypographyToken, CSSObject> = token => {
  const lineHeights = [1.23, 1.35, 1.35, 1.4, 1.5];
  const styles = {} as CSSObject;
  lineHeights.forEach((lineHeight, i) => {
    styles[
      `
      h${i + 1}&,
      div&-h${i + 1},
      div&-h${i + 1} > textarea,
      h${i + 1}
    `
    ] = getTitleStyle({
      fontSize: (token as any)[`heading${i + 1}Size`],
      lineHeight,
      color: token.headingColor,
      typographyToken: token.typography,
    });
  });
  return styles;
};

export const getResetStyles = (): CSSObject => ({
  code: {
    margin: '0 0.2em',
    paddingInline: '0.1em 0.2em',
    paddingBlock: '0.4em',
    fontSize: '85%',
    background: 'rgba(150, 150, 150, 0.1)',
    border: '1px solid rgba(100, 100, 100, 0.2)',
    borderRadius: 3,
  },

  kbd: {
    margin: '0 0.2em',
    paddingInline: '0.1em 0.15em',
    paddingBlock: '0.4em',
    fontSize: '90%',
    background: 'rgba(150, 150, 150, 0.06)',
    border: '1px solid rgba(100, 100, 100, 0.2)',
    borderBottomWidth: 2,
    borderRadius: 3,
  },

  mark: {
    padding: 0,
    backgroundColor: gold[2],
  },

  'u, ins': {
    textDecoration: 'underline',
    textDecorationSkipInk: 'auto',
  },

  's, del': {
    textDecoration: 'line-through',
  },

  strong: {
    fontWeight: 600,
  },

  // list
  'ul, ol': {
    marginInline: 0,
    marginBlock: '0 1em',
    padding: 0,

    li: {
      marginInline: '20px 0',
      marginBlock: '0 0',
      paddingInline: '4px 0',
      paddingBlock: '0 0',
    },
  },

  ul: {
    listStyleType: 'circle',

    ul: {
      listStyleType: 'disc',
    },
  },

  ol: {
    listStyleType: 'decimal',
  },

  // pre & block
  'pre, blockquote': {
    margin: '1em 0',
  },

  pre: {
    padding: '0.4em 0.6em',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    background: 'rgba(150, 150, 150, 0.1)',
    border: '1px solid rgba(100, 100, 100, 0.2)',
    borderRadius: '3px',

    // Compatible for marked
    code: {
      display: 'inline',
      margin: 0,
      padding: 0,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      background: 'transparent',
      border: 0,
    },
  },

  blockquote: {
    paddingInline: '0.6em 0',
    paddingBlock: 0,
    borderInlineStart: '4px solid rgba(100, 100, 100, 0.2)',
    opacity: '0.85',
  },
});

export const getEditableStyles: GenerateStyle<TypographyToken, CSSObject> = token => {
  const inputToken = initInputToken(token, '', '');
  const inputShift = inputToken.inputPaddingVertical + 1;
  return {
    '&-edit-content': {
      position: 'relative',

      'div&': {
        insetInlineStart: -token.paddingSM,
        marginTop: -inputShift,
        marginBottom: `calc(1em - ${inputShift}px)`,
      },

      [`.${token.typography.prefixCls}-edit-content-confirm`]: {
        position: 'absolute',
        insetInlineEnd: 10,
        insetBlockEnd: 8,
        color: token.textColorSecondary,
        // default style
        fontWeight: 'normal',
        fontSize: token.fontSize,
        fontStyle: 'normal',
        pointerEvents: 'none',
      },

      textarea: {
        margin: '0!important',
        // Fix Editable Textarea flash in Firefox
        MozTransition: 'none',
        height: '1em',
      },
    },
  };
};

export const getCopiableStyles: GenerateStyle<TypographyToken, CSSObject> = token => ({
  '&-copy-success': {
    [`
    &,
    &:hover,
    &:focus`]: {
      color: token.successColor,
    },
  },
});

export const getEllipsisStyles = (): CSSObject => ({
  [`
  a&-ellipsis,
  span&-ellipsis
  `]: {
    display: 'inline-block',
    maxWidth: '100%',
  },

  '&-single-line': {
    whiteSpace: 'nowrap',
  },

  '&-ellipsis-single-line': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    // https://blog.csdn.net/iefreer/article/details/50421025
    'a&, span&': {
      verticalAlign: 'bottom',
    },
  },

  '&-ellipsis-multiple-line': {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
});
