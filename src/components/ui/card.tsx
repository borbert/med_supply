import * as React from "react"

interface BaseProps {
  className?: string
  children?: React.ReactNode
}

interface CardProps extends BaseProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> {}
interface CardHeaderProps extends BaseProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> {}
interface CardTitleProps extends BaseProps, Omit<React.HTMLAttributes<HTMLHeadingElement>, keyof BaseProps> {}
interface CardDescriptionProps extends BaseProps, Omit<React.HTMLAttributes<HTMLParagraphElement>, keyof BaseProps> {}
interface CardContentProps extends BaseProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> {}
interface CardFooterProps extends BaseProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseProps> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
      {...rest}
    >
      {children}
    </h3>
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...rest}
    >
      {children}
    </p>
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <div
      ref={ref}
      className={`p-6 pt-0 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>((props, ref) => {
  const { className = "", children, ...rest } = props
  return (
    <div
      ref={ref}
      className={`flex items-center p-6 pt-0 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
})
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
