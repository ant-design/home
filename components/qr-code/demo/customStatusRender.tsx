import React from 'react';
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined } from '@ant-design/icons';
import type { QRCodeProps } from 'antd';
import { Button, Flex, QRCode, Space, Spin } from 'antd';

const value = 'https://ant.design';

const customStatusRender: QRCodeProps['statusRender'] = {
  expired: (_ori, info) => (
    <div>
      <CloseCircleFilled style={{ color: 'red' }} /> {info.locale?.expired}
      <p>
        <Button type="link" onClick={info.onRefresh}>
          <ReloadOutlined /> {info.locale?.refresh}
        </Button>
      </p>
    </div>
  ),
  loading: () => (
    <Space direction="vertical">
      <Spin />
      <p>Loading...</p>
    </Space>
  ),
  scanned: (_ori, info) => (
    <div>
      <CheckCircleFilled style={{ color: 'green' }} /> {info.locale?.scanned}
    </div>
  ),
};

const App: React.FC = () => (
  <Flex gap="middle" wrap>
    <QRCode value={value} status="loading" statusRender={customStatusRender} />
    <QRCode
      value={value}
      status="expired"
      onRefresh={() => console.log('refresh')}
      statusRender={customStatusRender}
    />
    <QRCode value={value} status="scanned" statusRender={customStatusRender} />
  </Flex>
);

export default App;
