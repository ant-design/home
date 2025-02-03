import React from 'react';
import Wrapper from './Wrapper';
import { Typography, Divider } from 'antd';

const { Paragraph } = Typography;

type ViewsComsProps = {
  // props
};

const ViewsComs: React.FC<ViewsComsProps> = (props) => {
  return (
    <Wrapper name='Views Components'>
      <Paragraph>Paragraph Testing</Paragraph>
      <Divider>Divider Text</Divider>
      <Paragraph
        editable={{
          tooltip: 'click to edit text',
        }}
      >
        {'customIconStr'}
      </Paragraph>
    </Wrapper>
  );
};

export default ViewsComs;