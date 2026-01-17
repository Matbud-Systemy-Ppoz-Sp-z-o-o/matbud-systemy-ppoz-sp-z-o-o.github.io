import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react"
import { getDictionary } from "@/lib/dictionaries"
import { getJobs } from "@/content/jobs"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import { StructuredData } from "@/components/structured-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ApplyButton } from "@/components/apply-button"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return generateSEOMetadata({
    title: dict.careers.title,
    description: dict.careers.description,
    locale,
    path: "careers",
    type: "website",
  })
}

export default async function CareersPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const dict = await getDictionary(locale)
  const jobs = await getJobs()
  const activeJobs = jobs.filter(job => job.isActive)

  return (
    <div className="min-h-screen">
      <StructuredData
        type="breadcrumb"
        data={[
          { name: dict.breadcrumbs.home, url: `https://matbud.net/${locale}` },
          { name: dict.careers.title, url: `https://matbud.net/${locale}/careers` },
        ]}
      />
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-foreground">
              {dict.careers.title}
            </h1>
            <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              {dict.careers.subtitle}
            </p>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {dict.careers.description}
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
              {dict.careers.whyJoinUs.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dict.careers.whyJoinUs.items.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  <p className="text-foreground/80">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
              {dict.careers.availableJobsTitle}
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              {dict.careers.availableJobsDescription}
            </p>
          </div>

          {activeJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-foreground">
                        <Link 
                          href={`/${locale}/careers/${job.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                      </CardTitle>
                      <Badge variant="secondary" className="ml-2">
                        {dict.careers.jobTypes[job.type]}
                      </Badge>
                    </div>
                    <CardDescription className="text-foreground/70">
                      {job.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/${locale}/careers/${job.id}`}>
                          {dict.careers.details}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <ApplyButton jobTitle={job.title} className="flex-1">
                        {dict.careers.jobDetails.applyNow}
                      </ApplyButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {dict.careers.noJobsAvailable}
                </h3>
                <p className="text-foreground/70 mb-6">
                  {dict.careers.checkBackLater}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 