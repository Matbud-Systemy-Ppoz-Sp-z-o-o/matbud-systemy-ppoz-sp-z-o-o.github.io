import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroDictionary {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
}

export default function Hero({ dictionary }: { dictionary: HeroDictionary }) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Optimized hero background image for LCP */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://matbud.net/images/gallery/hero.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          style={{
            filter: 'blur(2px) brightness(0.8) contrast(1.2)',
          }}
          sizes="100vw"
          decoding="sync"
        />
        <div className="absolute inset-0 z-10 bg-linear-to-b from-black/55 via-black/45 to-black/75" />
      </div>
      <div className="container hero-content text-white flex flex-col items-center justify-center min-h-[600px] py-12 relative z-20">
        <div className="flex flex-col items-center w-full max-w-4xl">
          {/* Logo doubles as the page's <h1>: its alt text carries the heading for search engines and screen readers. */}
          <h1 className="flex justify-center mb-0">
            <Image
              src="/logo_pelne_tlo_w_tarczy.svg"
              alt={dictionary.title}
              width={400}
              height={400}
              className="w-auto h-auto max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
              priority
              fetchPriority="high"
              decoding="async"
            />
          </h1>

          {/* Content */}
          <div className="flex flex-col items-center space-y-7 text-center -mt-4">
            <span aria-hidden="true" className="flame-bar block h-1 w-16 rounded-full shadow-[0_1px_6px_rgba(0,0,0,0.4)]" />
            <p className="max-w-[46ch] text-lg sm:text-2xl font-medium leading-relaxed text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
              {dictionary.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md pt-1">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white shadow-lg">
                <Link href="#contact">{dictionary.primaryCta}</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="bg-white/5 border-2 border-white/80 text-white backdrop-blur-xs hover:bg-white/15 hover:border-white"
              >
                <Link href="#services">{dictionary.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}