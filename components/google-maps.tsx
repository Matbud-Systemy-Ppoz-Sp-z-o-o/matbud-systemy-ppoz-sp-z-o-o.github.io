"use client"

interface GoogleMapsProps {
  className?: string;
}

export default function GoogleMaps({ className = "" }: GoogleMapsProps) {
  const placeName = encodeURIComponent("Matbud Systemy Ppoż. Sp. z o.o., Słocin 36F, 62-065 Grodzisk Wielkopolski");
  const mapUrl = `https://www.google.com/maps?q=${placeName}&hl=pl&z=15&output=embed`;

  return (
    <div className={`bg-card rounded-lg shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "450px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full flex-1"
        title="Matbud Systemy Ppoż. - Lokalizacja"
      />
    </div>
  );
}
