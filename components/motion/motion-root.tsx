"use client";

import { useEffect } from "react";

type Settings = { enabled: boolean; smoothScroll: boolean; intensity: "subtle" | "medium"; pin: boolean };

// All scroll motion lives here. It loads GSAP, ScrollTrigger and Lenis only after the page has
// loaded and the browser is idle, so first paint and LCP never wait on it. Content is fully visible
// without JavaScript; we only animate elements that are still below the fold when this runs.
// prefers-reduced-motion: nothing runs at all (smooth scroll, pin, reveals, parallax, magnetic).
export function MotionRoot({ settings }: { settings: Settings }) {
  useEffect(() => {
    if (!settings.enabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      document.documentElement.setAttribute("data-reduce-motion", "");
      return;
    }

    const root = document.documentElement;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      root.toggleAttribute("data-scrolled", y > 24);
      if (y > 480 && y > lastY + 4) root.setAttribute("data-hide-header", "");
      else if (y < lastY - 4 || y < 480) root.removeAttribute("data-hide-header");
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let dispose = () => {};
    let cancelled = false;

    const start = async () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const narrow = window.matchMedia("(max-width: 767px)").matches;
      const [{ gsap }, { ScrollTrigger }, lenisMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        settings.smoothScroll && finePointer ? import("lenis") : Promise.resolve(null),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      let lenis: import("lenis").default | null = null;
      let tick: ((t: number) => void) | null = null;
      if (lenisMod) {
        const Lenis = lenisMod.default;
        // Slightly softer lerp than before for a calmer glide (Palmo inspired, dialed back).
        const l = new Lenis({
          lerp: 0.085,
          wheelMultiplier: 0.9,
          touchMultiplier: 1,
          smoothWheel: true,
          anchors: { offset: -84 },
        });
        l.on("scroll", ScrollTrigger.update);
        lenis = l;
        root.classList.add("lenis");
        tick = (t: number) => l.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      const k = settings.intensity === "medium" ? 1.55 : 1;
      const touch = !finePointer;
      const vh = window.innerHeight;
      const belowFold = (el: Element) => el.getBoundingClientRect().top > vh * 0.9;
      const ease = "power3.out";

      const ctx = gsap.context(() => {
        // Fade and rise (plus optional clip unveil)
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          if (!belowFold(el)) return;
          const kind = el.dataset.reveal;
          const from =
            kind === "clip"
              ? { clipPath: "inset(10% 7% 10% 7%)", scale: 1.04, duration: 1.35 }
              : kind === "left"
                ? { x: -28 * k, opacity: 0, duration: 1 }
                : kind === "right"
                  ? { x: 28 * k, opacity: 0, duration: 1 }
                  : { y: 28 * k, opacity: 0, duration: 1.05 };
          gsap.from(el, { ...from, ease, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
        });

        // Staggered children (cards, menu rows, gallery tiles)
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
          if (!belowFold(el)) return;
          const delay = Number(el.dataset.stagger || 0.065);
          gsap.from(el.children, {
            y: 24 * k,
            opacity: 0,
            duration: 0.95,
            ease,
            stagger: delay,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Section headings: words rise out of a mask
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          if (!belowFold(el) || el.dataset.done) return;
          el.dataset.done = "1";
          const text = el.textContent ?? "";
          el.setAttribute("aria-label", text);
          el.innerHTML = text
            .split(/\s+/)
            .filter(Boolean)
            .map((w) => `<span aria-hidden="true" class="line-mask" style="display:inline-block;vertical-align:top"><span style="display:inline-block;animation:none">${w.replace(/</g, "&lt;")}&nbsp;</span></span>`)
            .join("");
          gsap.from(el.querySelectorAll(".line-mask > span"), {
            yPercent: 108,
            duration: 1.05,
            ease,
            stagger: 0.045,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // Gentle parallax on photos. Disabled on narrow phones; halved on other touch screens.
        if (!narrow) {
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            const amt = Number(el.dataset.parallax || 8) * k * (touch ? 0.4 : 1);
            if (amt < 1) return;
            gsap.fromTo(
              el,
              { yPercent: -amt },
              { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
            );
          });
        }

        // Statement line fills in word by word as it scrolls through
        gsap.utils.toArray<HTMLElement>("[data-words]").forEach((el) => {
          const words = el.querySelectorAll(".w");
          gsap.set(words, { opacity: 0.16 });
          gsap.to(words, {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 84%", end: "bottom 48%", scrub: true },
          });
        });

        // Soft magnetic / follow on light pointer targets (buttons, cards with data-magnetic)
        if (finePointer) {
          gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
            const strength = Number(el.dataset.magnetic || 0.18);
            const onMove = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              const dx = (e.clientX - (r.left + r.width / 2)) * strength;
              const dy = (e.clientY - (r.top + r.height / 2)) * strength;
              gsap.to(el, { x: dx, y: dy, duration: 0.45, ease: "power3.out" });
            };
            const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", onLeave);
          });
        }
      });

      // Pinned sideways gallery: wide screens only, never on phones
      const mm = gsap.matchMedia();
      if (settings.pin) {
        mm.add("(min-width: 1024px)", () => {
          const sections = gsap.utils.toArray<HTMLElement>("[data-pin]");
          sections.forEach((sec) => {
            const track = sec.querySelector<HTMLElement>("[data-track]");
            if (!track) return;
            root.setAttribute("data-pinned", "");
            const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
            if (dist() < 80) return;
            gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: {
                trigger: sec,
                start: "top top",
                end: () => `+=${dist() * 1.05}`,
                pin: true,
                scrub: 0.75,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
          });
          return () => root.removeAttribute("data-pinned");
        });
      }
      ScrollTrigger.refresh();

      dispose = () => {
        ctx.revert();
        mm.revert();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
        root.classList.remove("lenis");
      };
    };

    const idle = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1500 });
      else setTimeout(() => void start(), 300);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    const onReduceChange = () => {
      if (reduce.matches) {
        document.documentElement.setAttribute("data-reduce-motion", "");
        dispose();
      }
    };
    reduce.addEventListener?.("change", onReduceChange);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", idle);
      reduce.removeEventListener?.("change", onReduceChange);
      dispose();
    };
  }, [settings]);

  return null;
}
