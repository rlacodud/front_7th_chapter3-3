// 카드 컴포넌트
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />
}
export { Card, CardHeader, CardTitle, CardContent }
