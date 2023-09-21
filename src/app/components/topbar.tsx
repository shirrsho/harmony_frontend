'use client'
import { HeartFilled } from '@ant-design/icons'
import React from 'react'

function Topbar() {

  return (
    <div className="bg-[#222E3C] text-white shadow w-full p-5 pl-20 pr-20 fixed flex items-center justify-between z-50">
      <h3>Harmony</h3>
      <button className="py-1 px-3 rounded-sm decoration-none text-gray-100 border border-gray-100 hover:bg-green-600 hover:border-green-600 transition 0.5s ease-in-out">
        <HeartFilled className='text-green-500 hover:text-white' />      Donate
      </button>
    </div>
  )
}

export default Topbar