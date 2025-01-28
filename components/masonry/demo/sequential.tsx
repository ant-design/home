import React from 'react';
import { Masonry } from 'antd';

import DemoItem from './DemoItem';

const heights = [135, 60, 105, 180, 75, 85, 115, 70, 165, 40, 120, 90];

const Sequential: React.FC = () => {
  const items = heights.map((height, index) => ({
    key: `item-${index}`,
    render: () => <DemoItem height={height}>{index + 1}</DemoItem>,
  }));

  return <Masonry columns={4} gutter={16} sequential items={items} />;
};

export default Sequential;
