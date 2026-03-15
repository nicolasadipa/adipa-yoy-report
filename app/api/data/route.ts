import { NextResponse } from "next/server";
import { fetchMetricsFromBQ } from "@/lib/bigquery";
import { getMockData } from "@/lib/mockData";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const bqConfigured = !!process.env.BQ_SERVICE_ACCOUNT;

  if (bqConfigured) {
    try {
      const data = await fetchMetricsFromBQ();
      return NextResponse.json<ApiResponse>({ data, source: "bigquery" });
    } catch (err) {
      const error = err instanceof Error ? err.message : "BigQuery error";
      console.error("[BQ Error]", error);
      // Fallback to mock so the dashboard doesn't break
      return NextResponse.json<ApiResponse>({
        data: getMockData(),
        source: "mock",
        error,
      });
    }
  }

  return NextResponse.json<ApiResponse>({ data: getMockData(), source: "mock" });
}
