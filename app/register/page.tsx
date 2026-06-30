import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SupabaseSetupNotice } from "@/components/auth/SupabaseSetupNotice";
import { getSafeNextPath } from "@/lib/auth/safe-redirect";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPageMetadata } from "@/lib/metadata";
import { cn, cardBase, focusRing, sectionDefault, sectionHome } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Create your account | KartSport Auckland Mt Wellington",
  description: "Create an account before completing your membership application.",
  noIndex: true,
});

interface RegisterPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (user) redirect("/account");
  }

  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next, "/account/membership/new");
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <section className={cn(sectionDefault, sectionHome)}>
      <Container className="max-w-md">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Create an account before completing your membership application.{" "}
          <Link href="/become-a-member" className={cn("font-medium text-brand hover:text-brand-hover", focusRing)}>
            Start from Become a member
          </Link>
        </p>
        <div className="mt-6">
          {isSupabaseConfigured() ? (
            <div className={cn(cardBase, "p-6")}>
              <RegisterForm nextPath={nextPath} loginHref={loginHref} />
            </div>
          ) : (
            <SupabaseSetupNotice />
          )}
        </div>
      </Container>
    </section>
  );
}
