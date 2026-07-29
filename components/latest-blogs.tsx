import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getAllPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Dictionary {
  title: string;
  subtitle: string;
  viewAllButton: string;
  readMore: string;
}

interface LatestBlogsProps {
  locale: string;
  dictionary: Dictionary;
}

export default async function LatestBlogs({ locale, dictionary }: LatestBlogsProps) {
  const allPosts = await getAllPosts(locale)
  const latestPosts = allPosts.slice(0, 3) // Get the 3 most recent posts

  // Don't render the section if there are no posts
  if (allPosts.length === 0) {
    return null
  }

  return (
    <section id="blog" className="py-16 md:py-24 bg-muted/30 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <span aria-hidden="true" className="flame-bar block h-1 w-12 rounded-full" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.08] text-foreground">{dictionary.title}</h2>
            <p className="mt-4 text-lg sm:text-xl text-foreground/80 max-w-2xl">{dictionary.subtitle}</p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-primary hover:bg-primary-dark">
            <Link href={`/${locale}/blog`} className="flex items-center gap-2">
              {dictionary.viewAllButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Card key={post.slug} className="group overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg border border-border">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.coverImage || "https://matbud.net/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardDescription>{formatDate(post.date, locale)}</CardDescription>
                <CardTitle className="line-clamp-2">
                  <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <p className="line-clamp-3 text-foreground/70">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="text-primary font-medium hover:underline flex items-center gap-1"
                >
                  {dictionary.readMore}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
