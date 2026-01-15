"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

interface ContactFormDictionary {
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
}

interface ContactFormProps {
  dictionary: ContactFormDictionary;
  className?: string;
}

export default function ContactForm({ dictionary, className = "" }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const formSchema = z.object({
    name: z.string().min(2, {
      message: dictionary.validation.nameMin,
    }),
    email: z.string().email({
      message: dictionary.validation.emailInvalid,
    }),
    phone: z.string().min(6, {
      message: dictionary.validation.phoneMin,
    }),
    message: z.string().min(10, {
      message: dictionary.validation.messageMin,
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch('https://fotvatzzgsanqjdynkfs.functions.supabase.co/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
        }),
      })

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 405) {
          throw new Error('Method not allowed. Please check if the endpoint supports POST requests.')
        } else if (response.status === 404) {
          throw new Error('Endpoint not found. Please verify the Supabase function URL.')
        } else {
          throw new Error(`Server error: ${response.status}`)
        }
      }

      toast({
        title: dictionary.successTitle,
        description: dictionary.successMessage,
      })

      form.reset()
    } catch (error) {
      console.error('Error submitting contact form:', error)
      
      let errorMessage = "Failed to send message. Please try again later."
      
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = "CORS error: The server needs to be configured to allow requests from this domain."
        } else if (error.message.includes('Method not allowed')) {
          errorMessage = "Server configuration error: POST method not supported."
        } else if (error.message.includes('Endpoint not found')) {
          errorMessage = "Server configuration error: Contact endpoint not found."
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Network error: Unable to connect to the server."
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`bg-card rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-2xl font-bold mb-6">{dictionary.title}</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.nameLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={dictionary.namePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.emailLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={dictionary.emailPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.phoneLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={dictionary.phonePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.messageLabel}</FormLabel>
                <FormControl>
                  <Textarea placeholder={dictionary.messagePlaceholder} rows={5} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {dictionary.submitting}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {dictionary.submit}
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}