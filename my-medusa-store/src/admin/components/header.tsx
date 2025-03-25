// src/admin/components/Header.tsx
import { Container, Heading } from "@medusajs/ui"
import React from "react"

type Action = {
  type: "custom" | "button"
  label?: string
  onClick?: () => void
  children?: React.ReactNode
}

interface HeaderProps {
  title: string
  actions?: Action[]
}

export const Header = ({ title, actions }: HeaderProps) => {
  return (
    <div className=" flex justify-between items-center">
      <Heading>
        {title}
      </Heading>
      
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            if (action.type === "custom" && action.children) {
              return <React.Fragment key={index}>{action.children}</React.Fragment>
            }
            
            return null
          })}
        </div>
      )}
    </div>
  )
}