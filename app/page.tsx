import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Contact />

      <footer className="px-6 py-8 max-w-4xl mx-auto border-t border-border">
        <p className="font-mono text-sm text-text-secondary text-center">
          <span className="text-accent-green">$</span> exit 0
        </p>
      </footer>
    </main>
  );
}
