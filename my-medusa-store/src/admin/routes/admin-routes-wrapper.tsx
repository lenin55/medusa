import React from 'react'
import { AppWrapper } from '../components/app-wrapper'

type AdminRoutesWrapperProps = {
  Component: React.ComponentType<any>
  props: Record<string, any>
}

/**
 * A wrapper component for all admin routes, including plugin-provided routes.
 * This ensures that all routes have access to the React Query provider.
 */
export const AdminRoutesWrapper = ({ 
  Component, 
  props 
}: AdminRoutesWrapperProps) => {
  return (
    <AppWrapper>
      <Component {...props} />
    </AppWrapper>
  )
}