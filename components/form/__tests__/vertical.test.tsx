import React from 'react';
import { Form, Input, Select, Radio, Checkbox } from 'antd';
import { render } from '../../../tests/utils';

describe('Form.Item Vertical Layout', () => {
  describe('Basic Vertical Layout', () => {
    it('should render correctly without labelCol', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Basic">
            <Input />
          </Form.Item>
        </Form>,
      );
      const label = container.querySelector('.ant-form-item-label');
      expect(label).toHaveClass('ant-form-item-label');
    });

    it('should work with labelCol and different offsets', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Offset 1" labelCol={{ offset: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Offset 2" labelCol={{ offset: 2 }}>
            <Input />
          </Form.Item>
        </Form>,
      );
      const labels = container.querySelectorAll('.ant-form-item-label');
      expect(labels[0]).toHaveClass('ant-col-offset-1');
      expect(labels[1]).toHaveClass('ant-col-offset-2');
    });
  });

  describe('Custom Class Names', () => {
    it('should work with custom wrapper class', () => {
      const { container } = render(
        <div className="custom-ant-col-wrapper">
          <Form layout="vertical">
            <Form.Item label="Custom" labelCol={{ offset: 1 }}>
              <Input />
            </Form.Item>
          </Form>
        </div>,
      );
      const label = container.querySelector('.ant-form-item-label');
      expect(label).toHaveClass('ant-col-offset-1');
    });

    it('should work with multiple custom classes', () => {
      const { container } = render(
        <div className="ant-col custom-class another-class">
          <Form layout="vertical">
            <Form.Item label="Multiple" labelCol={{ offset: 1 }}>
              <Input />
            </Form.Item>
          </Form>
        </div>,
      );
      const label = container.querySelector('.ant-form-item-label');
      expect(label).toHaveClass('ant-col-offset-1');
    });
  });

  describe('Nested Forms', () => {
    it('should work with nested forms using component prop', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Parent">
            <Input />
            <Form component="div" layout="vertical">
              <Form.Item label="Child">
                <Input />
              </Form.Item>
            </Form>
          </Form.Item>
        </Form>,
      );

      const formItems = container.querySelectorAll('.ant-form-item');
      expect(formItems).toHaveLength(2);
    });

    it('should work with deep nested forms', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Level 1">
            <Input />
            <Form component="div" layout="vertical">
              <Form.Item label="Level 2">
                <Input />
                <Form component="div" layout="vertical">
                  <Form.Item label="Level 3">
                    <Input />
                  </Form.Item>
                </Form>
              </Form.Item>
            </Form>
          </Form.Item>
        </Form>,
      );

      const formItems = container.querySelectorAll('.ant-form-item');
      expect(formItems).toHaveLength(3);
    });
  });

  describe('Different Form Controls', () => {
    it('should work with different form controls', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Input" labelCol={{ offset: 1 }}>
            <Input />
          </Form.Item>
          <Form.Item label="Select" labelCol={{ offset: 1 }}>
            <Select />
          </Form.Item>
          <Form.Item label="Radio" labelCol={{ offset: 1 }}>
            <Radio.Group />
          </Form.Item>
          <Form.Item label="Checkbox" labelCol={{ offset: 1 }}>
            <Checkbox.Group />
          </Form.Item>
        </Form>,
      );
      const labels = container.querySelectorAll('.ant-form-item-label');
      labels.forEach((label) => {
        expect(label).toHaveClass('ant-col-offset-1');
      });
    });
  });

  describe('Dynamic Layout Switching', () => {
    it('should keep offset when switching layout', () => {
      const { container, rerender } = render(
        <Form layout="vertical">
          <Form.Item label="Dynamic" labelCol={{ offset: 1 }}>
            <Input />
          </Form.Item>
        </Form>,
      );

      let label = container.querySelector('.ant-form-item-label');
      expect(label).toHaveClass('ant-col-offset-1');

      rerender(
        <Form layout="horizontal">
          <Form.Item label="Dynamic" labelCol={{ offset: 1 }}>
            <Input />
          </Form.Item>
        </Form>,
      );

      label = container.querySelector('.ant-form-item-label');
      expect(label).toHaveClass('ant-col-offset-1');
    });
  });

  describe('Error Scenarios', () => {
    it('should render error message correctly in vertical layout', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item label="Error Field" validateStatus="error" help="This is an error message">
            <Input />
          </Form.Item>
        </Form>,
      );

      const errorMessage = container.querySelector('.ant-form-item-explain-error');
      expect(errorMessage).toHaveTextContent('This is an error message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      const { container } = render(
        <Form layout="vertical">
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>,
      );

      const formItem = container.querySelector('.ant-form-item');
      expect(formItem).toBeInTheDocument();
    });
  });
});
