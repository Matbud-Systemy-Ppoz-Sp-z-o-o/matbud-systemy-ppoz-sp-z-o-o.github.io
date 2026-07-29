import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"

interface StatItem {
  value: string;
  label: string;
}

interface Dictionary {
  title: string;
  subtitle: string;
  historyTitle: string;
  historyContent: string;
  missionTitle: string;
  missionContent: string;
  valuesTitle: string;
  values: string[];
  stats: StatItem[];
  aboutImageAlt: string;
}

export default function AboutUs({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container">
        <SectionHeader title={dictionary.title} subtitle={dictionary.subtitle} />

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden rounded-xl ring-1 ring-border shadow-sm">
            <Image
              src="https://matbud.net/images/gallery/ONas.webp"
              alt={dictionary.aboutImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1400px) 50vw, 650px"
              className="object-cover"
              style={{ objectPosition: '66% center' }}
              loading="lazy"
              quality={30}
              decoding="async"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{dictionary.historyTitle}</h3>
            <p className="text-muted-foreground">{dictionary.historyContent}</p>

            <h3 className="text-2xl font-bold">{dictionary.missionTitle}</h3>
            <p className="text-muted-foreground">{dictionary.missionContent}</p>

            <div className="space-y-4 mt-6">
              <h4 className="text-xl font-semibold">{dictionary.valuesTitle}</h4>
              <ul className="space-y-2">
                {dictionary.values.map((value: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-muted/40 p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
            {dictionary.stats.map((stat: StatItem, index: number) => (
              <div key={index} className="text-center sm:px-6">
                <p className="font-display text-5xl font-extrabold tracking-tight text-primary md:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-muted-foreground md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
