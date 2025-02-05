import React from 'react';
import { Skeleton } from 'antd';

import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';
import type { SemanticName } from '../Skeleton';

const locales: Record<'cn' | 'en', Record<SemanticName, string>> = {
  cn: {
    root: '根元素',
    header: '头部元素',
    section: '区块元素',
    avatar: '头像元素',
    title: '标题元素',
    paragraph: '段落元素',
  },
  en: {
    root: 'Root element',
    header: 'Header element',
    section: 'Section element',
    avatar: 'Avatar element',
    title: 'Title element',
    paragraph: 'Paragraph element',
  },
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'section', desc: locale.section, version: '6.0.0' },
        { name: 'avatar', desc: locale.avatar, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'paragraph', desc: locale.paragraph, version: '6.0.0' },
      ]}
    >
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </SemanticPreview>
  );
};

export default App;
