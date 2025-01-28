import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

import Masonry from '../Masonry';

const DemoItem: React.FC<{ height: number; children: React.ReactNode; onClick: () => void }> = ({
  height,
  children,
  onClick,
}) => {
  return (
    <div
      style={{
        height,
        background: '#f0f0f0',
        borderRadius: 4,
        padding: 4,
        width: '100%',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const heights = [150, 30, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 30, 50, 80];

const Update: React.FC = () => {
  const [items, setItems] = useState<{ key: string; render: () => React.ReactNode }[]>([]);

  const removeItem = (key: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        key: `item-${prevItems.length}`,
        render: () => (
          <DemoItem
            height={Math.floor(Math.random() * 100) + 100}
            onClick={() => removeItem(`item-${prevItems.length}`)}
          >
            {prevItems.length + 1}
          </DemoItem>
        ),
      },
    ]);
  };

  useEffect(() => {
    setItems(
      heights.map((height, index) => ({
        key: `item-${index}`,
        render: () => (
          <DemoItem height={height} onClick={() => removeItem(`item-${index}`)}>
            {index + 1}
          </DemoItem>
        ),
      })),
    );
  }, []);

  return (
    <>
      <Masonry columns={4} gutter={16} items={items} />
      <Button onClick={addItem}>Add Item</Button>
    </>
  );
};

export default Update;
