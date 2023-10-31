'use client'
import { Breadcrumb, Collapse, InputRef, Modal, Popover, Space, TableProps, Tag, theme, Typography } from 'antd';
import { Button, Card, FloatButton, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AppstoreAddOutlined, ArrowLeftOutlined, DeleteFilled, DeleteOutlined, FileSyncOutlined, HomeOutlined, PlayCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import CollectionCreateForm from './form';
import { useRouter } from 'next/navigation';
import { ColumnsType, ColumnType, FilterConfirmProps, FilterValue, SorterResult } from 'antd/es/table/interface';
import Link from 'antd/es/typography/Link';
import { create, edit, get, remove } from '@/app/utils/api';
import { Requirement } from '@/app/utils/interfaces';
import { useNotification } from '@/app/contexts/notification.context';
import Loading from '@/app/loading';
import Details from './details';


// async function editRequirement(requirement_id:string, row:any) {
//   try{
//     return edit(`requirement/${requirement_id}`, {'content':row.content})
//   } catch(e){
//     console.log("error: ",e);
//   }
// }
async function deleteRequirement(requirement_id:string) {
  try{
    return remove(`requirement/${requirement_id}`)
  } catch(e){
    console.log("error: ",e);
  }
}


const App = ({ params } : { params : {document_id:string, project_id:string} }) => {
  const {
    token: { colorPrimary, colorBgContainer },
  } = theme.useToken();
  const document_id = params.document_id
  const project_id = params.project_id
  const router = useRouter()
  const [dataSource, setDataSource] = useState(Array<Requirement>);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Requirement,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof Requirement): ColumnType<Requirement> => ({
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
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Requirement>>({});

  const handleChange: TableProps<Requirement>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Requirement>);
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

  function calculateConflict() {
    try{
      raiseNotification("loading", "Conflict calculation started!")
      create(`conflict/document/${document_id}`,{}).then(()=>
      raiseNotification("success", "Conflict calculation finished!"))
    } catch(e){
      console.log("error: ",e);
      raiseNotification("error", "Some error occured!")
    }
  }

  async function fetchRequirements() {
    try{
      return get(`requirement/document/${document_id}`)
    } catch(e){
      console.log("error: ",e);
    }
  }

  const { data, error, isLoading, refetch } = useQuery(
    "get_requirements",
    fetchRequirements
  );

  useEffect(()=>{
    setDataSource(data?.map((item: { id: string }) => ({
      ...item,
      key: item.id,
      // performance: 'Good',
      isSafe: true
    })))
    console.log(data);
    
  },[data, isLoading])

  const handleDelete = async (id: string) => {
    // delete an entry here
      if(await deleteRequirement(id)){
        const newData = dataSource.filter((item) => item.id !== id);    
        setDataSource(newData);
        raiseNotification("success","Requirement deleted added!")
      } else raiseNotification("error","Requirement deletion failed!")
    // delete done

  };
  const [page, setPage] = React.useState(1);
  const defaultColumns: ColumnsType<Requirement> = [
    {
      title: "Sl",
      key: "index",
      render: (text: string, record: any, index: number) => index + 1 + (page - 1) * 10,
      width: "5%",
      // editable: false,
    },
    {
      title: 'Requirement',
      dataIndex: 'content',
      key:'content',
      width: '85%',
      // editable: true,
      filteredValue: filteredInfo.content || null,
      ...getColumnSearchProps('content'),
      sorter: (a:any, b:any) => a?.content?.toLowerCase().localeCompare(b?.content?.toLowerCase()),
      sortOrder: sortedInfo.columnKey === 'content' ? sortedInfo.order : null,
      ellipsis: true,
      // onCell: (record:Requirement) => {
      //   return {
      //     onClick: () => {console.log(record.content);
      //     }, // click row
      //   };
      // },
      render: (_: any, record: Requirement) => {
        return (
          <Popover content={<Details params={{
            requirement_id: `${record.id}`,
            content: `${record.content}`
          }} />} trigger="click">
          {record.content}
        </Popover>
        )
      }
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isSafe',
    //   width: '15%',
    //   // editable: false,
    //   filters: [
    //     { text: 'Safe', value: true },
    //     { text: 'Unsafe', value: false },
    //   ],
    //   filteredValue: filteredInfo.isSafe || null,
    //   onFilter: (value: any, record:Requirement) => record?.isSafe == value,
    //   render: (_: any, record: Requirement) => {
    //     return record?.isSafe == true ? (
    //       <Tag>
    //         Safe
    //       </Tag>
    //     ) : 
    //     <Tag>
    //       At Risk
    //   </Tag>
    //   }
    // },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: Requirement) => {
        return dataSource.length >= 1 ? (
          <span className='flex gap-3'>
          {/* <Popconfirm title="Sure to extract conflcits? Previous customization will be reset!" onConfirm={() => handleDelete(record.id)}>
            <PlayCircleOutlined style={{color:'#222E3C'}}/>
          </Popconfirm> */}
          <Popconfirm title="Sure to delete?" okButtonProps={{style:{backgroundColor:colorPrimary}}} onConfirm={() => handleDelete(record.id)}>
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
      create(`requirement`,values).then(()=>refetch())
      raiseNotification("success","Requirement successfully added!")
    } catch(e){
      raiseNotification("error","Requirement creation failed!")
      console.log("error: ",e);
    }
      // console.log(res);
    refetch()
    setOpen(false);
  };

  if(isLoading) return <Loading/>

  else return (
    <div>
      {/* <Button type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button> */}
      <div className='flex p-6 bg-white' style={{alignItems: 'center', justifyContent:'space-between'}}>
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
            },
            
            {
              href: `/project/${project_id}/${document_id}`,
              title: (
                <>
                  <UserOutlined />
                  <span>Requirements</span>
                </>
              ),
            }
          ]}
        />
        <Button onClick={()=>router.push(`/project/${project_id}/${document_id}/conflict`)}>Report</Button>
        </div>
        <CollectionCreateForm
            project_id={project_id}
            document_id={document_id}
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
              refetch()
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
        pagination={{
          onChange(current) {
            setPage(current);
          }
        }}
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
            tooltip={"Add Requirement/s"}
            onClick={() => {
              setOpen(true);
            }}
          />
          <FloatButton
            shape="circle"
            type="primary"
            style={{ right: 36, bottom: 96 }}
            icon={<SearchOutlined />}
            tooltip={"Find Document Conflicts"}
            onClick={() => {
              Modal.confirm({
                title: 'Are you sure?',
                content: 'Finding conflicts will permanently delete the previous report. Make sure to export it!',
                footer: (_, { CancelBtn }) => (
                  <>
                    <Button onClick={()=>calculateConflict()} className="text-red-600 border border-red-400 hover:bg-white ease-in-out">Find Conflicts</Button>
                    <CancelBtn />
                  </>
                ),
              });
              // .then( () => {
              //     raiseNotification("success", "Conflict calculation finished!");
              //     // router.push(`/project/${project_id}/${document_id}/conflict`);
              //   }
              // )
            }}
          />
          
    </div>
  );
};

export default App;