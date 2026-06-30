import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth";
import { csvDownloadFilename, toCsv } from "@/lib/export/csv";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    if (auth.reason === "not_configured") {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }
    if (auth.reason === "unauthenticated") {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { supabase } = auth;

  const { data: entries, error } = await supabase
    .from("race_entries")
    .select(
      `
      id,
      race_number,
      ksnz_licence_number,
      transponder_number,
      transponder_hire_required,
      amount_due,
      payment_status,
      status,
      submitted_at,
      race_events ( title, event_date ),
      drivers ( first_name, last_name, date_of_birth, email, phone ),
      profiles ( email, phone )
    `,
    )
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (entries ?? []).map((row) => {
    const event = Array.isArray(row.race_events) ? row.race_events[0] : row.race_events;
    const driver = Array.isArray(row.drivers) ? row.drivers[0] : row.drivers;
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      event_title: event?.title ?? "",
      event_date: event?.event_date ?? "",
      driver_first_name: driver?.first_name ?? "",
      driver_last_name: driver?.last_name ?? "",
      driver_dob: driver?.date_of_birth ?? "",
      driver_email: driver?.email ?? profile?.email ?? "",
      driver_phone: driver?.phone ?? profile?.phone ?? "",
      race_number: row.race_number ?? "",
      ksnz_licence_number: row.ksnz_licence_number ?? "",
      transponder_number: row.transponder_number ?? "",
      transponder_hire_required: row.transponder_hire_required ? "yes" : "no",
      amount_due: row.amount_due ?? "",
      payment_status: row.payment_status ?? "",
      status: row.status ?? "",
      submitted_at: row.submitted_at ?? "",
    };
  });

  const csv = toCsv(rows);
  const filename = csvDownloadFilename("race-entries");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
