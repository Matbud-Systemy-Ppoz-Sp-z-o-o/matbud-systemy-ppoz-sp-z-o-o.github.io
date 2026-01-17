"use client"

import { useEffect, useRef, useState } from "react";

interface GoogleMapsProps {
  className?: string;
}

export default function GoogleMaps({ className = "" }: GoogleMapsProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Business name to search for Google Business Profile
  const businessName = "Matbud Systemy Ppoż";
  const businessFullName = "Matbud Systemy Ppoż. Sp. z o.o.";
  
  // Coordinates for Słocin 36F, 62-065 Grodzisk Wielkopolski, Polska (fallback)
  const latitude = 52.2276;
  const longitude = 16.3656;
  const address = "Słocin 36F, 62-065 Grodzisk Wielkopolski, Polska";
  
  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  // Google Maps embed URL - search by business name to show Business Profile
  const encodedBusinessName = encodeURIComponent(businessName);
  const iframeUrl = `https://www.google.com/maps?q=${encodedBusinessName}&output=embed&hl=pl&z=15`;

  const initializeMap = () => {
      if (!mapContainerRef.current || !window.google?.maps) {
        return;
      }

      // Use requestAnimationFrame to avoid forced reflows when reading container dimensions
      requestAnimationFrame(() => {
        if (!mapContainerRef.current) return;
        
        try {
          const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        // Use Places API to find the business and show Google Business Profile
        const service = new window.google.maps.places.PlacesService(map);
        
        const request = {
          query: businessName,
          fields: ['name', 'formatted_address', 'place_id', 'geometry', 'rating', 'user_ratings_total', 'opening_hours', 'website', 'formatted_phone_number'],
        };

        service.findPlaceFromQuery(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const place = results[0];
            
            // Center map on the business location
            if (place.geometry?.location) {
              map.setCenter(place.geometry.location);
              
              // Add marker at business location
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name || businessFullName,
              });

              // Create info window with business details
              let content = `
                <div style="padding: 12px; min-width: 200px;">
                  <strong style="font-size: 16px;">${place.name || businessFullName}</strong><br>
              `;
              
              if (place.formatted_address) {
                content += `<div style="margin-top: 8px; color: #666;">${place.formatted_address}</div>`;
              }
              
              if (place.rating) {
                content += `<div style="margin-top: 8px;">
                  <span style="color: #f57c00;">★</span> ${place.rating}`;
                if (place.user_ratings_total) {
                  content += ` (${place.user_ratings_total} opinii)`;
                }
                content += `</div>`;
              }
              
              if (place.formatted_phone_number) {
                content += `<div style="margin-top: 8px;">📞 ${place.formatted_phone_number}</div>`;
              }
              
              if (place.website) {
                content += `<div style="margin-top: 8px;"><a href="${place.website}" target="_blank" style="color: #1976d2;">Strona internetowa</a></div>`;
              }
              
              content += `</div>`;

              const infoWindow = new window.google.maps.InfoWindow({
                content: content,
              });

              marker.addListener("click", () => {
                infoWindow.open(map, marker);
              });

              // Open info window by default
              infoWindow.open(map, marker);
            }
          } else {
            // Fallback: if Places API doesn't find the business, use coordinates
            const marker = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: businessFullName,
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px;">
                  <strong>${businessFullName}</strong><br>
                  ${address}
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });

            infoWindow.open(map, marker);
          }
        });

          mapRef.current = map;
          setMapLoaded(true);
        } catch (error) {
          console.error("Error initializing Google Maps:", error);
          setMapError(true);
        }
      });
    };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !apiKey) {
      if (!apiKey) {
        // No API key - will use iframe fallback
        setMapError(true);
      }
      return;
    }

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        // Wait for it to load
        const checkInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            initializeMap();
          }
        }, 100);
        return;
      }

      // Load Google Maps JavaScript API with Places library
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=places&callback=__initGoogleMaps&language=pl`;
      script.async = true;
      script.defer = true;
      script.loading = 'lazy' as any;
      
      // Set up global callback for Google Maps
      (window as any).__initGoogleMaps = () => {
        if (window.google && window.google.maps && mapContainerRef.current) {
          initializeMap();
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load Google Maps");
        setMapError(true);
        delete (window as any).__initGoogleMaps;
      };
      
      document.head.appendChild(script);
    };

    // Use Intersection Observer to lazy load map only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadGoogleMaps();
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // Start loading 50px before map is visible
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      observer.disconnect();
      if ((window as any).__initGoogleMaps) {
        delete (window as any).__initGoogleMaps;
      }
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [apiKey]);

  // If no API key or error, use iframe (may show CORS warnings but map should work)
  if (mapError || !apiKey) {
    return (
      <div className={`bg-card rounded-lg shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
        <iframe
          src={iframeUrl}
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

  // Interactive Google Maps using JavaScript API (no CORS issues)
  return (
    <div className={`bg-card rounded-lg shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full flex-1"
        style={{ minHeight: "450px", zIndex: 0 }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Ładowanie mapy...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        places: {
          PlacesService: new (map: any) => {
            findPlaceFromQuery: (request: any, callback: (results: any[] | null, status: any) => void) => void;
          };
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}
