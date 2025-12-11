import { BrowserRouter } from "react-router-dom"

interface RouterProviderProps {
  children: React.ReactNode
}

export const AppRouterProvider = ({ children }: RouterProviderProps) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

