import React from 'react'
import { Button } from '../custom/button'
import { IconChevronLeft } from '@tabler/icons-react'

interface HeaderProps {
    label: string
    icon: any
  }
  export const PageHeader: React.FC<HeaderProps> = ({ label, icon }) => {
    return (
      <div className='mb-2 flex items-center justify-start space-x-2 space-y-2 '>
        { label.includes('Create')? (
          <Button
          variant='outline'
          size='icon'
          className='mt-3 w-20 items-center justify-start hover:text-white'
          onClick={() => history.back()}
        >
          <IconChevronLeft size={30}  />
          Back
        </Button> 
        ):(
          <></>
        )}
       
        {icon}
        <h3 className='text-2xl font-bold tracking-tight'>{label}</h3>
      </div>
    )
  }
