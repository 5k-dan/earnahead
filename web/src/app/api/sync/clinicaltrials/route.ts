import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";


const STATE_MAP: Record<string, string> = {
  Georgia: "GA",
  "New York": "NY",
  California: "CA",
  Florida: "FL",
  Texas: "TX",
  Pennsylvania: "PA",
  Ohio: "OH",
  Michigan: "MI",
  // add more later if needed
};

function extractState(fullLocation: string): string {
  if (!fullLocation) return "";

  // If already two-letter code
  const parts = fullLocation.split(",");
  const last = parts[parts.length - 1]?.trim();

  if (!last) return "";

  if (last.length === 2) return last.toUpperCase();

  return STATE_MAP[last] || "";
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-sync-secret");

  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    "https://clinicaltrials.gov/api/v2/studies?format=json&pageSize=50"
  );

  const data: any = await res.json();
  const studies = data?.studies || [];

  let imported = 0;

  for (const s of studies) {
    const title = s.protocolSection?.identificationModule?.briefTitle || "";
    const locations =
      s.protocolSection?.contactsLocationsModule?.locations || [];

    if (!locations.length) continue;

    const loc = locations[0];

    const city = loc.city || "";
    const stateFull = loc.state || "";
    const state = extractState(stateFull);

    if (!state) continue;

    const externalId =
      s.protocolSection?.identificationModule?.nctId || "";

    await db.collection("opportunities").doc(`clinical_${externalId}`).set(
      {
        title,
        locationName: loc.facility || "",
        city,
        state, // <-- ALWAYS NORMALIZED
        externalId,
        type: "clinical",
        payoutText: "Compensation varies",
        createdAt: new Date(),
      },
      { merge: true }
    );

    imported++;
  }

  return NextResponse.json({ success: true, imported });
}