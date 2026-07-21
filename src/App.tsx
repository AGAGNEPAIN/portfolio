import { useCallback, useRef, useState } from "preact/hooks";
import { ContactSection } from "./components/Contact/ContactSection/ContactSection";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";
import { ExperiencesSection } from "./components/Experiences/ExperiencesSection/ExperiencesSection";
import { GrainOverlay } from "./components/GrainOverlay/GrainOverlay";
import { Hero } from "./components/Hero/Hero/Hero";
import { Nav } from "./components/Nav/Nav/Nav";
import { Preloader } from "./components/Preloader/Preloader";
import { ScrollProgressBar } from "./components/ScrollProgressBar/ScrollProgressBar";
import { SectionIconGizmo } from "./components/SectionIconGizmo/SectionIconGizmo";
import { StackSection } from "./components/Stack/StackSection/StackSection";
import { useElementCoversViewportY } from "./hooks/useElementCoversViewportY/useElementCoversViewportY";
import type { SectionIconKey } from "./lib/sectionIcon/sectionIcon";

const NAV_INVERT_LINE_PX = 60;

export function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [navLogoReady, setNavLogoReady] = useState(false);
  const [expHeaderStuck, setExpHeaderStuck] = useState(false);
  const [stackHeaderStuck, setStackHeaderStuck] = useState(false);
  const stackRef = useRef<HTMLElement>(null);
  const experiencesRef = useRef<HTMLElement>(null);
  const navInverted = useElementCoversViewportY(stackRef, NAV_INVERT_LINE_PX);
  const revealNavLogo = useCallback(() => setNavLogoReady(true), []);
  const hidePreloader = useCallback(() => setShowPreloader(false), []);
  const iconStuck = expHeaderStuck || stackHeaderStuck;
  const activeIcon: SectionIconKey | null = stackHeaderStuck
    ? "stack"
    : expHeaderStuck
      ? "exp"
      : null;

  return (
    <>
      {showPreloader && <Preloader onRevealLogo={revealNavLogo} onDone={hidePreloader} />}
      <CustomCursor />
      <GrainOverlay />
      <ScrollProgressBar />
      <Nav inverted={navInverted} animateLogo={navLogoReady} />
      <SectionIconGizmo active={activeIcon} stuck={iconStuck} />
      <main aria-hidden={showPreloader} inert={showPreloader}>
        <Hero />
        <ExperiencesSection containerRef={experiencesRef} onStuckChange={setExpHeaderStuck} />
        <StackSection containerRef={stackRef} onStuckChange={setStackHeaderStuck} />
        <ContactSection />
      </main>
    </>
  );
}
