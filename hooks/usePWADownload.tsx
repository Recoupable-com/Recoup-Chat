import { useEffect, useState } from "react";
import useIsMobile from "./useIsMobile";

const usePWADownload = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const response = /Android/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
    
    // Still listen for the event but don't show the modal
    if (!isStandalone && response) {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }
    
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
      setShowModal(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.addEventListener("click", (e: any) => {
      if (e.target.id === "tap-close-download") {
        setShowModal(false);
      }
    });
  }, []);

  return {
    showModal,
    handleInstallClick,
  };
};

export default usePWADownload;
