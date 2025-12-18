import { usePDFSlick } from "@pdfslick/react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";
import "@pdfslick/react/dist/pdf_viewer.css";

type PDFViewerProps = {
  pdfUrl: string;
  onClose: () => void;
};

const PDFViewer = ({ pdfUrl, onClose }: PDFViewerProps) => {
  const { viewerRef, store, usePDFSlickStore, PDFSlickViewer } = usePDFSlick(pdfUrl, {
    scaleValue: "page-fit",
  });

  // Use the hook directly to access state values
  const pageNumber = usePDFSlickStore((s) => s.pageNumber);
  const numPages = usePDFSlickStore((s) => s.numPages);
  const scale = usePDFSlickStore((s) => s.scale);
  const pdfSlick = usePDFSlickStore((s) => s.pdfSlick);

  const handlePrevPage = () => {
    if (pageNumber > 1 && pdfSlick) {
      pdfSlick.gotoPage(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < numPages && pdfSlick) {
      pdfSlick.gotoPage(pageNumber + 1);
    }
  };

  const handleZoomIn = () => {
    if (pdfSlick) {
      pdfSlick.increaseScale();
    }
  };

  const handleZoomOut = () => {
    if (pdfSlick) {
      pdfSlick.decreaseScale();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 flex flex-col">
      {/* Header con controles */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Historia Clínica</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>
              Página {pageNumber} de {numPages}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navegación de páginas */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevPage}
            disabled={pageNumber <= 1}
            className="text-white hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            className="text-white hover:bg-slate-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Zoom */}
          <div className="border-l border-slate-700 pl-2 ml-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="text-white hover:bg-slate-700"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="text-white hover:bg-slate-700"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Botón cerrar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-slate-700 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visor PDF */}
      <div className="flex-1 relative bg-slate-200/70 overflow-hidden">
        <div className="absolute inset-0 pdfSlick">
          <PDFSlickViewer {...{ viewerRef, usePDFSlickStore }} />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
