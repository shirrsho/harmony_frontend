import React from 'react'

function Topbar() {

  return (
    <div className="bg-[#001529] text-white shadow w-full p-5 pl-20 pr-20 fixed flex items-center justify-between z-50">
      <h3>Harmony</h3>
      <button className="py-1 px-4 rounded-md decoration-none text-gray-600 border hover:text-red-600 hover:border-red-100">
        Donate
      </button>
    </div>
  )
}

export default Topbar