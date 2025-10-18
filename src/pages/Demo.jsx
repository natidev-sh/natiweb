import React from 'react'
import PageMeta from '../components/PageMeta.jsx'
import NatiDemoExperience from '../components/NatiDemoExperience.jsx'
import FooterGlow from '../components/FooterGlow.jsx'

export default function Demo() {
  return (
    <>
      <PageMeta
        title="Interactive Demo | Nati.dev - Build Apps in Seconds with AI"
        description="Experience Nati's AI-powered development. Watch as complete, production-ready applications are built from a single conversation. Try the world's most advanced AI IDE demo."
      />
      <NatiDemoExperience />
      <FooterGlow />
    </>
  )
}
