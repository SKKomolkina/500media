import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";

export type ImageSliderProps = SliceComponentProps<Content.ImageSliderSlice>;

/** Слайдер изображений 712×340, скругление 12. Прокрутка с привязкой (scroll-snap), без JS. */
export default function ImageSlider({ slice }: ImageSliderProps) {
  return (
    <section className="art-slider" data-slice-type={slice.slice_type} data-slice-variation={slice.variation} aria-label="Галерея">
      <ul>
        {slice.items.map((item, i) =>
          item.image?.url ? (
            <li key={i}>
              <PrismicNextImage field={item.image} fill sizes="(min-width:768px) 712px, 100vw" loading="lazy" className="object-cover" />
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}
