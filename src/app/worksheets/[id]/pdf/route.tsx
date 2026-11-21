import { renderToBuffer } from "@react-pdf/renderer";
import { pdfFileName, WorksheetPdf } from "@/lib/pdf/WorksheetPdf";
import { loadWorksheet } from "../../load";

// Downloads a saved worksheet as a PDF file, with its answer key.
// Row-level security means people can only download their own worksheets.
export async function GET(_request: Request, { params }: RouteContext<"/worksheets/[id]/pdf">) {
  const { id } = await params;
  const result = await loadWorksheet(id);
  if (result.status === "not-found") {
    return new Response("Worksheet not found.", { status: 404 });
  }
  if (result.status === "invalid") {
    return new Response("This worksheet's saved data is damaged.", { status: 422 });
  }

  const pdf = await renderToBuffer(<WorksheetPdf worksheet={result.worksheet} meta={result.meta} />);
  const fileName = pdfFileName(result.worksheet, result.meta);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
