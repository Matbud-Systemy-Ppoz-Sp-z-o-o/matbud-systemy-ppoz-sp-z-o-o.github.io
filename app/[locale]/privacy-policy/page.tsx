// Privacy Policy page commented out - not accessible to users
/*
import type { Metadata } from "next"
import { getDictionary } from "@/lib/dictionaries"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return {
    title: `${dict.privacyPolicy.title} | ${dict.common.companyName}`,
    description: dict.privacyPolicy.introduction,
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const dict = await getDictionary(locale)

  return (
    <section className="container py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{dict.privacyPolicy.title}</h1>
          <p className="text-muted-foreground">
            {dict.privacyPolicy.lastUpdated}: {dict.privacyPolicy.lastUpdatedDate}
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg leading-relaxed text-muted-foreground">{dict.privacyPolicy.introduction}</p>
        </div>

        <div className="space-y-12">
          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.dataCollection.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.dataCollection.content}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.dataCollection.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.dataUsage.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.dataUsage.content}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.dataUsage.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.dataSharing.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.dataSharing.content}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.dataSharing.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.dataSecurity.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.dataSecurity.content}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.dataSecurity.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.dataRetention.title}</h2>
            <p className="text-muted-foreground">{dict.privacyPolicy.sections.dataRetention.content}</p>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.yourRights.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.yourRights.content}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.yourRights.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.cookies.title}</h2>
            <p className="text-muted-foreground">{dict.privacyPolicy.sections.cookies.content}</p>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.contact.title}</h2>
            <p className="text-muted-foreground mb-4">{dict.privacyPolicy.sections.contact.content}</p>
            <ul className="space-y-2 text-muted-foreground">
              {dict.privacyPolicy.sections.contact.items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">{dict.privacyPolicy.sections.changes.title}</h2>
            <p className="text-muted-foreground">{dict.privacyPolicy.sections.changes.content}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
*/

import { notFound } from "next/navigation"

export default function PrivacyPolicyPage() {
  notFound()
}
