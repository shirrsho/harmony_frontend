'use client'
import { InputRef, Typography } from 'antd';
import { Button, Card, FloatButton, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AppstoreAddOutlined, DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import CollectionCreateForm from './form';
import { useRouter } from 'next/navigation';
import { Document } from '@/app/utils/interfaces';
import { create, edit, get, remove } from '@/app/utils/api';
import { useNotification } from '@/app/contexts/notification.context';

const EditableContext = React.createContext<FormInstance<any> | null>(null);


async function editDocument(document_id:string, row:Document) {
  try{
    return edit(`document/${document_id}`, row)
  } catch(e){
    console.log("error: ",e);
  }
}
async function deleteDocument(document_id:string) {
  try{
    return remove(`document/${document_id}`)
  } catch(e){
    console.log("error: ",e);
  }
}

interface Item {
  id:string,
  key: string;
  title: string;
  project_id: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    // on hitting enter after changing the field
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const App = ({ params }: { params: { project_id: string } }) => {
  const router = useRouter()
  const [dataSource, setDataSource] = useState(Array<Document>);
  const project_id = params.project_id

  async function fetchDocuments() {
    try{
      return get(`document/all/${project_id}`)
    } catch(e){
      console.log("error: ",e);
    }
  }

  const { data, error, isLoading, refetch } = useQuery(
    "get_projects",
    fetchDocuments
  );

  useEffect(()=>{
    setDataSource(data?.map((item: { id: string }) => ({
      ...item,
      key: item.id,
    })))
    console.log(data);
    
  },[data, isLoading])

  const [count, setCount] = useState(2);

  const handleDelete = async (id: string) => {
    // delete an entry here
      if(await deleteDocument(id)){
        const newData = dataSource.filter((item) => item.id !== id);
        setDataSource(newData);
      }
    // delete done

  };

  const defaultColumns = [
    {
      title: "Sl",
      key: "index",
      render: (text: string, record: any, index: number) => index + 1,
      width: "5%",
      editable: false,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: '75%',
      editable: true,
    },
    {
      title: 'Report',
      dataIndex: 'report',
      width: '10%',
      editable: false,
      render: (_: any, record: Document) => {
        return dataSource.length >= 1 ? (
          <>
          <Typography.Link>
            Report
          </Typography.Link>
          </>
        ) : <></>
      }
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Document) => {
        return dataSource.length >= 1 ? (
          <span className='flex gap-1'>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined style={{color:'red'}}/>
          </Popconfirm>
          <Typography.Link href={`/project/${project_id}/${record.id}`}>
            View
          </Typography.Link>
          </span>
        ) : <></>
      }
    },
  ];

  const handleAdd = () => {

    // New entry here

    // const newData: DataType = {
    //   key: count,
    //   name: `Edward King ${count}`,
    //   age: '32',
    //   address: `London, Park Lane no. ${count}`,
    // };
    // setDataSource([...dataSource, newData]);
    // setCount(count + 1);
  };

  const handleSave = async (row: Document) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    if(await editDocument(row.id, row)){
      setDataSource(newData);
    }
    
    // Save Editted cells
    
  
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Document) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const [open, setOpen] = useState(false);
  const {raiseNotification} = useNotification();

  const onCreate = async (values: any) => {
    console.log('Received values of form: ', values);
    try{
      await create(`document`,values)
      raiseNotification("success","Document successfully added!")
    } catch(e){
      raiseNotification("error","Document creation failed!")
      console.log("error: ",e);
    }
      // console.log(res);
      refetch()
    setOpen(false);
  };

  return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
        <CollectionCreateForm
            project_id={project_id}
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Card className="shadow-md">
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        // onRow={(record) => {
        //   return {
        //     onClick: (event) => {router.push(`/project/${record.id}`)}, // click row
        //   };
        // }}
      />
      </Card>
          <FloatButton
            shape="circle"
            type="primary"
            style={{ right: 36 }}
            icon={<AppstoreAddOutlined />}
            onClick={() => {
              setOpen(true);
            }}
          />
          
    </div>
  );
};

export default App;