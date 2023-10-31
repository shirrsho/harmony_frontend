'use client'
import React, { useState } from 'react';

import { Button, Form, Input, Modal, Radio, theme } from 'antd';

interface Values {
  title: string;
  project_id: string;
}

interface CollectionCreateFormProps {
  project_id: string;
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  project_id,
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
      title="Add a new Document"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      okButtonProps={{style:{backgroundColor:colorPrimary}}}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            console.log(values);
            
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
          label="Document Title"
          rules={[{ required: true, message: 'Please input the title of the Document!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="project_id" initialValue={project_id} hidden/>
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm