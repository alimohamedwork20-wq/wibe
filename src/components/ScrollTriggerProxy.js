import { useEffect } from "react";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const ScrollTriggerProxy = () => {
  const { scroll } = useLocomotiveScroll();

  useEffect(() => {
    // 1. لو مفيش سكرول أو مفيش عنصر مربوط بيه، اخرج فوراً
    if (!scroll || !scroll.el) return;

    try {
      const element = scroll.el;

      scroll.on("scroll", ScrollTrigger.update);

      // 2. أهم حتة: التأكد إن الـ element لسه موجود في الـ DOM
      if (document.body.contains(element)) {
        ScrollTrigger.scrollerProxy(element, {
          scrollTop(value) {
            return arguments.length
              ? scroll.scrollTo(value, 0, 0)
              : scroll.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          // حماية إضافية للـ style
          pinType: element?.style?.transform ? "transform" : "fixed",
        });
      }

      ScrollTrigger.refresh();
    } catch (error) {
      console.warn("GSAP Proxy suppressed:", error);
    }

    return () => {
      if (scroll) {
        scroll.off("scroll", ScrollTrigger.update);
      }
      // بننضف الـ Triggers عشان ميفضلش فيه أثر ليهم في الصفحة الجديدة
      ScrollTrigger.clearMatchMedia();
    };
  }, [scroll]);

  return null;
};

export default ScrollTriggerProxy;
