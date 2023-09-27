'use client'
import { Breadcrumb, InputRef, Space, TableProps, Tag, Typography } from 'antd';
import { Button, Card, FloatButton, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AppstoreAddOutlined, ArrowLeftOutlined, DeleteFilled, DeleteOutlined, FileSyncOutlined, HomeOutlined, PlayCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import CollectionCreateForm from './form';
import { useRouter } from 'next/navigation';
import { ColumnsType, ColumnType, FilterConfirmProps, FilterValue, SorterResult } from 'antd/es/table/interface';
import Link from 'antd/es/typography/Link';
import { create, get, remove } from '@/app/utils/api';
import { Document } from '@/app/utils/interfaces';
import { useNotification } from '@/app/contexts/notification.context';
import Loading from '@/app/loading';


// async function editProject(project_id:string, row:Project) {
//   try{
//     return edit(`project/${project_id}`, {'title':row.title})
//   } catch(e){
//     console.log("error: ",e);
//   }
// }
async function deleteDocument(document_id:string) {
  try{
    return remove(`document/${document_id}`)
  } catch(e){
    console.log("error: ",e);
  }
}


const App = ({ params } : { params : {project_id:string} }) => {
  const project_id = params.project_id
  const router = useRouter()
  const [dataSource, setDataSource] = useState(Array<Document>);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Document,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof Document): ColumnType<Document> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]?.toString()}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        // <Highlighter
        //   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //   searchWords={[searchText]}
        //   autoEscape
        //   textToHighlight={text ? text.toString() : ''}
        // />
        text
      ) : (
        text
      ),
  });

  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Document>>({});

  const handleChange: TableProps<Document>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Document>);
  };

  // const clearFilters = () => {
  //   setFilteredInfo({});
  // };

  // const clearAll = () => {
  //   setFilteredInfo({});
  //   setSortedInfo({});
  // };

  // const setAgeSort = () => {
  //   setSortedInfo({
  //     order: 'descend',
  //     columnKey: 'age',
  //   });
  // };

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
      // performance: 'Good',
      // contributor: 'Shirsho'
    })))
    console.log(data);
    
  },[data, isLoading])

  const handleDelete = async (id: string) => {
    // delete an entry here
      if(await deleteDocument(id)){
        raiseNotification("success","Document successfully deleted!")
        refetch()
      } else raiseNotification("error","Document deletion failed!")
    // delete done

  };

  const defaultColumns: ColumnsType<Document> = [
    {
      title: "Sl",
      key: "index",
      render: (text: string, record: any, index: number) => index + 1,
      width: "5%",
      // editable: false,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key:'title',
      width: '65%',
      // editable: true,
      filters: [
        { text: 'Fooooo', value: 'Fooooo' },
        { text: 'Post', value: 'Post' },
      ],
      filteredValue: filteredInfo.title || null,
      onFilter: (value: string|number|boolean, record:Document) => record.title?.includes(value.toString()),
      sorter: (a:any, b:any) => a?.title?.toLowerCase().localeCompare(b?.title?.toLowerCase()),
      sortOrder: sortedInfo.columnKey === 'title' ? sortedInfo.order : null,
      ...getColumnSearchProps('title'),
      ellipsis: true,
      onCell: (record:Document) => {
        return {
          onClick: () => {router.push(`/project/${project_id}/${record.id}`)}, // click row
        };
      },
    },
    // {
    //   title: 'Contributor',
    //   dataIndex: 'contributor',
    //   key:'contributor',
    //   width: '15%',
    //   // editable: true,
    //   filters: [
    //     { text: 'Fooooo', value: 'Fooooo' },
    //     { text: 'Post', value: 'Post' },
    //   ],
    //   filteredValue: filteredInfo.title || null,
    //   onFilter: (value: string|number|boolean, record:Document) => record.contributor?.includes(value.toString()),
    //   // sorter: (a:any, b:any) => a.contributor?.length - b.contributor?.length,
    //   // sortOrder: sortedInfo.columnKey === 'contributor' ? sortedInfo.order : null,
    //   // ...getColumnSearchProps('contributor'),
    //   ellipsis: true,
    //   render: (_: any, record: Document) => {
    //     return dataSource.length >= 1 ? (
    //       <Link href='#'>
    //         {record.contributor}
    //       </Link>
    //     ) : <></>
    //   }
    // },
    // {
    //   title: 'Performance',
    //   dataIndex: 'performance',
    //   key:'performance',
    //   width: '15%',
    //   // editable: true,
    //   filters: [
    //     { text: 'Good', value: 'Good' },
    //     { text: 'Great', value: 'Great' },
    //   ],
    //   filteredValue: filteredInfo.performance || null,
    //   onFilter: (value: string|number|boolean, record:Document) => record.performance?.includes(value.toString()),
    //   sorter: (a:any, b:any) => a.performance?.length - b.performance?.length,
    //   sortOrder: sortedInfo.columnKey === 'performance' ? sortedInfo.order : null,
    //   // ...getColumnSearchProps('performance'),
    //   ellipsis: true,
    //   render: (_: any, record: Document) => {
    //     return dataSource.length >= 1 ? (
    //       <Tag>
    //         {record.performance}
    //       </Tag>
    //     ) : <></>
    //   }
    // },
    {
      title: 'Report',
      dataIndex: 'report',
      width: '20%',
      // editable: false,
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
          <span className='flex gap-3'>
          {/* <Popconfirm title="Sure to extract conflcits? Previous customization will be reset!" onConfirm={() => handleDelete(record.id)}> */}
            <PlayCircleOutlined style={{color:'#222E3C'}} onClick={()=>router.push(`/project/${project_id}/${record.id}/conflict`)}/>
          {/* </Popconfirm> */}
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined style={{color:'red'}}/>
          </Popconfirm>
          
          </span>
        ) : <></>
      }
    },
  ];

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

  if(isLoading) return <Loading/>

  else return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
        <Breadcrumb
          items={[
            {
              title: (
                <span onClick={()=>router.back()} className='hover:cursor-pointer pr-6'>
                  <ArrowLeftOutlined/>
                </span>
              ),
            },
            {
              href: '/project',
              title: (
                <>
                  <HomeOutlined />
                  <span>Projects</span>
                </>
              ),
            },
            {
              href: `/project/${project_id}`,
              title: (
                <>
                  <FileSyncOutlined />
                  <span>Documents</span>
                </>
              ),
            }
          ]}
          className='p-6 bg-white'
        />
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
        // components={components}
        // rowClassName={() => 'editable-row'}
        rowClassName='hover:cursor-pointer'
        bordered
        dataSource={dataSource}
        columns={defaultColumns}
        onChange={handleChange}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {router.push(`/project/${record.id}`)}, // click row
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