import React from "react"
import { checkDependencies, DependencyError } from "../config/config"

const missing = checkDependencies()

export const AppGuard = ({ children }) => {
  if (missing) {
    return <DependencyError value={missing} />
  }

  return children
}