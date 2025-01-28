import React, { useMemo, useRef } from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';

import type { MasonryItem as MasonryItemType } from './interface';

interface MasonryItemProps {
  item: MasonryItemType;
  index: number;
  style: React.CSSProperties;
  prefixCls: string;
}

const MasonryItem = ({ item, style, index, prefixCls }: MasonryItemProps) => {
  const itemPrefixCls = `${prefixCls}-item`;
  const itemRef = useRef<HTMLDivElement>(null);

  const renderNode = useMemo(() => item.render(), [item.render]);

  const setDimensions = () => {
    if (itemRef.current) {
      itemRef.current.setAttribute('data-width', String(itemRef.current.clientWidth));
      itemRef.current.setAttribute(
        'data-height',
        String(item.height ?? itemRef.current.clientHeight),
      );
    }
  };

  useLayoutEffect(() => {
    if (itemRef.current) {
      setDimensions();

      const images = itemRef.current.getElementsByTagName('img');

      const imageLoadPromises = Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
      );

      // Update height after all images are loaded
      Promise.all(imageLoadPromises).then(setDimensions);

      // Cleanup
      return () => {
        Array.from(images).forEach((img) => {
          img.removeEventListener('load', setDimensions);
          img.removeEventListener('error', setDimensions);
        });
      };
    }
  }, [item.key]);

  return (
    <div
      ref={itemRef}
      key={item.key ?? index}
      style={style}
      className={itemPrefixCls}
      {...{ [`data-${itemPrefixCls}`]: item.key }}
    >
      {renderNode}
    </div>
  );
};

export default MasonryItem;
