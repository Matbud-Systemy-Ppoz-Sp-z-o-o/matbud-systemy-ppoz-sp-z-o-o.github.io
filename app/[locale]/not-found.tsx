import { getDictionary } from "@/lib/dictionaries"
import { i18n } from "@/lib/i18n-config"
import { NotFoundLink } from "@/components/not-found-link"

export default async function LocaleNotFound({
  params,
}: {
  params?: Promise<{ locale: string }> | { locale: string }
}) {
  let locale: string
  if (params) {
    if (params instanceof Promise) {
      const resolvedParams = await params
      locale = resolvedParams?.locale || i18n.defaultLocale
    } else {
      locale = params?.locale || i18n.defaultLocale
    }
  } else {
    locale = i18n.defaultLocale
  }
  
  // Ensure locale is valid
  if (!i18n.locales.includes(locale as any)) {
    locale = i18n.defaultLocale
  }
  
  const dict = await getDictionary(locale)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-4">{dict.notFound?.title || "Page Not Found"}</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        {dict.notFound?.description ||
          "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted."}
      </p>
      <NotFoundLink
        fallbackLocale={locale}
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        {dict.notFound?.backHome || "Return to Home"}
      </NotFoundLink>
    </div>
  )
}

