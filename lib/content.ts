import { faqs } from "@/data/faqs";
import type { FaqItem } from "@/types/content";

export function getFaqById(id: string): FaqItem | undefined {
  return faqs.find((faq) => faq.id === id);
}

export { getNewsBySlug } from "@/data/news";
