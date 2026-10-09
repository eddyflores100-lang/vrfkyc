import { NextRequest, NextResponse } from "next/server";

const OPENSANCTIONS_API_KEY = process.env.OPENSANCTIONS_API_KEY || "1ad95e58381ae978ff2cfb93a7f3bea2";
const OPENSANCTIONS_API_URL = "https://api.opensanctions.org";

export async function POST(request: NextRequest) {
  try {
    const { name, type } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const schema = type === "Company" ? "LegalEntity" : "Person";

    // Call OpenSanctions /match endpoint
    const requestBody = {
      queries: {
        q1: {
          schema: schema,
          properties: {
            name: [name],
          },
        },
      },
    };

    const response = await fetch(`${OPENSANCTIONS_API_URL}/match/default`, {
      method: "POST",
      headers: {
        "Authorization": `ApiKey ${OPENSANCTIONS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("OpenSanctions API error:", response.status, await response.text());
      return NextResponse.json(
        { error: "Screening service temporarily unavailable" },
        { status: 503 }
      );
    }

    const data = await response.json();

    // Process results
    const queryResponse = data.responses?.q1 || {};
    const rawResults = queryResponse.results || [];
    const total = queryResponse.total?.value || rawResults.length;

    // Filter results with score > 0.3
    const filteredResults = rawResults
      .filter((r: any) => r.score >= 0.3)
      .map((r: any) => ({
        caption: r.caption || "Unknown",
        schema: r.schema || "Person",
        score: r.score || 0,
        datasets: r.datasets || [],
        properties: r.properties || {},
        topics: r.topics || [],
      }));

    const result = {
      query_id: `KYC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      query: name,
      entity_type: type,
      total_matches: filteredResults.length,
      results: filteredResults,
      timestamp: new Date().toISOString(),
      datasets_checked: 490,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Screening error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during screening" },
      { status: 500 }
    );
  }
}
