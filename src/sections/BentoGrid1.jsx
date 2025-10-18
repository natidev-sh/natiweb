'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import MvpBentoGrid1 from '@/components/mvpblocks/bento-grid-1'

export default function BentoGrid1() {
  return (
    <section className="py-14" id="bento">
      <div className="mx-auto max-w-6xl px-4">
        <div className="sm:text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-medium tracking-tight">Build AI apps with Nati</h3>
          <p className="mt-2 opacity-80">Free, local, open‑source. The community‑driven alternative to Lovable, v0, Bolt and Replit.</p>
          <div className="mt-5 flex gap-3 sm:justify-center">
            <a href="https://github.com/natidev-sh" target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-[var(--border)] hover:border-[var(--primary)]/40 transition">
              Visit GitHub
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <MvpBentoGrid1 />
      </div>
    </section>
  )
}
