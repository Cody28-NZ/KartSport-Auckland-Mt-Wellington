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

  const { data: registrations, error } = await supabase
    .from("practice_registrations")
    .select(
      `
      id,
      kart_number,
      licence_number,
      amount_due,
      payment_status,
      status,
      submitted_at,
      practice_sessions ( title, starts_at ),
      people ( first_name, last_name, date_of_birth, email, phone ),
      profiles ( email, phone )
    `,
    )
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (registrations ?? []).map((row) => {
    const session = Array.isArray(row.practice_sessions)
      ? row.practice_sessions[0]
      : row.practice_sessions;
    const person = Array.isArray(row.people) ? row.people[0] : row.people;
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      session_title: session?.title ?? "",
      session_starts_at: session?.starts_at ?? "",
      driver_first_name: person?.first_name ?? "",
      driver_last_name: person?.last_name ?? "",
      driver_dob: person?.date_of_birth ?? "",
      driver_email: person?.email ?? profile?.email ?? "",
      driver_phone: person?.phone ?? profile?.phone ?? "",
      kart_number: row.kart_number ?? "",
      licence_number: row.licence_number ?? "",
      amount_due: row.amount_due ?? "",
      payment_status: row.payment_status ?? "",
      status: row.status ?? "",
      submitted_at: row.submitted_at ?? "",
    };
  });

  const csv = toCsv(rows);
  const filename = csvDownloadFilename("practice-registrations");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
