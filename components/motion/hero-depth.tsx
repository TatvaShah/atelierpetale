"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/types";

// Optional premium 3D style hero: real photos as a floating, layered stack in CSS 3D.
// No WebGL and no three.js, so it stays tiny. Fades in over the static photo once images load.
// Pointer tilt on desktop, a slow scroll tilt on phones. Soft ambient glow and a gentle float.
export default function HeroDepth({ images, sizes }: { images: Img[]; sizes: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(0);
  const cards = images.slice(0, 3);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      raf = 0,
      t0 = performance.now();
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const loop = (now: number) => {
      x += (tx - x) * 0.055;
      y += (ty - y) * 0.055;
      const breath = Math.sin((now - t0) / 2200) * 0.35;
      el.style.setProperty("--rx", `${(-y * 8 + breath).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      el.style.setProperty("--tz", `${(breath * 6).toFixed(2)}px`);
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2)) / 2;
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2)) / 2;
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      ty = Math.max(-0.45, Math.min(0.45, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
      tx = ty * -0.55;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pos = [
    "inset-0 [transform:translateZ(0)]",
    "-left-[16%] bottom-[5%] h-[44%] w-[50%] [transform:translateZ(100px)_rotateZ(-3deg)]",
    "-right-[10%] top-[4%] h-[36%] w-[40%] [transform:translateZ(160px)_rotateZ(2.5deg)]",
  ];

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-700"
      style={{ perspective: "1600px", opacity: ready >= cards.length ? 1 : 0 }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-accent) 28%, transparent), transparent 70%)" }}
      />
      <div className="relative h-full w-full [transform-style:preserve-3d] [transform:translateZ(var(--tz,0px))_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
        {cards.map((img, i) => (
          <div
            key={img.src}
            className={`absolute overflow-hidden rounded-media bg-soft shadow-[0_36px_70px_-32px_rgba(0,0,0,0.5)] ${pos[i]} ${i ? "ring-[5px] ring-bg" : ""}`}
          >
            <Image src={img.src} alt="" fill sizes={i ? "22vw" : sizes} className="object-cover" onLoad={() => setReady((n) => n + 1)} />
          </div>
        ))}
      </div>
    </div>
  );
}
