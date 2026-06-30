"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveDriverAction } from "@/app/account/drivers/actions";
import { cn, cardBase, focusRing, btnPrimary, tapTarget } from "@/lib/cn";

interface DriverFormProps {
  driver?: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    email: string | null;
    phone: string | null;
    default_kart_number: string | null;
    default_transponder_number: string | null;
  };
  guardian?: {
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    relationship: string | null;
  };
  licenceNumber?: string | null;
}

type DriverFormState = { error?: string; success?: boolean } | null;

async function driverFormAction(_prev: DriverFormState, formData: FormData): Promise<DriverFormState> {
  return saveDriverAction(formData);
}

export function DriverForm({ driver, guardian, licenceNumber }: DriverFormProps) {
  const [state, formAction, pending] = useActionState(driverFormAction, null);

  return (
    <form action={formAction} className={cn(cardBase, "space-y-4 p-5")}>
      {driver?.id ? <input type="hidden" name="driver_id" value={driver.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`first_name-${driver?.id ?? "new"}`}>
            First name
          </label>
          <input
            id={`first_name-${driver?.id ?? "new"}`}
            name="first_name"
            required
            defaultValue={driver?.first_name ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`last_name-${driver?.id ?? "new"}`}>
            Last name
          </label>
          <input
            id={`last_name-${driver?.id ?? "new"}`}
            name="last_name"
            required
            defaultValue={driver?.last_name ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`dob-${driver?.id ?? "new"}`}>
            Date of birth
          </label>
          <input
            id={`dob-${driver?.id ?? "new"}`}
            name="date_of_birth"
            type="date"
            required
            defaultValue={driver?.date_of_birth ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`phone-${driver?.id ?? "new"}`}>
            Phone
          </label>
          <input
            id={`phone-${driver?.id ?? "new"}`}
            name="phone"
            defaultValue={driver?.phone ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink" htmlFor={`email-${driver?.id ?? "new"}`}>
          Email
        </label>
        <input
          id={`email-${driver?.id ?? "new"}`}
          name="email"
          type="email"
          defaultValue={driver?.email ?? ""}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`kart-${driver?.id ?? "new"}`}>
            Kart number
          </label>
          <input
            id={`kart-${driver?.id ?? "new"}`}
            name="kart_number"
            defaultValue={driver?.default_kart_number ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink" htmlFor={`transponder-${driver?.id ?? "new"}`}>
            Transponder number
          </label>
          <input
            id={`transponder-${driver?.id ?? "new"}`}
            name="transponder_number"
            defaultValue={driver?.default_transponder_number ?? ""}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface-alt/60 p-4">
        <p className="text-sm font-semibold text-ink">Licence basics</p>
        <div className="mt-3">
          <label className="block text-sm font-medium text-ink" htmlFor={`licence-${driver?.id ?? "new"}`}>
            KSNZ licence number
          </label>
          <input
            id={`licence-${driver?.id ?? "new"}`}
            name="licence_number"
            defaultValue={licenceNumber ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" name="licence_confirmed_green" defaultChecked={false} />
          Licence confirmed green
        </label>
      </div>

      <div className="rounded-lg border border-border bg-surface-alt/60 p-4">
        <p className="text-sm font-semibold text-ink">Guardian (required if driver is under 18)</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Guardian first name</label>
            <input
              name="guardian_first_name"
              defaultValue={guardian?.first_name ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Guardian last name</label>
            <input
              name="guardian_last_name"
              defaultValue={guardian?.last_name ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink">Guardian email</label>
            <input
              name="guardian_email"
              type="email"
              defaultValue={guardian?.email ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink">Guardian phone</label>
            <input
              name="guardian_phone"
              defaultValue={guardian?.phone ?? ""}
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-ink">Relationship</label>
          <input
            name="guardian_relationship"
            defaultValue={guardian?.relationship ?? ""}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-700">Driver saved.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {pending ? "Saving..." : driver ? "Update driver" : "Add driver"}
      </button>
    </form>
  );
}

export function DriverFormLinkBack() {
  return (
    <Link href="/account" className={cn("text-sm", focusRing, "text-brand hover:text-brand-hover")}>
      &larr; Back to account
    </Link>
  );
}
