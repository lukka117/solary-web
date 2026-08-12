import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Drag to orbit: horizontal → yaw (Y), vertical → pitch (X), both clamped.
 * Slightly softer on vertical so it feels like a gentle tilt, not a full tumble.
 * On release, targets reset to neutral and the model eases back.
 */
export default function RotatingProduct({
  children,
  limit = Math.PI / 5,
  sensitivity = 0.003,
  pitchLimit = Math.PI / 10,
  verticalSensitivity = 0.0022,
  /** Lerp per frame while dragging (snappier follow). */
  dragSmooth = 0.1,
  /** Lerp per frame when returning to neutral after release (lower = slower drift home). */
  returnSmooth = 0.02,
}) {
  const groupRef = useRef(null);
  const { gl } = useThree();

  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const activePointerId = useRef(null);

  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (e) => {
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      activePointerId.current = e.pointerId;
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;

      targetYaw.current = Math.max(
        -limit,
        Math.min(limit, targetYaw.current + dx * sensitivity),
      );
      targetPitch.current = Math.max(
        -pitchLimit,
        Math.min(pitchLimit, targetPitch.current + dy * verticalSensitivity),
      );
    };

    const endDrag = () => {
      dragging.current = false;
      targetYaw.current = 0;
      targetPitch.current = 0;
      if (activePointerId.current != null) {
        try {
          el.releasePointerCapture?.(activePointerId.current);
        } catch {
          /* already released */
        }
        activePointerId.current = null;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('pointerleave', endDrag);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('pointerleave', endDrag);
    };
  }, [gl, limit, sensitivity, pitchLimit, verticalSensitivity]);

  useFrame(() => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const smooth = dragging.current ? dragSmooth : returnSmooth;
    g.rotation.y += (targetYaw.current - g.rotation.y) * smooth;
    g.rotation.x += (targetPitch.current - g.rotation.x) * smooth;
  });

  return <group ref={groupRef}>{children}</group>;
}
