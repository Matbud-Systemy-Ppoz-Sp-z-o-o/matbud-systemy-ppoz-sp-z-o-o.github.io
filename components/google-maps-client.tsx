"use client"

import dynamic from "next/dynamic"

const GoogleMaps = dynamic(() => import("@/components/google-maps"), {
  loading: () => <div className="bg-card rounded-lg shadow-sm h-full min-h-[450px] animate-pulse" />,
  ssr: false,
})

interface GoogleMapsClientProps {
  className?: string
}

export default function GoogleMapsClient({ className }: GoogleMapsClientProps) {
  return <GoogleMaps className={className} />
}
