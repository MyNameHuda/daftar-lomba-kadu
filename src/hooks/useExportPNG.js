import { useCallback, useState } from "react";
import { toPng } from "html-to-image";

export function useExportPNG() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const exportToPng = useCallback(async (element, filename) => {
    if (!element) {
      const err = new Error("Element tidak ditemukan");
      setError(err);
      return { ok: false, error: err };
    }

    setIsExporting(true);
    setError(null);

    try {
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: false,
        style: {
          backgroundColor: "#ffffff",
          transform: "none",
        },
        filter: (node) => {
          if (node.dataset && node.dataset.htmlToImageSkip === "true") {
            return false;
          }
          return true;
        },
      });

      if (!dataUrl || !dataUrl.startsWith("data:image/png")) {
        throw new Error("Hasil export kosong atau bukan PNG");
      }

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      return { ok: true, error: null };
    } catch (err) {
      console.error("Export PNG failed:", err);
      setError(err);
      setIsExporting(false);
      return { ok: false, error: err };
    }
  }, []);

  return { exportToPng, isExporting, error };
}
