
import React from 'react';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Flex, Rate } from 'antd';

const customIcons: Record<number, React.ReactNode> = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const RateCom: React.FC = () => (
  <Flex gap="middle" vertical>
    <Rate defaultValue={2} character={({ index = 0 }) => index + 1} />
    <Rate character="A" defaultValue={4} allowHalf style={{ fontSize: 36 }} />
    <Rate defaultValue={3} character={({ index = 0 }) => customIcons[index + 1]} />
  </Flex>
);

export default RateCom;