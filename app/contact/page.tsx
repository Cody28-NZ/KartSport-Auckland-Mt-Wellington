import { createPageMetadata } from "@/lib/metadata";
import { SimplePage } from "@/components/layout/SimplePage";
import { CardGrid } from "@/components/site/CardGrid";
import { contactItems } from "@/data/contacts";
import { cn, cardBase, cardInteractive, focusRing, textLink } from "@/lib/cn";

export const metadata = createPageMetadata({
  title: "Contact | KartSport Auckland Mt Wellington",
  description: "Contact KartSport Auckland Mt Wellington for beginner, membership, practice, racing and sponsorship enquiries.",
});

export default function ContactPage() {
  return (
    <SimplePage
      headline="Contact"
      subheading="Get in touch with KartSport Auckland Mt Wellington."
      sections={[
        {
          id: "enquiries",
          heading: "Enquiry types",
          body: [
            "Use the contact route that best matches your question. Email addresses are to confirm until published by the club.",
          ],
          children: (
            <CardGrid columns={2}>
              {contactItems.map((contact) => (
                <article key={contact.id} className={cn(cardBase, cardInteractive, "p-6")}>
                  <h3 className="font-semibold text-ink">{contact.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{contact.description}</p>
                  <div className="mt-5 border-t border-border pt-4 text-sm">
                    <p className="text-ink-subtle">
                      <span className="font-medium text-ink-muted">Email:</span>{" "}
                      {contact.email === "to confirm" ? (
                        <span className="text-ink-muted">To confirm</span>
                      ) : (
                        <a href={`mailto:${contact.email}`} className={cn(textLink, focusRing)}>
                          {contact.email}
                        </a>
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </CardGrid>
          ),
        },
      ]}
      relatedLinks={[
        { label: "FAQ", href: "/faq" },
        { label: "Start Karting", href: "/start-karting" },
        { label: "Pathway to Karting", href: "/start-karting/pathway-to-karting" },
      ]}
      primaryCta={{ label: "FAQ", href: "/faq", variant: "primary" }}
    />
  );
}
