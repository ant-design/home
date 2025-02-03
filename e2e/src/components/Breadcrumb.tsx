import React from 'react';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';

const BreadcrumbCom: React.FC = () => (
  <Breadcrumb
    style={{width: '30%', margin: '0 auto'}}
    items={[
      {
        href: '',
        title: <HomeOutlined />,
      },
      {
        href: '',
        title: (
          <>
            <UserOutlined />
            <span>Application List</span>
          </>
        ),
      },
      {
        title: 'Application',
      },
    ]}
  />
);

export default BreadcrumbCom;