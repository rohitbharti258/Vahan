import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'

const Dashboard = () => {
  return (
    <div>
        <Navbar/>
        <Outlet />
    </div>
  )
}

export default Dashboard