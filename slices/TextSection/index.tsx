import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";

export type TextSectionProps = SliceComponentProps<Content.TextSectionSlice>;

/** Раздел статьи: подзаголовок 20/1 semibold + текст 16/1.2, зазор 4 px (макет, Article). */
export default function TextSection({ slice }: TextSectionProps) {
  return (
    <section className="art-section" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      {slice.primary.heading && <h2 className="art-h2">{slice.primary.heading}</h2>}
      <div className="art-text">
        <PrismicRichText field={slice.primary.text} />
      </div>
    </section>
  );
}
