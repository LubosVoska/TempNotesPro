import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  responsive?: boolean;
  className?: string;
}

// Dynamically load the AdSense script
const loadAdSenseScript = () => {
  const googleAdsenseId = import.meta.env.GOOGLE_ADSENSE_ID || "";
  
  if (!googleAdsenseId) {
    console.warn("Google AdSense ID is missing. Please set the GOOGLE_ADSENSE_ID environment variable.");
    return;
  }
  
  // Don't add if script already exists
  if (document.querySelector(`script[src*="pagead2.googlesyndication.com"]`)) {
    return;
  }
  
  // Create the script element
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseId}`;
  script.crossOrigin = "anonymous";
  
  // Append to the document head
  document.head.appendChild(script);
};

export function GoogleAdSense({ 
  slot, 
  format = "auto", 
  responsive = true, 
  style = {}, 
  className = "" 
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load the AdSense script when the component mounts
    loadAdSenseScript();
    
    try {
      // Add ad only if not already added
      if (adRef.current && adRef.current.innerHTML === "") {
        const googleAdsenseId = import.meta.env.GOOGLE_ADSENSE_ID || "";
        
        if (!googleAdsenseId) {
          console.warn("Google AdSense ID is missing. Please set the GOOGLE_ADSENSE_ID environment variable.");
          return;
        }
        
        // Create ins element
        const ins = document.createElement("ins");
        ins.className = "adsbygoogle";
        ins.style.display = "block";
        ins.dataset.adClient = googleAdsenseId;
        ins.dataset.adSlot = slot;
        
        if (responsive) {
          ins.dataset.adFormat = format;
          ins.dataset.fullWidthResponsive = "true";
        }
        
        // Insert the ins element
        adRef.current.appendChild(ins);
        
        // Execute ad code
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("Error rendering AdSense ad:", error);
    }
  }, [slot, format, responsive]);

  return (
    <div 
      ref={adRef} 
      className={`google-adsense ${className}`} 
      style={{ display: "block", textAlign: "center", ...style }}
    />
  );
}