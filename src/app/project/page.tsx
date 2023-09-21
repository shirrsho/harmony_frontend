'use client'
import type { InputRef } from 'antd';
import { Button, FloatButton, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Project } from '../utils/interfaces';
import { create, edit, get, remove } from '../utils/api';
import { AppstoreAddOutlined } from '@ant-design/icons';
import CollectionCreateForm from './form';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

async function fetchProjects() {
  try{
    return get('project')
  } catch(e){
    console.log("error: ",e);
  }
}
async function editProject(project_id:string, row:Project) {
  try{
    return edit(`project/${project_id}`, {'title':row.title})
  } catch(e){
    console.log("error: ",e);
  }
}
async function deleteProject(project_id:string) {
  try{
    return remove(`project/${project_id}`)
  } catch(e){
    console.log("error: ",e);
  }
}

interface Item {
  id:string,
  key: string;
  title: string;
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

const App: React.FC = () => {
  const [dataSource, setDataSource] = useState(Array<Project>);

  const { data, error, isLoading, refetch } = useQuery(
    "get_projects",
    fetchProjects
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
      if(await deleteProject(id)){
        const newData = dataSource.filter((item) => item.id !== id);    
        setDataSource(newData);
      }
    // delete done

  };

  const defaultColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '30%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Project) => {
        return dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <a>Delete</a>
          </Popconfirm>
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

  const handleSave = async (row: Project) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    if(await editProject(row.id, row)){
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
      onCell: (record: Project) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const [open, setOpen] = useState(false);

  const onCreate = async (values: any) => {
    console.log('Received values of form: ', values);
    try{
      await create(`project`,values)
    } catch(e){
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
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          />
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
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