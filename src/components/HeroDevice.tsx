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
  const scale = useFitScale(stageHostRef, DEVICE_W, DEVICE_H, { max: 0.80, min: 0.35 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const [shellIndex, setShellIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const entry = screenById(SHELL_SCREENS[shellIndex]);



  return (
    <div
      ref={stageHostRef}
      className="flex h-[clamp(470px,66vh,670px)] w-full items-center justify-center"
      style={{ perspective: 1400 }}
    >
      <div style={{ position: 'relative', width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        <div
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
          <div
            ref={tiltRef}
            style={{ width: DEVICE_W, height: DEVICE_H, transformStyle: 'preserve-3d' }}
          >
            <div className="h-full w-full">
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
    </div>
  );
});
