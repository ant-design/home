import type { CSSObject } from '@ant-design/cssinjs';

import { resetComponent } from '../../style';
import type { FullToken, GenerateStyle, GetDefaultToken } from '../../theme/internal';
import { genStyleHooks } from '../../theme/internal';

export interface ComponentToken {
  /**
   * @desc 可改变大小标识 元素大小
   * @descEN Height of content area
   */
  resizableSize: number;
  /**
   * @desc 快速折叠 图标大小
   * @descEN Height of content area
   */
  collapsibleIconSize: number;
}

interface SplitterToken extends FullToken<'Splitter'> {}

const genSplitterStyle: GenerateStyle<SplitterToken> = (token: SplitterToken): CSSObject => {
  const {
    componentCls,
    colorPrimary,
    colorFill,
    colorFillTertiary,
    resizableSize,
    borderRadius,
    collapsibleIconSize,
    zIndexPopupBase,
  } = token;

  return {
    [`${componentCls}`]: {
      ...resetComponent(token),
      display: 'flex',
      width: '100%',
      height: '100%',

      // split bar
      '&-bar': {
        flexGrow: 0,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: colorFillTertiary,

        '&:hover': {
          background: colorFill,
        },

        [`> ${componentCls}-bar-resizable`]: {
          borderRadius,
          pointerEvents: 'none',
          background: colorFill,
        },

        [`> ${componentCls}-bar-collapse`]: {
          position: 'absolute',

          [`> ${componentCls}-bar-collapse-previous,> ${componentCls}-bar-collapse-next`]: {
            padding: 2,
            position: 'absolute',
            fontSize: collapsibleIconSize,
            zIndex: zIndexPopupBase,

            '&:hover': {
              color: colorPrimary,
            },
          },
        },
      },

      '&-bar-active': {
        background: colorFill,
      },

      '&-bar-disabled': {
        '&:hover': {
          background: colorFillTertiary,
        },
      },

      // Layout
      '&-horizontal': {
        flexDirection: 'row',

        [`> ${componentCls}-bar`]: {
          cursor: 'col-resize',

          [`> ${componentCls}-bar-resizable`]: {
            width: '100%',
            height: resizableSize,
          },

          [`> ${componentCls}-bar-collapse`]: {
            width: '100%',

            [`> ${componentCls}-bar-collapse-previous`]: {
              left: 0,
              top: '50%',
              transform: 'translate(-100%, -50%)',
            },

            [`> ${componentCls}-bar-collapse-next`]: {
              right: 0,
              top: '50%',
              transform: 'translate(100%, -50%)',
            },
          },
        },

        [`> ${componentCls}-bar-disabled`]: {
          cursor: 'default',
        },
      },

      '&-vertical': {
        flexDirection: 'column',

        [`> ${componentCls}-bar`]: {
          cursor: 'row-resize',

          [`> ${componentCls}-bar-resizable`]: {
            width: resizableSize,
            height: '100%',
          },

          [`> ${componentCls}-bar-collapse`]: {
            height: '100%',

            [`> ${componentCls}-bar-collapse-previous`]: {
              top: 0,
              left: '50%',
              transform: 'translate(-50%, -100%) rotate(90deg)',
            },

            [`> ${componentCls}-bar-collapse-next`]: {
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 100%) rotate(90deg)',
            },
          },
        },

        [`> ${componentCls}-bar-disabled`]: {
          cursor: 'default',
        },
      },

      // moving
      '&-resizing': {
        userSelect: 'none',

        [`>${componentCls}-item`]: {
          transition: 'none',
        },
      },

      [`&-resizing${componentCls}-horizontal`]: {
        cursor: 'col-resize',
      },

      [`&-resizing${componentCls}-vertical`]: {
        cursor: 'row-resize',
      },

      // panel
      '&-item': {
        overflow: 'auto',
        transition: '200ms',
      },
    },
  };
};

export const prepareComponentToken: GetDefaultToken<'Splitter'> = (token) => ({
  resizableSize: 10,
  collapsibleIconSize: token.fontSizeIcon,
});

// ============================== Export ==============================
export default genStyleHooks(
  'Splitter',
  (token) => [genSplitterStyle(token)],
  prepareComponentToken,
);
