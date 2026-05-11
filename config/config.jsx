import React from "react"
import { Navigate } from "react-router-dom"


/* eslint-disable react-refresh/only-export-components */
export const config ={

    VITE_BACKEND_API :import.meta.env.VITE_BACKEND_API,
    GD: import.meta.env.GD

} 


export const checkDependencies = () => {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      return key
    }
  }
  return null
}


export const DependencyError = ({ value }) => {
  return <div>Missing: {value}</div>
}
/* eslint-enable react-refresh/only-export-components */