import React, { useMemo, useState } from 'react';
import { Divider, Flex, Radio, Skeleton } from 'antd';

import SemanticPreview from '../../../.dumi/components/SemanticPreview';
import useLocale from '../../../.dumi/hooks/useLocale';

interface PreviewContentProps {
  element: string;
  setElement: (element: string) => void;
}

const COMPONENT_MAP: Record<string, React.ElementType> = {
  avatar: Skeleton.Avatar,
  button: Skeleton.Button,
  input: Skeleton.Input,
  node: Skeleton.Node,
};

const LocaleMap: Record<string, { cn: string; en: string }> = {
  avatar: {
    cn: '头像',
    en: 'Avatar',
  },
  button: {
    cn: '按钮',
    en: 'Button',
  },
  input: {
    cn: '输入框',
    en: 'Input',
  },
  node: {
    cn: '节点',
    en: 'Node',
  },
};

const PreviewContent: React.FC<PreviewContentProps> = ({ element, setElement, ...rest }) => {
  const Element = COMPONENT_MAP[element];

  return (
    <Flex vertical style={{ width: '100%' }}>
      <Radio.Group value={element} onChange={(e) => setElement(e.target.value)}>
        <Radio.Button value="avatar">Avatar</Radio.Button>
        <Radio.Button value="button">Button</Radio.Button>
        <Radio.Button value="input">Input</Radio.Button>
        <Radio.Button value="node">Node</Radio.Button>
      </Radio.Group>
      <Divider orientation="left" plain>
        Preview
      </Divider>
      <Element {...rest} />
    </Flex>
  );
};

const App: React.FC = () => {
  const [element, setElement] = useState('avatar');
  const locales = useMemo(
    () => ({
      cn: {
        root: '根元素',
        node: `${LocaleMap[element].cn}元素`,
      },
      en: {
        root: 'Root element',
        node: `${LocaleMap[element].en} element`,
      },
    }),
    [element],
  );
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: element, desc: locale.node, version: '6.0.0' },
      ]}
    >
      <PreviewContent element={element} setElement={setElement} />
    </SemanticPreview>
  );
};

export default App;
