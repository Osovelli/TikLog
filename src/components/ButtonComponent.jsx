import React from 'react'
import { Button } from './ui/button'

export const ButtonComponent = ({
    label,
    buttonStyles,
    icon,
    variant,
    ...props
    
}) => {
  return (
    <div>
        <Button
        {...props}
        variant={variant}
        className={`'w-full flex items-center justify-center h-[52px] shadow-sm' ${buttonStyles}`}
        >
          <div className='px-1'>
           {icon}
          </div>
          <div className=''>
            {label}
          </div>      
        </Button>
    </div>
  )
}
