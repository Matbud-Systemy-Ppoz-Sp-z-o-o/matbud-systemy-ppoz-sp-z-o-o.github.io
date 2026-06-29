"use client"

import { Button } from "@/components/ui/button"

interface ApplyButtonProps {
  jobTitle: string
  children: React.ReactNode
  variant?: "default" | "outline-solid"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ApplyButton({ jobTitle, children, variant = "default", size = "default", className }: ApplyButtonProps) {
  const handleApply = () => {
    const subject = encodeURIComponent(`Aplikacja na stanowisko: ${jobTitle}`)
    const mailtoLink = `mailto:praca@matbud.net?subject=${subject}`
    window.open(mailtoLink, '_blank')
  }

  return (
    <Button 
      onClick={handleApply}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  )
} 