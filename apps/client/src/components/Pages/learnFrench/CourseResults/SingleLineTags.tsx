import { useLayoutEffect, useRef, useState } from "react";

interface Props {
  tags: string[];
}

const GAP_PX = 8;

export const SingleLineTags = ({ tags }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const recomputeVisibleCount = () => {
      const containerWidth = container.offsetWidth;
      let usedWidth = 0;
      let count = 0;
      for (let i = 0; i < tags.length; i++) {
        const tagWidth = tagRefs.current[i]?.offsetWidth;
        if (tagWidth === undefined) break;
        const nextWidth = usedWidth + (count > 0 ? GAP_PX : 0) + tagWidth;
        if (nextWidth > containerWidth) break;
        usedWidth = nextWidth;
        count++;
      }
      setVisibleCount(count);
    };

    recomputeVisibleCount();
    const observer = new ResizeObserver(recomputeVisibleCount);
    observer.observe(container);
    return () => observer.disconnect();
  }, [tags]);

  if (tags.length === 0) return null;

  return (
    <div ref={containerRef} className="flex gap-2 overflow-hidden">
      {tags.map((tag, index) => (
        <span
          key={tag}
          ref={(el) => {
            tagRefs.current[index] = el;
          }}
          className={`bg-action-low-blue-france text-title-grey shrink-0 rounded-full px-3 py-1 text-sm whitespace-nowrap ${
            index >= visibleCount ? "invisible" : ""
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};
