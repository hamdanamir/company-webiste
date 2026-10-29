// Edit this collection to add projects. Keep descriptions accurate to the actual product.
// Add a local screenshot path and an approved https:// live URL when available.
window.veytrixaProjects = [
  {
    id: 'procureguard', name: 'ProcureGuard AI', category: 'AI-POWERED PROCUREMENT',
    summary: 'Smarter procurement. Clearer invoices. Fewer surprises.',
    description: 'An AI-powered procurement and invoice anomaly detection platform. ProcureGuard AI brings invoice processing, price and quantity anomaly detection, supplier and purchase order management, approval workflows, and an audit trail into a connected workspace, with real-time insights and reporting.',
    disciplines: ['Invoice automation', 'Anomaly detection', 'Procurement workflows'],
    artwork: 'procurement', screenshot: 'assets/projects/procureguard.png', liveUrl: '',
    imageNote: 'Project artwork supplied by Veytrixa Technologies.'
  },
  {
    id: 'n8n-automation', name: 'n8n Automation & AI Agents', category: 'WORKFLOW AUTOMATION',
    summary: 'Connected tools. Intelligent workflows. Less manual work.',
    description: 'Custom n8n workflows connecting AI agents with business tools. Explore the supplied workflow examples for invoice intake, AI-assisted data extraction, PostgreSQL operations, conditional routing, and email recovery with error handling.',
    disciplines: ['n8n', 'AI agents', 'API integrations'],
    artwork: 'procurement', screenshot: 'assets/projects/n8n-automation.png', liveUrl: '',
    imageNote: 'Workflow artwork supplied by Veytrixa Technologies. Open each image to explore the details.',
    gallery: [
      { src: 'assets/projects/invoice-automation.png', caption: 'Invoice automation — AI processing, validation, and database workflows' },
      { src: 'assets/projects/workflow-automation.png', caption: 'Workflow automation — email recovery, retries, and conditional logic' }
    ]
  },
  {
    id: 'voiceops', name: 'VoiceOps AI', category: 'AI VOICE RECEPTIONIST',
    summary: 'A welcoming voice. A smarter appointment workflow.',
    description: 'An AI voice receptionist and appointment automation project for dental clinics. VoiceOps AI combines call handling, availability checks, appointment scheduling, and Google Calendar integration with booking validation, duplicate prevention, and error handling. The supplied workflow showcase connects Retell AI, n8n, Supabase, and PostgreSQL.',
    disciplines: ['Voice AI', 'Appointment automation', 'Calendar integration'],
    artwork: 'voice', screenshot: 'assets/projects/voiceops-dashboard.png', liveUrl: '',
    imageNote: 'Project artwork supplied by Veytrixa Technologies. The automation hub image presents our broader services; figures shown in promotional artwork are not independently verified performance results.',
    gallery: [
      { src: 'assets/projects/voiceops-workflow.png', caption: 'VoiceOps AI — voice request validation and appointment booking workflows' },
      { src: 'assets/projects/veytrixa-automation-hub.png', caption: 'Veytrixa Technologies — broader AI agents and business automation services' }
    ]
  }
];
