"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { CheckYourEmailPanel } from "@/components/auth/CheckYourEmailPanel";
import { BecomeAMemberHeroCopy, HeroAccountCard } from "@/components/site/become-a-member/HeroAccountCard";
import { HowItWorksStepper } from "@/components/site/become-a-member/HowItWorksStepper";
import { MembershipPathGrid } from "@/components/site/become-a-member/MembershipPathGrid";
import { cn, sectionDefault, sectionMuted } from "@/lib/cn";

interface BecomeAMemberPageContentProps {
  user: { id: string } | null;
  membershipNext: string;
  loginWithNext: string;
}

export function BecomeAMemberPageContent({
  user,
  membershipNext,
  loginWithNext,
}: BecomeAMemberPageContentProps) {
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);

  if (awaitingEmailConfirmation) {
    return (
      <section className={cn(sectionDefault, "py-12 sm:py-16 lg:py-20")}>
        <Container className="max-w-lg">
          <CheckYourEmailPanel loginHref={loginWithNext} backHref="/become-a-member" />
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className={cn(sectionDefault, "border-b border-border py-10 sm:py-12 lg:py-14")}>
        <Container className="max-w-6xl">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-10 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
            <div className="order-2 lg:order-1">
              <BecomeAMemberHeroCopy />
            </div>
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <HeroAccountCard
                user={user}
                membershipNext={membershipNext}
                loginWithNext={loginWithNext}
                onAwaitingEmailConfirmation={() => setAwaitingEmailConfirmation(true)}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className={cn(sectionMuted, "py-10 sm:py-12 lg:py-14")}>
        <Container className="max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Choose the right membership path
            </h2>
            <p className="mt-3 text-base text-ink-muted">Select the option that best matches who you are registering.</p>
          </div>
          <div className="mt-8">
            <MembershipPathGrid />
          </div>
        </Container>
      </section>

      <section className={cn(sectionDefault, "py-10 sm:py-12 lg:py-14")}>
        <Container className="max-w-6xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
              A simple guided path from account creation to membership application.
            </p>
          </div>
          <div className="mt-10">
            <HowItWorksStepper />
          </div>
        </Container>
      </section>
    </>
  );
}
