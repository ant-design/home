import React from 'react';
import { generateForm, Input } from 'antd';

type FieldType = { username?: string; password?: string };

// const Form = AntdForm as React.FC<FormProps<FieldType>> & {
//   Item: React.FC<FormItemProps<FieldType>>;
// };

// const Form = AntdForm as typeof AntdForm<FieldType> & {
//   Item: typeof AntdForm.Item<FieldType>;
// };

const Form = generateForm<FieldType>();

const App = () => (
  <Form
    onFinish={(values) => {
      console.log('values', values);
    }}
  >
    <Form.Item label="Username" name="username">
      <Input />
    </Form.Item>

    <Form.Item label="Password" name="password">
      <Input />
    </Form.Item>
  </Form>
);

export default App;
