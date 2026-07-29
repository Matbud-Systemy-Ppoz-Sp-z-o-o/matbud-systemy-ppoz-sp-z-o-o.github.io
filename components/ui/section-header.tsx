interface SectionHeaderProps {
  title: string
  subtitle?: string
  /** Left-aligned with a brand flame-bar is the default; center where a section genuinely needs it. */
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center"

  return (
    <div className={`mb-12 ${centered ? "text-center" : ""} ${className}`}>
      <span
        aria-hidden="true"
        className={`flame-bar block h-1 w-12 rounded-full ${centered ? "mx-auto" : ""}`}
      />
      <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg text-muted-foreground sm:text-xl ${
            centered ? "mx-auto max-w-3xl" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
