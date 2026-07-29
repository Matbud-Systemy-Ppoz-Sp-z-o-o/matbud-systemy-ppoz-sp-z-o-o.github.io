import { FileCheck, Wrench, Building, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
}

interface DictionaryType {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  closingMessage: string;
}

export default function Services({ dictionary }: { dictionary: DictionaryType }) {
  const serviceIcons = [
    { icon: <Wrench className="h-10 w-10 text-primary" />, name: "Maintenance Services" },
    { icon: <Building className="h-10 w-10 text-primary" />, name: "Installation Services" },
    { icon: <FileCheck className="h-10 w-10 text-primary" />, name: "Design Services" },
    { icon: <Bell className="h-10 w-10 text-primary" />, name: "Emergency Lighting" },
  ]

  return (
    <section id="services" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <SectionHeader title={dictionary.title} subtitle={dictionary.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dictionary.services.map((service, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden h-full flex flex-col hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              {/* Flame-bar reveal along the top edge on hover */}
              <span
                aria-hidden="true"
                className="flame-bar absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              />
              <CardHeader className="shrink-0">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  {serviceIcons[index].icon}
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2.5 text-muted-foreground text-sm flex-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <p className="relative max-w-3xl border-l-2 border-primary/60 pl-5 text-lg text-muted-foreground">
            {dictionary.closingMessage}
          </p>
        </div>
      </div>
    </section>
  )
}
