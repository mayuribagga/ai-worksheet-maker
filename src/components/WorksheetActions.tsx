"use client";

import { DownloadIcon, PrinterIcon } from "./Icons";

// The two ways to get a worksheet on paper. Download saves a PDF file made
// on the server; Print opens the browser's print dialog for the printable
// version on this page (hidden on screen, shown only when printing).
export function WorksheetActions({ worksheetId }: { worksheetId?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {worksheetId && (
        <a href={`/worksheets/${worksheetId}/pdf`} download className="btn-primary text-sm">
          <DownloadIcon className="h-4 w-4" />
          Download PDF
        </a>
      )}
      <button type="button" onClick={() => window.print()} className="btn-secondary text-sm">
        <PrinterIcon className="h-4 w-4" />
        Print worksheet
      </button>
    </div>
  );
}
