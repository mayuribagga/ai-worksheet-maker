"use client";

// Opens the browser's print dialog, where users can print or choose "Save as PDF".
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary text-sm"
    >
      Print or save as PDF
    </button>
  );
}
