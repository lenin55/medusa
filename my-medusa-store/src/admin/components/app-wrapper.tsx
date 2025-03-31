import React from 'react'
import { ReactQueryProvider } from '../providers/react-query-provider'

type AppWrapperProps = {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  )
}