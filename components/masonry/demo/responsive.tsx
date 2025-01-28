import React from 'react';
import { Masonry } from 'antd';

import DemoItem from './DemoItem';

const heights = [120, 45, 85, 160, 95, 140, 75, 110, 65, 130, 90, 145, 55, 100, 80];

const Responsive: React.FC = () => {
  const items = heights.map((height, index) => ({
    key: `item-${index}`,
    render: () => <DemoItem height={height}>{index + 1}</DemoItem>,
  }));

  return (
    <Masonry columns={{ xs: 1, sm: 2, md: 3 }} gutter={{ xs: 8, sm: 12, md: 16 }} items={items} />
  );
};

export default Responsive;
