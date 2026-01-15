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
            <Card key={index} className="border-2 border-muted hover:border-primary/50 transition-colors h-full flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="mb-4">{serviceIcons[index].icon}</div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm flex-1">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground italic max-w-3xl mx-auto">
            {dictionary.closingMessage}
          </p>
        </div>
      </div>
    </section>
  )
}
