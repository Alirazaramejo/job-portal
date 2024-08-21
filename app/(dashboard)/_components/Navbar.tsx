import React from 'react'
import NavbarRoutes from './NavbarRoutes'
import MobileSidebar from './MobileSidebar'

const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      {/*  mobile Routes */}
      <MobileSidebar/>

      {/* sidebar routes */}
      <NavbarRoutes/>
    </div>
  )
}

export default Navbar