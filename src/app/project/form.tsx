'use client'
import React, { useState } from 'react';

import { Button, Form, Input, Modal, Radio, theme } from 'antd';

interface Values {
  title: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const {
    token: { colorPrimary, colorBgContainer },
  } = theme.useToken();
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Add a new Project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      okButtonProps={{style:{backgroundColor:colorPrimary}}}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="title"
          label="Proeject Name"
          rules={[{ required: true, message: 'Please input the title of the Project!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm