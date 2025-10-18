// Search configuration for Orama
export const searchConfig = {
  type: 'static',
  api: '/api/search',
  
  // Search index will be built from MDX files
  index: async () => {
    // This will be populated with your docs content
    const documents = [
      {
        id: 'introduction',
        title: 'Introduction',
        description: 'Welcome to Nati.dev documentation',
        url: '/docs',
        content: 'Nati is a powerful AI app builder that runs locally on your machine',
      },
      {
        id: 'installation',
        title: 'Installation',
        description: 'Install Nati.dev on your machine',
        url: '/docs/installation',
        content: 'Get started with Nati.dev in minutes. Download for macOS or Windows',
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Create your first AI application',
        url: '/docs/getting-started',
        content: 'Build your first AI-powered application. Configure API keys, create apps',
      },
      {
        id: 'teams',
        title: 'Teams',
        description: 'Collaborate with your team',
        url: '/docs/teams',
        content: 'Team collaboration features. Create teams, invite members, share apps',
      },
      {
        id: 'api-reference',
        title: 'API Reference',
        description: 'Complete API documentation',
        url: '/docs/api-reference',
        content: 'Complete API reference. Authentication, endpoints, apps, teams, usage',
      },
    ];
    
    return documents;
  },
};
