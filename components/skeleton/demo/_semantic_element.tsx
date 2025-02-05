import React, { useState } from 'react';
import { Divider, Flex, Segmented, Skeleton } from 'antd';

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
  image: Skeleton.Image,
};

const OPTIONS = [
  {
    value: 'avatar',
    label: 'Avatar',
  },
  {
    value: 'button',
    label: 'Button',
  },
  {
    value: 'input',
    label: 'Input',
  },
  {
    value: 'image',
    label: 'Image',
  },
  {
    value: 'node',
    label: 'Node',
  },
];

const PreviewContent: React.FC<PreviewContentProps> = ({ element, setElement, ...rest }) => {
  const Element = COMPONENT_MAP[element];

  return (
    <Flex vertical style={{ width: 'fit-content', marginRight: 'auto' }}>
      <Segmented
        options={OPTIONS}
        value={element}
        onChange={(value: string) => setElement(value)}
      />
      <Divider orientation="left" plain>
        Preview
      </Divider>
      <Element {...rest} />
    </Flex>
  );
};

const locales = {
  cn: {
    root: '根元素',
    content: '内容元素',
  },
  en: {
    root: 'Root element',
    content: 'Content element',
  },
};

const App: React.FC = () => {
  const [element, setElement] = useState('avatar');
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      semantics={[
        { name: 'root', desc: locale.root, version: '6.0.0' },
        { name: 'content', desc: locale.content, version: '6.0.0' },
      ]}
    >
      <PreviewContent element={element} setElement={setElement} />
    </SemanticPreview>
  );
};

export default App;
