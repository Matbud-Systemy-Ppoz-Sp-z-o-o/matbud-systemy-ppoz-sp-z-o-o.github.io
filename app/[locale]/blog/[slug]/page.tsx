import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { ChevronLeft } from "lucide-react"
import { getDictionary } from "@/lib/dictionaries"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { generateMetadata as generateSEOMetadata, baseUrl } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"

const Markdown = dynamic(() => import("@/components/markdown").then(mod => ({ default: mod.Markdown })), {
  loading: () => <div className="animate-pulse bg-muted h-96 rounded-md" />,
})

interface PostPageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata({ 
  params 
}: PostPageProps): Promise<Metadata> {
  const paramsCopy = await Promise.resolve(params)
  const locale = paramsCopy.locale
  const slug = paramsCopy.slug
  
  const post = await getPostBySlug(slug, locale)
  const dict = await getDictionary(locale)

  if (!post) {
    return {
      title: dict.blog.postNotFound,
    }
  }

  const url = `${baseUrl}/${locale}/blog/${slug}`
  const image = post.coverImage || `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    locale,
    path: `blog/${slug}`,
    type: "article",
    image,
    publishedTime: post.date,
    authors: [dict.common.companyName],
  })
}

export async function generateStaticParams() {
  const locales = ["pl", "en"] // Available locales from i18n config
  const allParams: { locale: string; slug: string }[] = []
  
  for (const locale of locales) {
    const posts = await getAllPosts(locale)
    const localeParams = posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
    allParams.push(...localeParams)
  }
  
  return allParams
}

export default async function PostPage({ 
  params 
}: PostPageProps) {
  const paramsCopy = await Promise.resolve(params)
  const locale = paramsCopy.locale
  const slug = paramsCopy.slug
  
  const dict = await getDictionary(locale)
  const post = await getPostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

  const postUrl = `${baseUrl}/${locale}/blog/${slug}`
  const postImage = post.coverImage || `${baseUrl}/logo_pelne_tlo_w_tarczy.svg`

  return (
    <article className="container py-12 max-w-4xl">
      <StructuredData
        type="article"
        data={{
          title: post.title,
          description: post.excerpt,
          url: postUrl,
          image: postImage,
          publishedTime: post.date,
          author: dict.common.companyName,
        }}
      />
      <StructuredData
        type="breadcrumb"
        data={[
          { name: "Strona główna", url: `${baseUrl}/${locale}` },
          { name: "Blog", url: `${baseUrl}/${locale}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      <Link href={`/${locale}/blog`} className="flex items-center text-muted-foreground hover:text-primary mb-8">
        <ChevronLeft className="mr-2 h-4 w-4" />
        {dict.blog.backToBlog}
      </Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
        <div className="flex items-center text-muted-foreground mb-6">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </div>
        {post.coverImage && (
          <div className="relative h-[400px] w-full mb-8">
            <Image
              src={post.coverImage || "https://matbud.net/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown content={post.content} />
      </div>
    </article>
  )
}