import React, { useState, useEffect } from 'react'
import { Home, User, Wallet, Bell, Tag, List, BarChart2, Settings, ChevronUp, Menu, X } from 'lucide-react'
import { Logo } from '@/icon/Icons'
import { SidebarProfile } from './SidebarProfile'
import { Button } from "@/components/ui/button"
import { Link, useLocation } from 'react-router-dom'

const SidebarItem = ({ icon, text, routeName}) => {
  const location = useLocation();
  const active = location.pathname === `/${routeName}`;

  return (
    <Link to={`/${routeName}`}>
      <li className={`flex items-center p-2 rounded-lg cursor-pointer ${active ? 'bg-gray-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
      {icon}
      <span className="ml-3">{text}</span>
      </li>
    </Link>
  )
}

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the 'md' breakpoint in Tailwind
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 h-full left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="hidden p-6 ml-9 sm:ml-0">
            <Logo />
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 px-4 mt-10 overflow-y-auto">
            <p className="text-gray-500 text-sm mb-4 px-2">Activity</p>
            <nav className="space-y-1">
              <SidebarItem icon={<Home size={20} />} text="Home" routeName={''} />
              <SidebarItem icon={<User size={20} />} text="Profile" routeName={'profile'}/>
              <SidebarItem icon={<Wallet size={20} />} text="Wallet" routeName={'wallet'} />
              <SidebarItem icon={<Bell size={20} />} text="Notifications" routeName={'notification'} />
              <SidebarItem icon={<Tag size={20} />} text="Deals" routeName={'deals'}/>
              <SidebarItem icon={<List size={20} />} text="My deliveries" routeName={'delivery'} />
              <SidebarItem icon={<BarChart2 size={20} />} text="Statistics" routeName={'statistics'}/>
              <SidebarItem icon={<Settings size={20} />} text="Settings" routeName={'settings'} />
            </nav>
          </div>
          
          {/* User Profile Section */}
          <SidebarProfile
            name="John Messi Doe"
            phoneNumber="08100000000"
            avatarUrl="Avatar1.png"
            isVerified={true}
          />
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}