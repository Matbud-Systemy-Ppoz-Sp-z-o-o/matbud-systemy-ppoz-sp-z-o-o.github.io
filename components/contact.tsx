"use client"

import dynamic from "next/dynamic"
import { MapPin, Phone, Mail } from "lucide-react"
import { SectionHeader } from "@/components/ui/section-header"
import { ContactInfoItem } from "@/components/ui/contact-info-item"

const GoogleMaps = dynamic(() => import("@/components/google-maps"), {
  loading: () => <div className="bg-card rounded-lg shadow-sm h-full min-h-[450px] animate-pulse" />,
  ssr: false,
})

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
        <SectionHeader title={dictionary.title} subtitle={dictionary.subtitle} />

        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-full">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border h-full flex flex-col">
              <h3 className="text-2xl font-bold mb-6">{dictionary.contactInfo.title}</h3>

              <div className="space-y-6">
                <ContactInfoItem icon={MapPin} title={dictionary.contactInfo.addressTitle}>
                  <address className="not-italic text-muted-foreground">
                    {dictionary.contactInfo.address}
                  </address>
                </ContactInfoItem>

                <ContactInfoItem icon={Phone} title={dictionary.contactInfo.phoneTitle}>
                  <p className="text-muted-foreground">
                    <a href={`tel:${dictionary.contactInfo.phone}`} className="hover:text-primary transition-colors">
                      {dictionary.contactInfo.phone}
                    </a>
                  </p>
                </ContactInfoItem>

                <ContactInfoItem icon={Mail} title={dictionary.contactInfo.emailTitle}>
                  <p className="text-muted-foreground">
                    <a href={`mailto:${dictionary.contactInfo.email}`} className="hover:text-primary transition-colors">
                      {dictionary.contactInfo.email}
                    </a>
                  </p>
                </ContactInfoItem>
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