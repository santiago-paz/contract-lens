'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '../motion/media';
import type { RulerScene } from './ruler-scene';

/**
 * The WebGL ruler field, behind a block of content. The block's own CSS ticks
 * are the fallback and stay underneath: the field fades in over them once it is
 * running, and if WebGL is missing, the device cannot keep up, or the visitor
 * asked for less motion, nothing changes but the ticks stop swaying.
 *
 * Three.js is loaded only when the field is near the viewport and the browser
 * is idle, so it never competes with the first paint. The scene stops drawing
 * while it is off screen or the tab is hidden.
 *
 * `listenTo` is the element whose pointer moves steer the lens. It is usually
 * the stage that holds both the field and the content above it.
 */
export function RulerField({
  intensity = 1,
  listenTo,
  className = '',
}: {
  intensity?: number;
  listenTo?: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduced) return;

    let scene: RulerScene | null = null;
    let canvas: HTMLCanvasElement | null = null;
    let visible = false;
    let disposed = false;
    let loading = false;

    const idle = () =>
      new Promise<void>((resolve) => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 1500 });
        else setTimeout(resolve, 500);
      });

    const start = async () => {
      if (scene || loading || disposed) return;
      loading = true;
      await idle();
      if (disposed) return;
      const { createRulerScene } = await import('./ruler-scene');
      if (disposed) return;

      // A fresh canvas for every start: a canvas whose context was released cannot be reused.
      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.className = 'ruler-canvas';
      host.appendChild(canvas);

      scene = createRulerScene(canvas, {
        intensity,
        onDegrade: () => {
          scene = null;
          canvas?.classList.remove('is-live');
        },
      });
      if (!scene) {
        canvas.remove();
        canvas = null;
        return;
      }
      scene.setVisible(visible);
      measure();
      // One frame later, so the opacity transition has a starting value.
      requestAnimationFrame(() => canvas?.classList.add('is-live'));
    };

    // The field tips back and fades as its block scrolls away.
    const measure = () => {
      if (!scene) return;
      const rect = host.getBoundingClientRect();
      scene.setProgress(rect.height > 0 ? Math.max(0, Math.min(1, -rect.top / rect.height)) : 0);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        scene?.setVisible(visible);
        if (visible) void start();
      },
      { rootMargin: '160px' },
    );
    io.observe(host);

    const target = listenTo?.current ?? host.parentElement ?? host;
    const onMove = (event: PointerEvent) => {
      if (!scene || !canvas || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      scene.setPointer(
        inside
          ? {
              x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
              y: -(((event.clientY - rect.top) / rect.height) * 2 - 1),
            }
          : null,
      );
    };
    const onLeave = () => scene?.setPointer(null);
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', measure, { passive: true });

    return () => {
      disposed = true;
      io.disconnect();
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', measure);
      scene?.dispose();
      canvas?.remove();
    };
  }, [intensity, listenTo, reduced]);

  return <div ref={hostRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />;
}
