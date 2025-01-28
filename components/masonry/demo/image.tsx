import React from 'react';

import Masonry from '../Masonry';

const itemData = [
  'https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f',
  'https://images.unsplash.com/photo-1507513319174-e556268bb244',
  'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
  'https://images.unsplash.com/photo-1492778297155-7be4c83960c7',
  'https://images.unsplash.com/photo-1508062878650-88b52897f298',
  'https://images.unsplash.com/photo-1506158278516-d720e72406fc',
  'https://images.unsplash.com/photo-1552203274-e3c7bd771d26',
  'https://images.unsplash.com/photo-1528163186890-de9b86b54b51',
  'https://images.unsplash.com/photo-1727423304224-6d2fd99b864c',
  'https://images.unsplash.com/photo-1675090391405-432434e23595',
  'https://images.unsplash.com/photo-1554196967-97a8602084d9',
  'https://images.unsplash.com/photo-1491961865842-98f7befd1a60',
  'https://images.unsplash.com/photo-1721728613411-d56d2ddda959',
  'https://images.unsplash.com/photo-1731901245099-20ac7f85dbaa',
  'https://images.unsplash.com/photo-1617694455303-59af55af7e58',
  'https://images.unsplash.com/photo-1709198165282-1dab551df890',
];

const ImageDemo = () => {
  const items = itemData.map((item, index) => ({
    key: `item-${index}`,
    render: () => (
      <img
        src={`${item}?w=180&auto=format`}
        alt={item}
        style={{ width: '100%', display: 'block' }}
      />
    ),
  }));

  return <Masonry columns={4} gutter={16} items={items} keepAspectRatio />;
};

export default ImageDemo;
