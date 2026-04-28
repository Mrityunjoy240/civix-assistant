'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface MapWidgetProps {
  address: string;
}

export default function MapWidget({ address }: MapWidgetProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // URL encode the address for the map
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;

  if (!apiKey) {
    return (
      <div className="p-4 bg-amber-50 rounded-lg ring-1 ring-amber-200/50 text-amber-800 text-xs flex items-start space-x-2 mt-4 shadow-sm">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Google Maps API key missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-lg overflow-hidden bg-white ring-1 ring-zinc-200 shadow-sm"
    >
      <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-zinc-400" />
          Detected Polling Location
        </span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold text-zinc-700 hover:text-zinc-900 transition-colors"
        >
          Open in Maps
        </a>
      </div>
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
      </div>
      <div className="p-3 bg-white">
        <p className="text-xs text-zinc-800 font-medium">{address}</p>
      </div>
    </motion.div>
  );
}
