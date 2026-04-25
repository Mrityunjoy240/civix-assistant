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
      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 text-xs flex items-start space-x-2">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Google Maps API key missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables to enable the map view.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white"
    >
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-primary-600" />
          Detected Polling Location
        </span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-primary-600 hover:underline"
        >
          OPEN IN GOOGLE MAPS
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
        <p className="text-xs text-slate-600 font-medium">{address}</p>
      </div>
    </motion.div>
  );
}
