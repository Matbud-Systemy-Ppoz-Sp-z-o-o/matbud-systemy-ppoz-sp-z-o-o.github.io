import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getDictionary } from "@/lib/dictionaries"
import { getAllPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return generateSEOMetadata({
    title: dict.blog.title,
    description: dict.blog.description,
    locale,
    path: "blog",
    type: "website",
  })
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: PageProps) {
  // Await the params object to get the locale
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const dict = await getDictionary(locale)
  const posts = await getAllPosts(locale)

  return (
    <section className="container py-12 md:py-24">
      <StructuredData
        type="breadcrumb"
        data={[
          { name: "Strona główna", url: `https://matbud.net/${locale}` },
          { name: "Blog", url: `https://matbud.net/${locale}/blog` },
        ]}
      />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{dict.blog.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dict.blog.description}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.slug} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 w-full">
              <Image
                src={post.coverImage || "https://matbud.net/placeholder.svg?height=200&width=400"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={`/${locale}/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{formatDate(post.date, locale)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/blog/${post.slug}`} className="text-primary font-medium hover:underline">
                {dict.blog.readMore}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}