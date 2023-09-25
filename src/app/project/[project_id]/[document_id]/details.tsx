import { useNotification } from '@/app/contexts/notification.context';
import { edit } from '@/app/utils/api'
import { EditFilled, EditTwoTone } from '@ant-design/icons'
import { Button, Form, Input, Popconfirm } from 'antd'
import React from 'react'

function Details({params}:{params:{requirement_id:string, content:string}}) {
    const [form] = Form.useForm();
    const {raiseNotification} = useNotification()
    async function editRecord(content:string){
        console.log(content);
        
        try{
            await edit(`requirement/${params.requirement_id}`, {'content':content})
            raiseNotification("success","Requirement editted successfully!")
        } catch{
            raiseNotification("error","Requirement editing failed!")
        }
    }
  return (
    <Form
    form={form}
    layout="inline"
    name="form_for_reqs"
    initialValues={{ modifier: 'public' }}
    className='w-[800px] border border-slate-500 rounded-md'
  >
    <Form.Item
      name="content"
      initialValue={params.content}
      className='w-[750px]'
    >
      <Input.TextArea rows={2}/>
    </Form.Item>
    <Form.Item>
    {/* <div onClick={()=>{
        form.getFieldValue('content')?editRecord(form.getFieldValue('content')):null
    }} title='Edit' className='hover:cursor-pointer'> */}
        <Popconfirm title="Sure to edit?" onConfirm={() => editRecord(form.getFieldValue('content'))}>
            <EditTwoTone/>
          </Popconfirm>
    {/* </div> */}
    </Form.Item>
  </Form>
  )
}

export default Details