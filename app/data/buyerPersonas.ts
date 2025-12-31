export interface JourneyStep {
  stage: string;
  description: string;
  experience: 'positive' | 'negative' | 'neutral';
}

export interface BuyerPersona {
  id: string;
  name: string;
  icon: string;
  role: string;
  employeeRange: string;
  primaryRisk: string;
  riskTitle: string;
  description: string;
  keyMotivations: string[];
  painPoints: string[];
  customerJourney: JourneyStep[];
  strategicOpportunity: string;
}

export const buyerPersonas: BuyerPersona[] = [
  {
    id: 'scrappy-scaler',
    name: 'Scrappy Scaler',
    icon: '📈',
    role: 'Founder / Head of Sales',
    employeeRange: '8 - 50 Employees',
    primaryRisk: 'High Pricing Sensitivity at Renewal',
    riskTitle: 'High Pricing Sensitivity at Renewal',
    description: 'Graduating from spreadsheets. Needs "plug and play" speed. Willing to pay, but terrified of efficiency loss and pricing cliffs.',
    keyMotivations: [
      'Centralize fragmented tools (Email + CRM + Marketing)',
      'Automate follow-ups to save time',
      'Get visibility into pipeline immediately (Series A pressure)',
      'Plug-and-play templates (No time for training)'
    ],
    painPoints: [
      'Pricing increasing steeply as they scale ($500 -> $3,200)',
      'Manual data entry kills their speed',
      'Team coordination issues in remote setups'
    ],
    customerJourney: [
      { stage: 'Trigger', description: 'Spreadsheets become unmanageable; closed funding round.', experience: 'neutral' },
      { stage: 'Evaluation', description: 'Attracted by "All-in-one" ecosystem promise.', experience: 'positive' },
      { stage: 'Adoption', description: 'High adoption if setup is fast. Loves automation.', experience: 'positive' },
      { stage: 'Growth', description: 'Friction arises when the bill jumps 5x in 18 months.', experience: 'negative' }
    ],
    strategicOpportunity: 'Focus on "Time Saved" metrics and offer clearer tiered pricing visibility to prevent sticker shock.'
  },
  {
    id: 'ecosystem-switcher',
    name: 'Ecosystem Switcher',
    icon: '🔄',
    role: 'VP of Operations',
    employeeRange: '150 - 300 Employees',
    primaryRisk: 'Integration Complexity Concerns',
    riskTitle: 'Integration Complexity Concerns',
    description: 'Moving from legacy systems. Needs seamless migration with minimal disruption. Values enterprise features but worried about change management.',
    keyMotivations: [
      'Replace multiple siloed tools with unified platform',
      'Better reporting and analytics capabilities',
      'Reduce IT maintenance overhead',
      'Improve cross-team collaboration'
    ],
    painPoints: [
      'Fear of data loss during migration',
      'Training 100+ employees on new system',
      'Justifying ROI to C-suite'
    ],
    customerJourney: [
      { stage: 'Trigger', description: 'Current vendor announces end-of-life or major price increase.', experience: 'negative' },
      { stage: 'Evaluation', description: 'Extensive vendor comparison with IT involvement.', experience: 'neutral' },
      { stage: 'Adoption', description: 'Phased rollout with dedicated success manager.', experience: 'positive' },
      { stage: 'Growth', description: 'Strong expansion once initial skeptics become advocates.', experience: 'positive' }
    ],
    strategicOpportunity: 'Offer white-glove migration services and pilot programs to reduce perceived risk.'
  },
  {
    id: 'overwhelmed-solopreneur',
    name: 'Overwhelmed Solopreneur',
    icon: '🏃',
    role: 'Founder / Owner',
    employeeRange: '1 - 5 Employees',
    primaryRisk: 'Feature Overwhelm Leading to Churn',
    riskTitle: 'Feature Overwhelm Leading to Churn',
    description: 'Wearing every hat. Needs simple, affordable solutions. Time-poor and budget-conscious but hungry for efficiency gains.',
    keyMotivations: [
      'Do more with less time',
      'Affordable pricing that scales slowly',
      'Quick wins without learning curve',
      'Mobile-first access'
    ],
    painPoints: [
      'Too many features create analysis paralysis',
      'No dedicated time for tool setup',
      'Tight budget constraints'
    ],
    customerJourney: [
      { stage: 'Trigger', description: 'Dropped ball on follow-up costs a deal.', experience: 'negative' },
      { stage: 'Evaluation', description: 'Free trial with focus on immediate value.', experience: 'positive' },
      { stage: 'Adoption', description: 'Uses 20% of features but loves them.', experience: 'positive' },
      { stage: 'Growth', description: 'Stays on starter plan indefinitely.', experience: 'neutral' }
    ],
    strategicOpportunity: 'Create "Quick Start" templates and highlight the 3 features that deliver 80% of value.'
  },
  {
    id: 'enterprise-power-user',
    name: 'Enterprise Power User',
    icon: '🏢',
    role: 'Director of Revenue Operations',
    employeeRange: '2,500+ Employees',
    primaryRisk: 'Procurement & Security Review Delays',
    riskTitle: 'Procurement & Security Review Delays',
    description: 'Sophisticated buyer with complex requirements. Needs enterprise-grade security, custom integrations, and dedicated support.',
    keyMotivations: [
      'API-first architecture for custom workflows',
      'SOC 2 / GDPR compliance',
      'Dedicated account management',
      'Custom SLAs and support'
    ],
    painPoints: [
      '6-month procurement cycles',
      'Multiple stakeholder approvals required',
      'Integration with existing tech stack'
    ],
    customerJourney: [
      { stage: 'Trigger', description: 'Board mandates revenue operations optimization.', experience: 'neutral' },
      { stage: 'Evaluation', description: 'Security review, legal, procurement involvement.', experience: 'neutral' },
      { stage: 'Adoption', description: 'Custom implementation with professional services.', experience: 'positive' },
      { stage: 'Growth', description: 'Multi-year contracts with expansion opportunities.', experience: 'positive' }
    ],
    strategicOpportunity: 'Invest in security certifications and build enterprise sales playbook with longer nurture cycles.'
  }
];

