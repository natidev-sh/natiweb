import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code, Terminal, Paintbrush, Rocket, Book, PlusCircle, Sparkles, Download } from 'lucide-react'
import Feature3 from './sections/Feature3.jsx'
import BentoGrid1 from './sections/BentoGrid1.jsx'
import CongestedPricing from './components/mvpblocks/congusted-pricing'
import FAQ3 from './sections/FAQ3.jsx'
import FooterGlow from './components/FooterGlow.jsx'
import TestimonialsSection from './sections/TestimonialsSection.jsx'
import PageMeta from './components/PageMeta.jsx'
import InteractiveDemo from './components/InteractiveDemo.jsx'
import PreviewPanelDemo from './components/PreviewPanelDemo.jsx'
import IntegrationsShowcase from './sections/IntegrationsShowcase.jsx'

function Features() {
  const items = [
    { icon: <Code className="h-6 w-6" />, title: 'Developer-Friendly', desc: 'Tailored for developers to create and iterate fast, with minimal overhead and maximum flexibility.' },
    { icon: <Terminal className="h-6 w-6" />, title: 'CLI Support', desc: 'Command-line interface support for seamless development and workflow integration.' },
    { icon: <Paintbrush className="h-6 w-6" />, title: 'Easily Customizable', desc: 'Every block is built to be editable. From layout to logic, style to structure—make it your own.' },
    { icon: <Rocket className="h-6 w-6" />, title: 'v0 Support', desc: 'Launch fast with confidence. Perfect for MVPs, prototypes, and weekend projects.' },
    { icon: <Book className="h-6 w-6" />, title: 'Full Documentation', desc: 'Comprehensive documentation to understand every feature and maximize your development experience.' },
    { icon: <PlusCircle className="h-6 w-6" />, title: 'Contribute Yours', desc: 'Add your own blocks to the library and become part of the MVPBlocks community.' },
  ]
  return (
    <section id="features" className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">Let’s help build your MVP</h3>
            <p className="mt-3 opacity-70">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue, nisl eget molestie varius, enim ex faucibus purus.</p>
          </div>
          <div className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]" style={{background:'linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)'}} />
        </div>
        <hr className="mx-auto mt-5 h-px w-1/2" style={{backgroundColor:'color-mix(in oklab, var(--foreground) 30%, transparent)'}} />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <li key={idx} className="space-y-3 rounded-xl border border-[var(--border)] bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]">
                <div className="text-[var(--primary)] w-fit rounded-full border border-[var(--border)] p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold tracking-tighter">{item.title}</h4>
                <p className="opacity-80">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const items = [
    { q: 'Can I generate keys from the browser?', a: 'Use our server proxy; never expose your master key client-side.' },
    { q: 'Is there an admin dashboard?', a: 'Yes. Sign up, log in, and access /dashboard.' },
  ]
  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
      <div className="space-y-3">
        {items.map((f, i) => (
          <div key={i} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)]">
            <div className="font-medium">{f.q}</div>
            <div className="opacity-80 text-sm mt-1">{f.a}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] py-8 text-sm opacity-80">
      <div className="flex items-center justify-between flex-col md:flex-row gap-3">
        <div>© {new Date().getFullYear()} nati.dev</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[var(--primary)]">Docs</a>
          <a href="#" className="hover:text-[var(--primary)]">Privacy</a>
          <a href="#" className="hover:text-[var(--primary)]">Terms</a>
        </div>
      </div>
    </footer>
  )
}

function Hero() {
  return (
    <div className="min-h-screen py-6 sm:py-14">
      <div className="pointer-events-none absolute inset-0 top-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[var(--primary)]/30 via-[var(--primary)]/20 to-transparent opacity-50 blur-[100px]" />
        <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-[var(--primary)]/30 via-[var(--primary)]/20 to-transparent opacity-50 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[var(--primary)]/20 via-[var(--primary)]/10 to-transparent opacity-30 blur-[80px]" />
      </div>
      <main className="relative mx-auto mt-4 max-w-[1100px] px-2 py-4 lg:py-8">
        <div className="relative sm:overflow-hidden">
          <div className="relative flex flex-col items-start justify-start rounded-xl border border-[var(--border)] bg-[color:color-mix(in_oklab,_var(--background)_80%,_transparent)] px-4 pt-12 shadow-xl shadow-[var(--primary)]/10 backdrop-blur-md max-md:text-center md:px-12 md:pt-16">
            <div className="animate-gradient-x absolute inset-0 top-32 z-0 hidden blur-2xl dark:block" style={{ maskImage: 'linear-gradient(to bottom, transparent, white, transparent)', background: 'repeating-linear-gradient(65deg, var(--primary), color-mix(in oklab, var(--primary) 80%, transparent) 12px, color-mix(in oklab, var(--primary) 30%, transparent) 20px, transparent 200px)', backgroundSize: '200% 100%' }} />
            <div className="animate-gradient-x absolute inset-0 top-32 z-0 text-left blur-2xl dark:hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, white, transparent)', background: 'repeating-linear-gradient(65deg, color-mix(in oklab, var(--primary) 90%, transparent), color-mix(in oklab, var(--primary) 70%, transparent) 12px, color-mix(in oklab, var(--primary) 30%, transparent) 20px, transparent 200px)', backgroundSize: '200% 100%' }} />
            <h1 className="mb-4 flex flex-wrap gap-x-2 text-3xl font-medium leading-tight md:text-5xl">
              Build your dream with
              <span className="text-[var(--primary)]">Nati</span>
            </h1>
            <p className="mb-8 text-left md:max-w-[80%] md:text-xl opacity-80">
              The ultimate local-first AI app builder for developers. Nati is the free, open-source alternative to cloud platforms like Lovable, v0, Bolt and Replit, giving you the power to create, test, and ship at lightning speed—right from your desktop.
            </p>
            <div className="mb-6 flex flex-wrap gap-4 md:flex-row z-10">
              <Link to="/download" className="group inline-flex items-center gap-2 rounded-full px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--primary)]/60 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Download className="h-5 w-5 group-hover:animate-bounce" />
                Download Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="inline-flex items-center gap-2 rounded-full px-6 py-4 border-2 border-[var(--primary)] bg-[var(--background)] hover:bg-[var(--primary)]/10 transition-all font-semibold text-lg">
                <Terminal className="h-5 w-5" />
                Try Interactive Demo
              </Link>
            </div>
            <div className="relative z-10 mt-16 w-full">
              <img src="https://i.postimg.cc/bwMj5Nsk/ss-landing.png" alt="MVPBlocks component library preview" width={1000} height={600} className="animate-in fade-in slide-in-from-bottom-12 z-10 mx-auto -mb-60 w-full rounded-lg border-6 object-cover shadow-2xl duration-1000 select-none lg:-mb-40" />
              <div className="animate-in fade-in slide-in-from-left-4 absolute -top-6 -right-6 rotate-6 transform rounded-lg p-3 shadow-lg bg-[var(--background-lightest)] dark:bg-[var(--background-darkest)] border border-[var(--border)]">
                <div className="flex items-center gap-2"><svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg><span className="font-medium">Multiple Integrations</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Landing() {
  return (
    <>
      <PageMeta
        title="Nati.dev | Free, Local, Open-Source AI App Builder"
        description="Build AI apps with Nati. Free, local, open-source. The community-driven alternative to Lovable, v0, Bolt and Replit."
      />
      <Hero />
      <Feature3 />
      <InteractiveDemo />
      <BentoGrid1 />
      <IntegrationsShowcase />
      <section id="pricing">
        <CongestedPricing />
      </section>
      <TestimonialsSection />
      <FAQ3 />
      <FooterGlow />
    </>
  )
}