import React from 'react';
import { Flex, Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';

const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ],
  },
];

const sharedProps: GetProps<typeof DirectoryTree> = {
  treeData,
  defaultExpandAll: true,
  onSelect: (keys, info) => {
    console.log('Trigger Select', keys, info);
  },
  onExpand: (keys, info) => {
    console.log('Trigger Expand', keys, info);
  },
};

const DemoOne = () => <DirectoryTree draggable defaultSelectedKeys={['0-0-0']} />;

const DemoTwo = () => <DirectoryTree {...sharedProps} checkable defaultSelectedKeys={['0-1-0']} />;

const DemoThree = () => (
  <DirectoryTree {...sharedProps} draggable checkable defaultSelectedKeys={['0-1']} />
);

const BasicDemo = () => <DirectoryTree {...sharedProps} multiple treeData={treeData} />;

const App = () => (
  <div style={{ height: 500 }}>
    <Flex
      wrap
      gap="large"
      style={{
        transformOrigin: 'top left',
        // 方便视觉回归
        transform: 'scale(2)',
      }}
    >
      <DemoOne />
      <DemoTwo />
      <DemoThree />
      <BasicDemo />
    </Flex>
  </div>
);

export default App;
