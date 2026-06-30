import { getSafeNextPath } from "@/lib/auth/safe-redirect";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, sectionDefault, sectionHome } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Member login | KartSport Auckland Mt Wellington",
  description: "Sign in to manage drivers, memberships, practice registrations and race entries.",
  noIndex: true,
});

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next, "/account");

  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-md">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Member login</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Sign in to manage drivers, memberships, practice registrations and race entries.
        </p>
        <div className="mt-6">
          {isSupabaseConfigured() ? (
            <div className={cn(cardBase, "p-6")}>
              <LoginForm nextPath={nextPath} />
            </div>
          ) : (
            <SupabaseSetupNotice />
          )}
        </div>
      </Container>
    </section>
  );
}
