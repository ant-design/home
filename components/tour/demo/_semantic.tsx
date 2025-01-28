import React from 'react';
import { Tour } from 'antd';

import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = Tour;
const locales = {
  cn: {
    root: '根元素',
    cover: '图标元素',
    section: '内容元素',
    footer: '底部元素',
    actions: '操作元素',
    indicator: '指示器元素',
    header: '头部元素',
    title: '标题元素',
    description: '描述元素',
    mask: '遮罩层元素',
  },
  en: {
    root: 'Root element',
    cover: 'Cover element',
    section: 'Section element',
    footer: 'Footer element',
    actions: 'Actions element',
    indicator: 'Indicator element',
    header: 'Header element',
    title: 'Title element',
    description: 'Description element',
    mask: 'Mask element',
  },
};

const BlockList: React.FC<React.PropsWithChildren> = (props: any) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        top: 0,
      }}
    >
      <InternalPanel
        {...props}
        title="Hello World!"
        description="Hello World?!"
        cover={
          <img
            alt="tour.png"
            src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
          />
        }
        current={5}
        total={7}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      component="ant-tour"
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'mask', desc: locale.mask, version: '6.0.0' },
        { name: 'section', desc: locale.section, version: '6.0.0' },
        { name: 'cover', desc: locale.cover, version: '6.0.0' },
        { name: 'header', desc: locale.header, version: '6.0.0' },
        { name: 'title', desc: locale.title, version: '6.0.0' },
        { name: 'description', desc: locale.description, version: '6.0.0' },
        { name: 'footer', desc: locale.footer, version: '6.0.0' },
        { name: 'actions', desc: locale.actions, version: '6.0.0' },
        { name: 'indicator', desc: locale.indicator, version: '6.0.0' },
      ]}
    >
      <BlockList />
    </SemanticPreview>
  );
};

export default App;
