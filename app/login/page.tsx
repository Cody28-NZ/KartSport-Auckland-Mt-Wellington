import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, sectionDefault, sectionHome } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Login | KartSport Auckland Mt Wellington",
  description: "Sign in to your KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-md">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-ink-muted">Access your account, drivers and registrations.</p>
        <div className="mt-6">
          {isSupabaseConfigured() ? (
            <div className={cn(cardBase, "p-6")}>
              <LoginForm />
            </div>
          ) : (
            <SupabaseSetupNotice />
          )}
        </div>
      </Container>
    </section>
  );
}
