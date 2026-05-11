import React from "react"
import { Navigate } from "react-router-dom"
import { checkDependencies } from "../config/config"


const missing = checkDependencies()

export const AppGuard = ({ children }) => {
  if (missing) {
    return <Navigate to="/missing" replace />
  }

  return children
}