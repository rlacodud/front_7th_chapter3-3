import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactNode, useState } from "react"

interface QueryClientProviderProps {
  children: ReactNode
}

export const AppQueryClientProvider = ({ children }: QueryClientProviderProps) => {
  // 페이지 이동 시 클라이언트가 초기화되는 것을 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false, // 탭 전환시 자동 재요청 방지
            retry: 1, // 실패시 1번만 재시도
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
