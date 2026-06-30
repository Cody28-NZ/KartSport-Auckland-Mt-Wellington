import Link from "next/link";

import { cn, focusRing } from "@/lib/cn";



export interface BreadcrumbItem {

  label: string;

  href?: string;

}



interface BreadcrumbsProps {

  items: BreadcrumbItem[];

  className?: string;

}



export function Breadcrumbs({ items, className }: BreadcrumbsProps) {

  if (!items.length) return null;



  return (

    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>

      <ol className="flex flex-wrap items-center gap-2 text-ink-subtle">

        {items.map((item, index) => {

          const isLast = index === items.length - 1;



          return (

            <li key={`${item.label}-${index}`} className="flex items-center gap-2">

              {index > 0 ? (

                <span aria-hidden="true" className="text-divider">

                  /

                </span>

              ) : null}

              {item.href && !isLast ? (

                <Link

                  href={item.href}

                  className={cn("text-ink-muted hover:text-brand", focusRing)}

                >

                  {item.label}

                </Link>

              ) : (

                <span

                  className={isLast ? "font-medium text-ink" : "text-ink-muted"}

                  aria-current={isLast ? "page" : undefined}

                >

                  {item.label}

                </span>

              )}

            </li>

          );

        })}

      </ol>

    </nav>

  );

}


