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
    <section className="hero-image relative">
      <div className="container hero-content text-white flex flex-col items-center justify-center min-h-[600px] py-12">
        <div className="flex flex-col items-center w-full max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-0">
            <Image
              src="/logo_pelne_tlo_w_tarczy.svg"
              alt="Logo"
              width={400}
              height={400}
              className="w-auto h-auto max-w-[350px] max-h-[350px] sm:max-w-[450px] sm:max-h-[450px] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] dark:drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
              priority
              fetchPriority="high"
            />
          </div>
          
          {/* Content */}
          <div className="flex flex-col items-center space-y-8 text-center -mt-6">
            <p className="text-xl sm:text-2xl max-w-[700px] leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] -mt-8">{dictionary.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-white px-6 py-3">
                <Link href="#contact">{dictionary.primaryCta}</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 dark:hover:bg-white/20 px-6 py-3"
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