import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, sectionDefault, sectionHome } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Register | KartSport Auckland Mt Wellington",
  description: "Create a KartSport Auckland Mt Wellington account.",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-md">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Create account</h1>
        <p className="mt-2 text-sm text-ink-muted">Register to manage drivers and club registrations.</p>
        <div className="mt-6">
          {isSupabaseConfigured() ? (
            <div className={cn(cardBase, "p-6")}>
              <RegisterForm />
            </div>
          ) : (
            <SupabaseSetupNotice />
          )}
        </div>
      </Container>
    </section>
  );
}
