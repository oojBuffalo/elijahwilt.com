import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";
import { Nav } from "@/components/Nav";
import { visibleProjectTree } from "@/lib/projects";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main-content" className="min-h-screen bg-bg-primary">
        <Hero />
        <About />
        <Timeline />
        <Projects tree={visibleProjectTree} />
        <Skills />
        <Contact />

        <footer className="px-6 py-8 max-w-5xl mx-auto border-t border-border">
          <p className="font-mono text-sm text-text-secondary text-center">
            <span className="text-accent-green">$</span> exit 0
          </p>
        </footer>
      </main>
    </>
  );
}
