import { Mentions } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <Mentions
    style={{ width: '100%' }}
    defaultValue="@afc163@zombieJ"
    itemOnceDelete
    options={[
      {
        value: 'afc163',
        label: 'afc163',
      },
      {
        value: 'zombieJ',
        label: 'zombieJ',
      },
      {
        value: 'yesmeck',
        label: 'yesmeck',
      },
    ]}
  />
);

export default App;
