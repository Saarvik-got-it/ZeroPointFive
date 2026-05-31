import { useEffect, useState } from "react";

export function useInView(ref, { once = true, margin = "0px" } = {}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin: margin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [margin, once, ref]);

  return isVisible;
}
