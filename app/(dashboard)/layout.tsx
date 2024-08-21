import React from 'react';
import Navbar from './_components/Navbar';
import Sidebar from './_components/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {/* Header */}
      <header className="h-20 md:pl-56 fixed inset-y-0 w-full z-50">
      <Navbar />
      </header>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 ">
        {/* Sidebar */}
       <Sidebar/>
      </div>

        {/* Main Content */}
        <main className='md:pl-56 pt-20 h-full'>
          {children}
        </main>
    </div>
  );
};

export default DashboardLayout;
