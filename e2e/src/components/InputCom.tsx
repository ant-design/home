import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space } from 'antd';

const { Search } = Input;

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
  },
];

const InputCom: React.FC = () => (
  <Space direction="vertical" size="middle">
    <Space.Compact>
      <Input defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Input style={{ width: '20%' }} defaultValue="0571" />
      <Input style={{ width: '80%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact>
      <Search addonBefore="https://" placeholder="input search text" allowClear />
    </Space.Compact>
    <Space.Compact style={{ width: '100%' }}>
      <Input defaultValue="Combine input and button" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Select defaultValue="Zhejiang" options={options} />
      <Input defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact size="large">
      <Input addonBefore={<SearchOutlined />} placeholder="large size" />
      <Input placeholder="another input" />
    </Space.Compact>
  </Space>
);

export default InputCom;