'use client'
import { Breadcrumb, Collapse, InputRef, Popover, Space, TableProps, Tag, Typography } from 'antd';
import { Button, Card, FloatButton, Form, Input, Popconfirm, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { AppstoreAddOutlined, ArrowLeftOutlined, DeleteFilled, DeleteOutlined, FileSyncOutlined, HomeOutlined, PlayCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
// import CollectionCreateForm from './form';
import { useRouter } from 'next/navigation';
import { ColumnsType, ColumnType, FilterConfirmProps, FilterValue, SorterResult } from 'antd/es/table/interface';
import Link from 'antd/es/typography/Link';
import { create, edit, get, remove } from '@/app/utils/api';
// import { Requirement } from '@/app/utils/interfaces';
import { useNotification } from '@/app/contexts/notification.context';
import Loading from '@/app/loading';
import Details from './details';
import { Conflict } from '@/app/utils/interfaces';
import exportFromJSON from 'export-from-json';


// async function editRequirement(requirement_id:string, row:any) {
//   try{
//     return edit(`requirement/${requirement_id}`, {'content':row.content})
//   } catch(e){
//     console.log("error: ",e);
//   }
// }
// async function deleteRequirement(requirement_id:string) {
//   try{
//     return remove(`requirement/${requirement_id}`)
//   } catch(e){
//     console.log("error: ",e);
//   }
// }

async function getRequirement(requirement_id:string) {
  try{
    return get(`requirement/${requirement_id}`)
  } catch(e){
    console.log("error: ",e);
  }
}

async function fetchDocumentName(document_id: string) {
  try{
    const data = await get(`document/${document_id}`)
    return data.title.toString()
  } catch(e){
    console.log("error: ",e);
    return ""
  }
}


const DocumentConflicts = ({ params } : { params : {project_id:string} }) => {
  const project_id = params.project_id
  const router = useRouter()
  const [dataSource, setDataSource] = useState(Array<Conflict>);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Conflict,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof Conflict): ColumnType<Conflict> => ({
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
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Conflict>>({});

  const handleChange: TableProps<Conflict>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<Conflict>);
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

  async function fetchProjectConflicts() {
    try{
      return get(`conflict/project/${project_id}`)
    } catch(e){
      console.log("error: ",e);
    }
  }

  const { data, error, isLoading, refetch } = useQuery(
    "get_document_conflicts",
    fetchProjectConflicts
  );

  useEffect(()=>{
    setDataSource(data?.map((item: { id: string }) => ({
      ...item,
      key: item.id
      // performance: 'Good',
    //   isSafe: true
    })))
    console.log(data);
    
  },[data, isLoading])

//   const handleDelete = async (id: string) => {
//     // delete an entry here
//       if(await deleteRequirement(id)){
//         const newData = dataSource.filter((item) => item.id !== id);    
//         setDataSource(newData);
//         raiseNotification("success","Requirement deleted added!")
//       } else raiseNotification("error","Requirement deletion failed!")
//     // delete done

//   };

  const [page, setPage] = React.useState(1);
  const defaultColumns: ColumnsType<Conflict> = [
    {
      title: "Sl",
      key: "index",
      render: (text: string, record: any, index: number) => index + 1 + (page - 1) * 10,
      width: "5%",
      // editable: false,
    },
    {
      title: 'First Req',
      dataIndex: 'req1_content',
      key:'req1_content',
      width: '40%',
      // editable: true,
      filteredValue: filteredInfo.req1_content || null,
      ...getColumnSearchProps('req1_content'),
      sorter: (a:any, b:any) => a?.req1_content?.toLowerCase().localeCompare(b?.req1_content?.toLowerCase()),
      sortOrder: sortedInfo.columnKey === 'req1_content' ? sortedInfo.order : null,
      ellipsis: true,
      // onCell: (record:Requirement) => {
      //   return {
      //     onClick: () => {console.log(record.content);
      //     }, // click row
      //   };
      // },
      render: (_: any, record: Conflict) => {
        return (
          <>
          <Typography.Link href={`/project/${record.project_id}/${record.req1_document_id}`}>
          Go to Doc
        </Typography.Link>
          <Popover content={<Details params={{
            requirement_id: `${record.id}`,
            // content: `${record.req1_id}`
            content: `${record.req1_content}`
          }} />} trigger="click">
          {"->"} {record.req1_content}
        </Popover>
        </>
        )
      }
    },
    {
        title: 'Second Req',
        dataIndex: 'req2_content',
        key:'req2_content',
        width: '40%',
        // editable: true,
        filteredValue: filteredInfo.req2_content || null,
        ...getColumnSearchProps('req2_content'),
        sorter: (a:any, b:any) => a?.req2_content?.toLowerCase().localeCompare(b?.req2_content?.toLowerCase()),
        sortOrder: sortedInfo.columnKey === 'req2_content' ? sortedInfo.order : null,
        ellipsis: true,
        // onCell: (record:Requirement) => {
        //   return {
        //     onClick: () => {console.log(record.content);
        //     }, // click row
        //   };
        // },
        render: (_: any, record: Conflict) => {
            return (
            <Popover content={<Details params={{
                requirement_id: `${record.id}`,
                content: `${record.req2_content}`
            }} />} trigger="click">
            <Typography.Link href={`/project/${record.project_id}/${record.req2_document_id}`}>
              Go to Doc
            </Typography.Link>
            {"->"} {record.req2_content}
            </Popover>
            )
        }
    },

    // {
    //   title: 'Cos',
    //   dataIndex: 'cos',
    //   width: '8%',
    //   filteredValue: filteredInfo.cos || null,
    // },
    // {
    //   title: 'Opposites',
    //   dataIndex: 'opposite_overlap_count',
    //   width: '8%',
    //   filters: [
    //     { text: 'Non Zeros', value: 0.0 },
    //   ],
    //   filteredValue: filteredInfo.opposite_overlap_count || null,
    //   onFilter: (value: any, record:Conflict) => (+record?.opposite_overlap_count) > value,
    // },
    // {
    //   title: 'Pos Ratio',
    //   dataIndex: 'pos_overlap_ratio',
    //   width: '8%',
    //   filteredValue: filteredInfo.pos_overlap_ratio || null,
    // },
    {
      title: 'Decision',
      dataIndex: 'decision',
      width: '8%',
      filters: [
        { text: 'Safe', value: "No" },
        { text: 'Conflicts', value: "Yes" },
      ],
      filteredValue: filteredInfo.decision || null,
      onFilter: (value: any, record:Conflict) => record?.decision == value,
      render: (_: any, record: Conflict) => {
        return dataSource.length >= 1 ? (
          <span className='flex gap-3'>
          {/* <Popconfirm title="Sure to extract conflcits? Previous customization will be reset!" onConfirm={() => handleDelete(record.id)}>
            <PlayCircleOutlined style={{color:'#222E3C'}}/>
          </Popconfirm> */}
          {record.decision=="Yes"?
          <Tag color='red' onClick={()=>alert("Mark as Safe")} title={"Conflicts! Mark as Safe?"}>Conflicts</Tag>
          :
        <Tag color='green' onClick={()=>alert("Mark as Conflicting")} title={"Safe! Mark as Conflicting?"}>Safe</Tag>}
          
          </span>
        ) : <></>
      }
    },
    // {
    //     title: 'operation',
    //     dataIndex: 'operation',
    //     render: (_: any, record: Conflict) => {
    //       return dataSource.length >= 1 ? (
    //         <span className='flex gap-3'>
    //         {/* <Popconfirm title="Sure to extract conflcits? Previous customization will be reset!" onConfirm={() => handleDelete(record.id)}>
    //           <PlayCircleOutlined style={{color:'#222E3C'}}/>
    //         </Popconfirm> */}
    //         <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
    //           <DeleteOutlined style={{color:'red'}}/>
    //         </Popconfirm>
            
    //         </span>
    //       ) : <></>
    //     }
    //   },
  ];

//   const [open, setOpen] = useState(false);
  const {raiseNotification} = useNotification();

//   const onCreate = async (values: any) => {
//     console.log('Received values of form: ', values);
//     try{
//       await create(`requirement`,values)
//       raiseNotification("success","Requirement successfully added!")
//     } catch(e){
//       raiseNotification("error","Requirement creation failed!")
//       console.log("error: ",e);
//     }
//       // console.log(res);
//       refetch()
//     setOpen(false);
//   };

const fields = [
  "req1_content",
  "req2_content",
  "Req_2",
  "cos",
  "pos_overlap_ratio",
  "opposite_overlap_count",
  'jaccard',
  'euclidean',
  'levenshtein',
  'jensen_shannon',
  'ngram',
  'bm25',
  "decision"
]
const fileName = project_id?.toString() + '_report'
const exportType =  exportFromJSON.types.csv

  if(isLoading) return <Loading/>

  else return (
    <div>
      {/* <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
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
          ]}
        />
        <Button onClick={()=>exportFromJSON({ data, fileName, exportType, fields })}>Export</Button>
        </div>
        {/* <CollectionCreateForm
            project_id={project_id}
            document_id={document_id}
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          /> */}
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
          {/* <FloatButton
            shape="circle"
            type="primary"
            style={{ right: 36 }}
            icon={<AppstoreAddOutlined />}
            onClick={() => {
              setOpen(true);
            }}
          /> */}
          
    </div>
  );
};

export default DocumentConflicts;