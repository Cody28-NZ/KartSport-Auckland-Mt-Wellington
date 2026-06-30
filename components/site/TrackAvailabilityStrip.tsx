"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getUpcomingAvailability } from "@/data/trackAvailability";
import type { TrackAvailabilityDay, TrackAvailabilityStatus } from "@/data/trackAvailability";
import {
  formatStripDate,
  getAvailabilityHref,
  getPublicStatus,
  getPublicStatusLabel,
  getStripBoxClass,
} from "@/lib/trackAvailability";
import { cn, focusRing } from "@/lib/cn";

const AVAILABILITY_POOL_SIZE = 30;
const DESKTOP_MAX_ITEMS = 9;
const BOX_WIDTH_PX = 96;
const BOX_GAP_PX = 12;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

interface TrackAvailabilityStripProps {
  limit?: number;
  desktopMaxItems?: number;
  className?: string;
}

function StatusIcon({ status }: { status: TrackAvailabilityStatus }) {
  const pub = getPublicStatus(status);

  if (pub === "practice-open") {
    return <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />;
  }

  if (pub === "race-day") {
    return (
      <span className="text-base leading-none" aria-hidden="true">
        🏁
      </span>
    );
  }

  return <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden="true" />;
}

function StatusBlock({ status }: { status: TrackAvailabilityStatus }) {
  const label = getPublicStatusLabel(status);
  const pub = getPublicStatus(status);

  const labelClass =
    pub === "practice-open"
      ? "text-emerald-800"
      : pub === "race-day"
        ? "text-ink"
        : "text-red-800";

  return (
    <div className="flex flex-col items-center gap-1">
      <StatusIcon status={status} />
      <span className={cn("text-[0.6875rem] font-semibold leading-none", labelClass)}>{label}</span>
    </div>
  );
}

function AvailabilityBox({ day }: { day: TrackAvailabilityDay }) {
  const href = getAvailabilityHref(day);
  const boxClass = cn(
    "flex h-[7.25rem] w-[5.75rem] shrink-0 snap-start flex-col items-center justify-center rounded-md border px-1.5 py-2 text-center sm:h-[7.5rem] sm:w-24",
    getStripBoxClass(day.status),
    href && "transition-colors",
  );

  const content = (
    <>
      <p className="text-[0.625rem] font-bold tracking-wide text-ink">{formatStripDate(day.date)}</p>
      <p className="mt-0.5 text-[0.6875rem] font-medium leading-none text-ink-muted">{day.dayLabel}</p>
      <div className="mt-2.5">
        <StatusBlock status={day.status} />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(boxClass, focusRing, "block")}>
        {content}
      </Link>
    );
  }

  return <div className={boxClass}>{content}</div>;
}

function countBoxesThatFit(containerWidth: number): number {
  if (containerWidth <= 0) return 1;
  return Math.max(1, Math.floor((containerWidth + BOX_GAP_PX) / (BOX_WIDTH_PX + BOX_GAP_PX)));
}

export function TrackAvailabilityStrip({
  limit = AVAILABILITY_POOL_SIZE,
  desktopMaxItems = DESKTOP_MAX_ITEMS,
  className,
}: TrackAvailabilityStripProps) {
  const allDays = getUpcomingAvailability(limit);
  const rowRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopVisibleCount, setDesktopVisibleCount] = useState(desktopMaxItems);

  const updateLayout = useCallback(() => {
    const row = rowRef.current;
    const desktop = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
    setIsDesktop(desktop);

    if (!row || !desktop) return;

    const fitCount = countBoxesThatFit(row.clientWidth);
    setDesktopVisibleCount(Math.min(desktopMaxItems, fitCount, allDays.length));
  }, [allDays.length, desktopMaxItems]);

  useEffect(() => {
    updateLayout();

    const row = rowRef.current;
    if (!row || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateLayout());
    observer.observe(row);

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const onMediaChange = () => updateLayout();
    mediaQuery.addEventListener("change", onMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", onMediaChange);
    };
  }, [updateLayout]);

  const days = isDesktop ? allDays.slice(0, desktopVisibleCount) : allDays;

  return (
    <div className={cn(className)}>
      <h2 className="text-base font-semibold tracking-tight text-ink">Track availability</h2>
      <p className="mt-1 text-xs text-ink-muted">
        Click a box to register for a practice day or race event.
      </p>

      <div
        ref={rowRef}
        className={cn(
          "mt-2.5 flex flex-nowrap gap-3 sm:mt-3",
          isDesktop
            ? "justify-center overflow-hidden"
            : cn(
                "-mx-1 overflow-x-auto px-1 pb-0.5",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
                "snap-x snap-mandatory",
              ),
        )}
        role="list"
        aria-label="Track availability for upcoming days"
      >
        {days.map((day) => (
          <div key={day.date} role="listitem" className="shrink-0">
            <AvailabilityBox day={day} />
          </div>
        ))}
      </div>
    </div>
  );
}
