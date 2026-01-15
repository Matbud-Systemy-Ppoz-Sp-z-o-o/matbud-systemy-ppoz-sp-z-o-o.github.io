import Image from "next/image"
import { CheckCircle } from "lucide-react"

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{dictionary.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dictionary.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <div className="relative min-h-[500px] md:min-h-[600px]">
            <Image
              src="https://matbud.net/images/gallery/ONas.jpeg"
              alt={dictionary.aboutImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-lg"
              style={{ objectPosition: '66% center' }}
              loading="lazy"
              quality={85}
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
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-3xl mx-auto">
          {dictionary.stats.map((stat: StatItem, index: number) => (
            <div key={index} className="space-y-2">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
