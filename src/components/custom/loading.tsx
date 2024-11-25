import React from 'react'
import { Spinner } from './spinner'

interface LoadingProps {
  timeout: number
}


export const Loading: React.FC<LoadingProps> = ({ timeout }) => {
  const [timeOut, setTimeOut] = React.useState(true)


React.useEffect(() => {
  setTimeout(() => {
    setTimeOut(false)
    console.log("time out");
    
  }, 4000 + timeout)
}, [])

  return (
    <>
      <div className={`mx-auto items-center`}>
        {timeOut ? (
          <Spinner size={'medium'}>
            <span>Loading data...</span>
          </Spinner>
        ) : (
          <span className={'flex items-center justify-center'}>
            No data.
          </span>
        )}
      </div>
    </>
  )
}
