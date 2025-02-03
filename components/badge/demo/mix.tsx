import React from 'react';
import { Avatar, Badge, Flex, Popover, Typography } from 'antd';

function getCombinations(...arrays: any[]) {
  return arrays.reduce(
    (combinations, array) =>
      combinations.flatMap((combination: any) =>
        array.map((element: any) => [...combination, element]),
      ),
    [[]],
  );
}

function genBadgeProps(obj: Record<string, any>) {
  const keys: any = [];
  const values: any = [];

  Object.entries(obj).forEach(([key, value]) => {
    keys.push(key);
    values.push(value);
  });

  const combinations = getCombinations(...values);

  return combinations.map((combination: any) => {
    const props: Record<string, any> = {};
    combination.forEach((value: any, index: number) => {
      props[keys[index]] = value;
    });
    return props;
  });
}

const App: React.FC = () => {
  const [examplesProps] = React.useState(() =>
    genBadgeProps({
      children: [undefined, <Avatar key="avatar" shape="square" />],
      dot: [true, false],
      status: ['default', 'success', 'processing'],
      count: [0, 5, 100],
      color: ['#e7d', 'yellow'],
      showZero: [true, false],
    }),
  );

  return (
    <Flex gap={64} wrap>
      {examplesProps.map((props: any, index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, ...restProps } = props;
        return (
          <Popover
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            content={
              <Typography.Paragraph>
                <pre>
                  {Object.entries(restProps)
                    .map(([key, value]) =>
                      [key, typeof value === 'string' ? `"${value}"` : `{${value}}`].join('='),
                    )
                    .join('\n')}
                </pre>
              </Typography.Paragraph>
            }
            trigger={['hover']}
          >
            <div style={{ border: '1px solid #0ee', padding: 6 }}>
              <Badge {...props} />
            </div>
          </Popover>
        );
      })}
    </Flex>
  );
};

export default App;
