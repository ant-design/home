import React from 'react';
import { QRCode } from 'antd';

import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const locales = {
  cn: {
    root: '根节点',
    mask: '遮罩层元素',
  },
  en: {
    root: 'Root element',
    mask: 'Mask element',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  const value = 'https://ant.design';
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: locale.root, version: '5.23.0' },
        { name: 'mask', desc: locale.mask, version: '5.23.0' },
      ]}
    >
      <QRCode value={value} status="loading" />
    </SemanticPreview>
  );
};

export default App;
