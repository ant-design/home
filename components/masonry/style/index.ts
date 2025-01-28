import type { CSSObject } from '@ant-design/cssinjs';

import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genStyleHooks } from '../../theme/internal';

// biome-ignore lint/suspicious/noEmptyInterface: ComponentToken need to be empty by default
export interface ComponentToken {}

export interface MasonryToken extends FullToken<'Masonry'> {}

export const genMasonryStyle: GenerateStyle<MasonryToken> = (token: MasonryToken): CSSObject => {
  const { componentCls, prefixCls } = token;

  return {
    [componentCls]: {
      width: '100%',
      minHeight: 0,
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',

      [`& > ${componentCls}-item`]: {
        boxSizing: 'border-box',
        transform: `translate(var(--${prefixCls}-item-translate-x), var(--${prefixCls}-item-translate-y))`,
        insetInlineStart: 0,
        top: 0,
        position: 'absolute',
        width: `var(--${prefixCls}-item-width)`,
        height: `var(--${prefixCls}-item-height)`,
        overflow: 'hidden',
        transition: `transform ${token.motionDurationFast} ${token.motionEaseOut}`,
      },
    },
  };
};

export default genStyleHooks('Masonry', (token) => [genMasonryStyle(token)]);
