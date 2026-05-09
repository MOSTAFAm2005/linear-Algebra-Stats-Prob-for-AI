import { useEffect, useRef } from 'react';

export function useCustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = document.createElement('div');
    const ring = document.createElement('div');

    dot.style.cssText = `
      position: fixed; top: 0; left: 0; width: 8px; height: 8px;
      background: #c8f07d; border-radius: 50%; pointer-events: none;
      z-index: 9999; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s;
    `;
    ring.style.cssText = `
      position: fixed; top: 0; left: 0; width: 24px; height: 24px;
      border: 1px solid rgba(200,240,125,0.5); border-radius: 50%;
      pointer-events: none; z-index: 9999; transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s, border-color 0.3s;
    `;

    document.body.appendChild(dot);
    document.body.appendChild(ring);
    dotRef.current = dot;
    ringRef.current = ring;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover], input, textarea, select')) {
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.borderColor = '#c8f07d';
      }
    };

    const onOut = () => {
      ring.style.width = '24px';
      ring.style.height = '24px';
      ring.style.borderColor = 'rgba(200,240,125,0.5)';
    };

    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
    };
  }, []);
}
