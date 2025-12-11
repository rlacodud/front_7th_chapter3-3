import { AppQueryClientProvider } from "./query-client-provider"
import { AppRouterProvider } from "./router-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <AppQueryClientProvider>
      <AppRouterProvider>{children}</AppRouterProvider>
    </AppQueryClientProvider>
  )
}

