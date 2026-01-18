import { Logo } from '@/icon/Icons'
import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router'

export const AuthLayout = ({
    title,
    description,
    children,
    authLogo,
}) => {
    const navigate = useNavigate();
  return (
    <div className='h-[100vh] flex flex-col items-center'>
        <header className='w-full flex items-center p-4 h-[10vh]' onClick={() => navigate('/')}>
          <Logo />  
        </header>
        <section className='h-[80vh] flex flex-col justify-center items-center text-center'>
            <div className='space-y-2 max-w-sm'>
                <div>{authLogo}</div>
                <h1 className='text-3xl max-w-sm font-bold'>{title}</h1>
                <p className='text-base font-normal max-w-md'>{description}</p>
                <div className='space-y-3 py-2'>
                    {children}
                </div>
            </div>
        </section>
        <footer className='w-full flex items-center p-6 h-[10vh]'>
            <div className='w-full flex justify-between'>
                <p className='text-sm font-medium'>©2024 Tiklog</p>
                <p className='text-sm font-medium'>Privacy Policy</p>
            </div>
        </footer>
    </div>
  )
}
