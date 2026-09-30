import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AppDevice } from '../app-preview/AppDevice';
import { screenById, type AppScreenId } from '../app-preview/screens/registry';
import { BottomNav, Fab, ComposeMenu } from '../app-preview/screens/Home';
import { DEVICE_H, DEVICE_W, SW } from '../app-preview/ui/Phone';
import { AccountDrawer } from '../app-preview/ui/AccountDrawer';
import { useFitScale } from '../app-preview/useFitScale';

gsap.registerPlugin(useGSAP);

const SHELL_SCREENS: AppScreenId[] = ['home', 'campus', 'notifications', 'messages'];
const SHELL_FAB_BRANCH = 0;

export const HeroDevice: React.FC = React.memo(() => {
  const stageHostRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(stageHostRef, DEVICE_W, DEVICE_H, { max: 0.72, min: 0.3 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const [shellIndex, setShellIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const entry = screenById(SHELL_SCREENS[shellIndex]);

  useGSAP(
    () => {
      const host = stageHostRef.current;
      const tiltTarget = tiltRef.current;
      if (!host || !tiltTarget) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (reduceMotion || !finePointer) return;

      const rotateY = gsap.quickTo(tiltTarget, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      const rotateX = gsap.quickTo(tiltTarget, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const onPointerMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 13);
        rotateX(((event.clientY - rect.top) / rect.height - 0.5) * -9);
      };
      const onPointerLeave = () => {
        rotateY(0);
        rotateX(0);
      };

      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerleave', onPointerLeave);
      return () => {
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerleave', onPointerLeave);
      };
    },
    { dependencies: [scale] },
  );

  return (
    <div
      ref={stageHostRef}
      className="flex h-[clamp(430px,62vh,620px)] w-full items-center justify-center"
      style={{ perspective: 1400 }}
    >
      <div style={{ position: 'relative', width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        <div
          ref={tiltRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: DEVICE_W,
            height: DEVICE_H,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <div className="device-float h-full w-full">
            <AppDevice
              entry={entry}
              screenWidth={SW}
              glare
              renderOptions={{
                shellNav: true,
                onOpenDrawer: () => {
                  setDrawerOpen(true);
                  setComposeOpen(false);
                },
              }}
              screenClassName="motion-safe:animate-fade-up"
              overlay={
                <>
                  {shellIndex === SHELL_FAB_BRANCH && (
                    <>
                      <Fab open={composeOpen ? 1 : 0} onClick={() => setComposeOpen((prev) => !prev)} />
                      <ComposeMenu open={composeOpen} onClose={() => setComposeOpen(false)} />
                    </>
                  )}
                  <BottomNav
                    active={shellIndex}
                    onSelect={(idx) => {
                      setShellIndex(idx);
                      setComposeOpen(false);
                    }}
                  />
                  <AccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
});
