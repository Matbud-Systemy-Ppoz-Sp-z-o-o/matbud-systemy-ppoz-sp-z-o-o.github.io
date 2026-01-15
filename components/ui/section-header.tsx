interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{title}</h2>
      {subtitle && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
