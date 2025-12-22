"use client"

import { MapPin, Phone, Mail } from "lucide-react"
import GoogleMaps from "@/components/google-maps"

interface Dictionary {
  title: string;
  subtitle: string;
  contactInfo: {
    title: string;
    addressTitle: string;
    phoneTitle: string;
    emailTitle: string;
    hoursTitle: string;
    weekdays: string;
    saturday: string;
    sunday: string;
    closed: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  form: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    validation: {
      nameMin: string;
      emailInvalid: string;
      phoneMin: string;
      messageMin: string;
    };
  };
}

export default function Contact({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section id="contact" className="py-16 md:py-24 bg-background border-b border-border">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{dictionary.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{dictionary.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-full">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">{dictionary.contactInfo.title}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">{dictionary.contactInfo.addressTitle}</h4>
                    <address className="not-italic text-muted-foreground">
                      {dictionary.contactInfo.address}
                    </address>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">{dictionary.contactInfo.phoneTitle}</h4>
                    <p className="text-muted-foreground">
                      <a href={`tel:${dictionary.contactInfo.phone}`} className="hover:text-primary transition-colors">
                        {dictionary.contactInfo.phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium">{dictionary.contactInfo.emailTitle}</h4>
                    <p className="text-muted-foreground">
                      <a href={`mailto:${dictionary.contactInfo.email}`} className="hover:text-primary transition-colors">
                        {dictionary.contactInfo.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium mb-4">{dictionary.contactInfo.hoursTitle}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>{dictionary.contactInfo.weekdays}</span>
                    <span>{dictionary.contactInfo.hours}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>{dictionary.contactInfo.saturday} - {dictionary.contactInfo.sunday}</span>
                    <span>{dictionary.contactInfo.closed}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-full">
            <GoogleMaps className="h-full" />
          </div>
        </div>
      </div>
    </section>
  )
}