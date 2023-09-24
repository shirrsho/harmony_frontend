'use client'
import React, { useState } from 'react';

import { Button, Form, Input, Modal, Radio, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { useNotification } from '@/app/contexts/notification.context';
import Title from 'antd/es/typography/Title';

interface Values {
  content: string;
  project_id: string;
  document_id:string;
}

interface CollectionCreateFormProps {
  project_id: string;
  document_id: string;
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  project_id,
  document_id,
  open,
  onCreate,
  onCancel,
}) => {
  
  const [form] = Form.useForm();

  const {raiseNotification} = useNotification()

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    action: `http://localhost:8000/requirement/${project_id}/${document_id}`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        // message.success(`${info.file.name} file uploaded successfully.`);
        raiseNotification("success","Requirements added to the document!")
        onCancel()
      } else if (status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
        raiseNotification("error","Requirements failed to be added!")
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  
  return (
    <Modal
      open={open}
      title="Add requirements!"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
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
      <Dragger {...props} height={300}>
          <p className="ant-upload-drag-icon">
          <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag csv/excel file to this area to upload!</p>
          <p className="ant-upload-hint">
          Format must be adjjusted for successful upload. For file format, please contact with the admin.
          </p>
      </Dragger>
      <Title className='p-5' level={3}>Or,</Title>
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="content"
          label="Add a single Requirement"
          rules={[{ required: true, message: 'Please input the requirement!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="project_id" initialValue={project_id} hidden/>
        <Form.Item name="document_id" initialValue={document_id} hidden/>
      </Form>
    </Modal>
  );
};

export default CollectionCreateForm