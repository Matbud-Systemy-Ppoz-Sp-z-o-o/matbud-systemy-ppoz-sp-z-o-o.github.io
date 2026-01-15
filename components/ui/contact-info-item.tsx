import { LucideIcon } from "lucide-react"

interface ContactInfoItemProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

export function ContactInfoItem({ icon: Icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
      <div>
        <h4 className="font-medium">{title}</h4>
        {children}
      </div>
    </div>
  )
}
