import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook } from '../../theme/internal';
import { resetComponent } from '../../style';

interface QRCodeToken extends FullToken<'QRCode'> {}

const genQRCodeStyle: GenerateStyle<QRCodeToken> = (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      ...resetComponent(token),
      padding: 10,
      borderRadius: token.borderRadiusLG,
      border: `${token.lineWidth}px ${token.lineType} ${token.colorSplit}`
      position: 'relative',
      width: '100%',
      height: '100%',
      '&-mask': {
        position: 'absolute',
        borderRadius: 8,
        insetBlockStart: 0,
        insetInlineStart: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: '#000',
        lineHeight: '1.5',
        textAlign: 'center',
        backgroundColor: '#fff',
        opacity: '0.96',
      },
      '&-icon': {
        marginBlockEnd: token.marginXS,
        fontSize: token.controlHeight,
      },
    },
  };
};

export default genComponentStyleHook<'QRCode'>('QRCode', genQRCodeStyle);
