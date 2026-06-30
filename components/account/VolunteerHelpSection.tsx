"use client";

import {
  VOLUNTEER_CANNOT_HELP,
  VOLUNTEER_OPTIONS,
  serializeVolunteerInterest,
  toggleVolunteerSelection,
} from "@/lib/account/volunteer-options";
import { cn, cardBase } from "@/lib/cn";
import { accountLabelClass } from "@/components/account/formFields";

interface VolunteerHelpSectionProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function VolunteerHelpSection({ selected, onChange }: VolunteerHelpSectionProps) {
  return (
    <div className="mt-6">
      <input type="hidden" name="volunteer_interest" value={serializeVolunteerInterest(selected)} />
      <h3 className="text-base font-semibold text-ink">Volunteer help</h3>
      <p className={cn(accountLabelClass, "mt-2 font-normal text-ink-muted")}>
        Our club relies on volunteers. Please select any that you and/or your parent/caregiver can help with.
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {VOLUNTEER_OPTIONS.map((option) => {
          const checked = selected.includes(option);
          const isCannotHelp = option === VOLUNTEER_CANNOT_HELP;
          return (
            <li key={option}>
              <label
                className={cn(
                  cardBase,
                  "flex cursor-pointer items-start gap-3 p-3.5",
                  checked && "ring-2 ring-brand/30",
                  isCannotHelp && "sm:col-span-2",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onChange(toggleVolunteerSelection(selected, option))}
                  className="mt-0.5"
                />
                <span className="text-sm text-ink">{option}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
