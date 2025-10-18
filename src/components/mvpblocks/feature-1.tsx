import React from 'react'
import { Code, Terminal, Paintbrush, Rocket, Book, PlusCircle } from 'lucide-react';

const features = [
  {
    icon: <Code className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Free & Open‑Source',
    desc: 'Nati is MIT-licensed and community-driven. No lock‑in, self-host or hack locally.',
  },
  {
    icon: <Terminal className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Local‑First Dev',
    desc: 'Build AI apps locally with instant feedback loops and zero cloud dependency.',
  },
  {
    icon: <Paintbrush className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Composable UI Blocks',
    desc: 'Drop-in React + Tailwind blocks you can fully customize to your brand.',
  },
  {
    icon: <Rocket className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Ship Faster',
    desc: 'Scaffold pages, wire flows, and deploy in hours—not weeks.',
  },
  {
    icon: <Book className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Great DX',
    desc: 'Typed components, sensible defaults, and examples for every block.',
  },
  {
    icon: <PlusCircle className="h-6 w-6 text-[var(--primary)]" />,
    title: 'Alternative to v0/Lovable',
    desc: 'Community alternative to Lovable, v0, Bolt, and Replit — but local and open.',
  },
];
export default function Feature1() {
  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mx-auto max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
              Nati: free, local, open‑source AI app builder
            </h3>
            <p className="font-geist text-foreground/60 mt-3">
              The community‑driven alternative to Lovable, v0, Bolt and Replit.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                'linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)',
            }}
          ></div>
        </div>
        <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
        <div className="relative mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4 [box-shadow:0_-20px_80px_-20px_#ff7aa42f_inset]"
              >
                <div className="w-fit transform-gpu rounded-full border p-4 text-[var(--primary)] [box-shadow:0_-20px_80px_-20px_#ff7aa43f_inset] dark:[box-shadow:0_-20px_80px_-20px_#ff7aa40f_inset]">
                  {item.icon}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="opacity-80">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
