"use client";

import { useActionState } from "react";
import { saveProfileAction } from "@/app/account/profile/actions";
import type { Profile } from "@/types/database";
import { cn, btnPrimary, focusRing, tapTarget } from "@/lib/cn";
import { accountInputClass, accountLabelClass, accountSectionClass } from "@/components/account/formFields";

interface ProfileFormProps {
  profile: Profile | null;
  email: string;
}

type ProfileFormState = { error?: string; success?: boolean } | null;

async function profileFormAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  return saveProfileAction(formData);
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(profileFormAction, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Account details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className={accountLabelClass}>
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              required
              defaultValue={profile?.first_name ?? ""}
              className={accountInputClass}
            />
          </div>
          <div>
            <label htmlFor="last_name" className={accountLabelClass}>
              Last name
            </label>
            <input
              id="last_name"
              name="last_name"
              required
              defaultValue={profile?.last_name ?? ""}
              className={accountInputClass}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="email" className={accountLabelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" value={email} readOnly className={cn(accountInputClass, "bg-surface-alt text-ink-muted")} />
          <p className="mt-1 text-xs text-ink-muted">Email is managed through your login.</p>
        </div>
        <div className="mt-4">
          <label htmlFor="phone" className={accountLabelClass}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} className={accountInputClass} />
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Address</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="street_address" className={accountLabelClass}>
              Street address
            </label>
            <input id="street_address" name="street_address" defaultValue={profile?.street_address ?? ""} className={accountInputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="suburb" className={accountLabelClass}>
                Suburb
              </label>
              <input id="suburb" name="suburb" defaultValue={profile?.suburb ?? ""} className={accountInputClass} />
            </div>
            <div>
              <label htmlFor="town_city" className={accountLabelClass}>
                Town / city
              </label>
              <input id="town_city" name="town_city" defaultValue={profile?.town_city ?? ""} className={accountInputClass} />
            </div>
          </div>
          <div className="sm:w-1/3">
            <label htmlFor="postcode" className={accountLabelClass}>
              Postcode
            </label>
            <input id="postcode" name="postcode" defaultValue={profile?.postcode ?? ""} className={accountInputClass} />
          </div>
        </div>
      </div>

      <div className={accountSectionClass}>
        <h2 className="text-base font-semibold text-ink">Other</h2>
        <div className="mt-4">
          <label htmlFor="occupation" className={accountLabelClass}>
            Occupation
          </label>
          <input id="occupation" name="occupation" defaultValue={profile?.occupation ?? ""} className={accountInputClass} />
        </div>
      </div>

      {state?.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-emerald-700">Profile saved.</p> : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(btnPrimary, focusRing, tapTarget, "rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60")}
      >
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
