import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/ga";

export default function PageTracker() {
  const location = useLocation();

  useEffect(()=>{
    trackPageView(window.location.href, document.title)
  }, [location]);

  return null;
}
