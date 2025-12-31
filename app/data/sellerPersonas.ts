export interface SellerPersona {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  description: string;
  color: string;
  energy: number;
  isDefault?: boolean;
  sampleMessage: string;
  signaturePhrase: string;
  bestFor: string[];
  communicationStyle: string[];
}

export const sellerPersonas: SellerPersona[] = [
  {
    id: 'social',
    name: 'Social Seller',
    initials: 'SS',
    subtitle: 'DMs + community',
    description: 'Always-on, fast-twitch rep who sells through replies, DMs, and comment threads.',
    color: '#0080FF',
    energy: 5,
    sampleMessage: "Hey Sarah, saw your recent post about scaling Fast-growing teams, really resonated with me. We're building something at sss that might interest you. Mind if I share?",
    signaturePhrase: '"I saw your post and had an idea."',
    bestFor: ['Inbound capture', 'Warm intros', 'Keeping leads warm'],
    communicationStyle: [
      'References recent social activity',
      'Uses casual, friendly language',
      'Asks questions that spark dialogue',
      'Keeps messages short and punchy'
    ]
  },
  {
    id: 'champion',
    name: 'Customer Champion',
    initials: 'CC',
    subtitle: 'Support-to-revenue',
    description: 'A calm, friendly rep who sells by fixing friction.',
    color: '#10B981',
    energy: 2,
    sampleMessage: "Hi Sarah, noticed you've been exploring solutions for your team. Happy to help without any pressure. What's your biggest challenge right now?",
    signaturePhrase: '"Let\'s get this sorted."',
    bestFor: ['Trials', 'Onboarding', 'Renewals', 'Expansion'],
    communicationStyle: [
      'Leads with empathy',
      'Focuses on removing obstacles',
      'Never pushy or aggressive',
      'Uses supportive language'
    ]
  },
  {
    id: 'data-driven',
    name: 'Data-Driven Closer',
    initials: 'DC',
    subtitle: 'Numbers-first',
    description: 'The spreadsheet assassin who leads with data.',
    color: '#6366F1',
    energy: 3,
    sampleMessage: "Sarah, quick question: what's your current conversion rate looking like? Most companies we work with at sss see 40% improvement in their first quarter.",
    signaturePhrase: '"Here\'s what your funnel is leaking."',
    bestFor: ['Discovery via metrics', 'ROI cases', 'Pricing discussions'],
    communicationStyle: [
      'Leads with numbers and metrics',
      'Quantifies pain points in dollars',
      'Uses benchmarks',
      'Builds logical cases'
    ]
  },
  {
    id: 'outbound',
    name: 'Outbound Hunter',
    initials: 'OH',
    subtitle: 'Detective energy',
    description: 'Prospecting rep who loves the chase.',
    color: '#14B8A6',
    energy: 4,
    isDefault: true,
    sampleMessage: "Sarah, did my homework. Saw sss's recent expansion and the challenges that come with it. I've got 3 ideas that might help. Worth a quick chat?",
    signaturePhrase: '"I did my homework."',
    bestFor: ['Targeted lists', 'Account research', 'Creative openers'],
    communicationStyle: [
      'Shows deep prospect research',
      'Creates personalized hooks',
      'Uses clever openers',
      'Demonstrates genuine curiosity'
    ]
  },
  {
    id: 'followup',
    name: 'Follow-Up Expert',
    initials: 'FE',
    subtitle: 'Pipeline conductor',
    description: 'The rep who wins by timing and sequencing.',
    color: '#8B5CF6',
    energy: 3,
    sampleMessage: "Hi Sarah, following up on my note last week. Given your Q4 planning, this might be perfect timing to explore how sss could help. Free for 15 min Thursday?",
    signaturePhrase: '"Right message, right time."',
    bestFor: ['Multi-touch follow-up', 'Re-engaging stale opps', 'Post-demo nudges'],
    communicationStyle: [
      'References previous conversations',
      'Creates logical next steps',
      'Uses time-based triggers',
      'Maintains consistent cadence'
    ]
  },
  {
    id: 'advisor',
    name: 'Trusted Advisor',
    initials: 'TA',
    subtitle: 'Trust builder',
    description: 'Consultative rep who makes buyers feel capable and supported.',
    color: '#F59E0B',
    energy: 2,
    sampleMessage: "Hi Sarah, I know evaluating new solutions can feel overwhelming. At sss, we like to take things one step at a time. Would a brief intro call help you understand if we're even the right fit?",
    signaturePhrase: '"We\'ll do this step by step."',
    bestFor: ['Hesitant buyers', 'Complex products', 'Longer sales cycles'],
    communicationStyle: [
      'Breaks down complexity',
      'Validates concerns first',
      'Uses collaborative language',
      'Offers resources and support'
    ]
  },
  {
    id: 'network',
    name: 'Network Builder',
    initials: 'NB',
    subtitle: 'Relationship connector',
    description: 'Connector rep who always seems to know someone.',
    color: '#06B6D4',
    energy: 3,
    sampleMessage: "Sarah, a mutual connection mentioned you're looking to scale. I know a few folks who've solved similar challenges. Happy to make intros or share what's worked.",
    signaturePhrase: '"I can introduce you."',
    bestFor: ['Partnerships', 'Channel sales', 'Referrals'],
    communicationStyle: [
      'Name-drops appropriately',
      'Offers introductions',
      'Creates mutual value',
      'Uses social proof naturally'
    ]
  },
  {
    id: 'storyteller',
    name: 'Storyteller',
    initials: 'ST',
    subtitle: 'Copy-driven persuader',
    description: 'The words-matter rep who makes complex simple.',
    color: '#EC4899',
    energy: 3,
    sampleMessage: "Sarah, here's the simplest way I can explain sss: we help companies do more with less. No magic, just tools that actually work. Curious?",
    signaturePhrase: '"Here\'s the simplest way to explain it."',
    bestFor: ['Pitch narratives', 'Objection handling', 'Email copy'],
    communicationStyle: [
      'Uses analogies and metaphors',
      'Crafts memorable one-liners',
      'Simplifies without dumbing down',
      'Creates emotional resonance'
    ]
  },
  {
    id: 'operations',
    name: 'Operations Pro',
    initials: 'OP',
    subtitle: 'Practical outcomes',
    description: 'Operations-minded rep who sells through execution details.',
    color: '#64748B',
    energy: 3,
    sampleMessage: "Hi Sarah, wondering how sss would fit into your current workflow. I've mapped out a few scenarios based on similar teams. Want me to walk you through them?",
    signaturePhrase: '"Here\'s how this fits into your workflow."',
    bestFor: ['E-commerce buyers', 'Integration discussions', 'Launch plans'],
    communicationStyle: [
      'Focuses on operational details',
      'Maps solutions to workflows',
      'Uses concrete timelines',
      'Addresses implementation concerns'
    ]
  },
  {
    id: 'quota',
    name: 'Quota Crusher',
    initials: 'QC',
    subtitle: 'High tempo closer',
    description: 'High-energy, confident rep who loves momentum.',
    color: '#EF4444',
    energy: 5,
    sampleMessage: "Sarah, let's cut to the chase. sss has helped 50+ companies scale faster. If you're serious about results, let's lock in a call this week.",
    signaturePhrase: '"Let\'s lock the next step."',
    bestFor: ['Driving urgency', 'Closing', 'Negotiation', 'Deal momentum'],
    communicationStyle: [
      'Creates clear next steps',
      'Uses urgency appropriately',
      'Keeps deals moving forward',
      'Handles objections confidently'
    ]
  },
  {
    id: 'technical',
    name: 'Technical Expert',
    initials: 'TE',
    subtitle: 'Nerdy credibility',
    description: 'Specialist rep with deep technical credibility.',
    color: '#059669',
    energy: 3,
    sampleMessage: "Sarah, from a technical standpoint, here's what makes sss different: [specific feature]. Happy to dive deeper into the architecture if you're interested.",
    signaturePhrase: '"Let me explain how this works under the hood."',
    bestFor: ['Technical stakeholders', 'Proof points', 'Trust through competence'],
    communicationStyle: [
      'Uses technical language appropriately',
      'Provides detailed explanations',
      'Anticipates technical questions',
      'Backs claims with specifics'
    ]
  },
  {
    id: 'facilitator',
    name: 'Deal Facilitator',
    initials: 'DF',
    subtitle: 'Procurement whisperer',
    description: 'The rep who makes buying easy.',
    color: '#84CC16',
    energy: 2,
    sampleMessage: "Hi Sarah, I'll make this easy. I've prepared everything you'd need to evaluate sss – security docs, pricing, implementation timeline. What would be most helpful to see first?",
    signaturePhrase: '"I\'ll handle the paperwork."',
    bestFor: ['Scheduling', 'Security questionnaires', 'Path to signature'],
    communicationStyle: [
      'Anticipates administrative needs',
      'Offers to handle logistics',
      'Coordinates across stakeholders',
      'Makes processes feel effortless'
    ]
  }
];

