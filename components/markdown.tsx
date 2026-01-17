"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

const ReactMarkdown = dynamic(() => import("react-markdown"), { 
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted h-96 rounded-md" />
})

interface CodeProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export function Markdown({ content }: { content: string }) {
  const [mounted, setMounted] = useState(false)

  const [plugins, setPlugins] = useState<{ remark: any; rehype: any[] } | null>(null)

  useEffect(() => {
    setMounted(true)
    Promise.all([
      import("remark-gfm"),
      import("rehype-raw"),
      import("rehype-sanitize")
    ]).then(([gfm, raw, sanitize]) => {
      setPlugins({
        remark: gfm.default,
        rehype: [raw.default, sanitize.default]
      })
    })
  }, [])

  if (!mounted || !plugins) {
    return <div className="animate-pulse bg-muted h-96 rounded-md" />
  }

  return (
    <article className="max-w-4xl mx-auto leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[plugins.remark]}
        rehypePlugins={plugins.rehype}
        components={{
          h1: ({ ...props }) => (
            <h1 
              className="text-5xl font-bold text-foreground mb-8 mt-12 leading-tight tracking-tight" 
              {...props} 
            />
          ),
          h2: ({ ...props }) => (
            <h2 
              className="text-3xl font-semibold text-foreground mb-6 mt-10 leading-tight tracking-tight" 
              {...props} 
            />
          ),
          h3: ({ ...props }) => (
            <h3 
              className="text-2xl font-semibold text-foreground mb-4 mt-8 leading-tight" 
              {...props} 
            />
          ),
          h4: ({ ...props }) => (
            <h4 
              className="text-xl font-semibold text-foreground mb-3 mt-6 leading-tight" 
              {...props} 
            />
          ),
          p: ({ ...props }) => (
            <p 
              className="text-lg text-muted-foreground mb-8 leading-8" 
              {...props} 
            />
          ),
          ul: ({ ...props }) => (
            <ul 
              className="mb-8 space-y-3 marker:text-primary marker:font-semibold" 
              {...props} 
            />
          ),
          ol: ({ ...props }) => (
            <ol 
              className="mb-8 space-y-3 marker:text-primary marker:font-semibold" 
              {...props} 
            />
          ),
          li: ({ ...props }) => (
            <li 
              className="text-lg text-muted-foreground leading-7 pl-2" 
              {...props} 
            />
          ),
          a: ({ ...props }) => (
            <a 
              className="text-primary font-medium border-b border-primary/30 hover:border-primary transition-colors duration-200" 
              {...props} 
            />
          ),
          blockquote: ({ ...props }) => (
            <blockquote 
              className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent py-6 px-8 my-10 italic text-xl text-muted-foreground font-medium leading-relaxed relative" 
              {...props} 
            />
          ),
          code: ({ inline, children, ...props }: CodeProps) =>
            inline ? (
              <code 
                className="bg-muted/80 text-foreground px-2 py-1 rounded text-sm font-mono border border-border/50" 
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-muted/50 border border-border rounded-xl p-6 overflow-x-auto my-8 shadow-sm">
                <code 
                  className="text-sm font-mono text-foreground leading-relaxed" 
                  {...props}
                >
                  {children}
                </code>
              </pre>
            ),
          img: ({ src, alt, ...props }: any) => (
            <figure className="my-12">
              <div className="relative w-full h-auto">
                <Image
                  src={typeof src === 'string' ? src : ''}
                  alt={alt || ""}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="rounded-2xl shadow-lg border border-border/50 max-w-full h-auto hover:shadow-xl transition-all duration-300"
                  loading="lazy"
                  quality={60}
                  decoding="async"
                  {...props}
                />
              </div>
              {alt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-4 italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-10 border border-border rounded-xl shadow-sm">
              <table 
                className="w-full border-collapse" 
                {...props} 
              />
            </div>
          ),
          th: ({ ...props }) => (
            <th 
              className="border border-border bg-muted/70 p-4 text-left font-semibold text-foreground text-lg" 
              {...props} 
            />
          ),
          td: ({ ...props }) => (
            <td 
              className="border border-border p-4 text-muted-foreground text-base" 
              {...props} 
            />
          ),
          strong: ({ ...props }) => (
            <strong 
              className="text-foreground font-semibold" 
              {...props} 
            />
          ),
          em: ({ ...props }) => (
            <em 
              className="text-muted-foreground italic" 
              {...props} 
            />
          ),
          hr: ({ ...props }) => (
            <hr 
              className="border-t-2 border-border/30 my-12" 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
