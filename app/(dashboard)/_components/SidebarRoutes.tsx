"use client"

import { BookMarked, Compass, Home, List, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import SidebarRouteItem from './SidebarRouteItem';
const adminRoutes = [
    {
        icon : List,
        label : "Jobs",
        href : "/admin/jobs"
    },
    {
        icon : List,
        label : "Companies",
        href : "/admin/companies"
    },
    {
        icon : Compass,
        label : "Analytics",
        href : "/admin/analytics"
    },
];
const guestRoutes = [
    {
        icon : Home,
        label : "Home",
        href : "/"
    },
    {
        icon : Compass,
        label : "Search",
        href : "/search"
    },
    {
        icon : User,
        label : "Profile",
        href : "/profile"
    },
    {
        icon : BookMarked,
        label : "Saved Jobs",
        href : "/savedJobs"
    },
];
const SidebarRoutes = () => {
    const pathName = usePathname();
    const router = useRouter();
    const isAdminPage = pathName?.startsWith("/admin");
    const routes = isAdminPage ? adminRoutes : guestRoutes;
  return (
    <div className='flex flex-col w-full'>
        {
            routes.map((route)=>(
                <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href}/>
            ))
        }
    </div>
  )
}

export default SidebarRoutes