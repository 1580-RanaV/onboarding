'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper, { Step } from './components/Stepper';
import { sellerPersonas } from './data/sellerPersonas';
import { buyerPersonas } from './data/buyerPersonas';

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [workspaceSlug, setWorkspaceSlug] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedPath, setSelectedPath] = useState<'marketer' | 'sales' | null>(null);
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [currentConnectingTool, setCurrentConnectingTool] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [gmailAuthStep, setGmailAuthStep] = useState<'options' | 'oauth' | 'app-password'>('options');
  const [selectedSellerPersona, setSelectedSellerPersona] = useState<string | null>('outbound'); // Default to Outbound Hunter
  const [selectedCommunicationStyle, setSelectedCommunicationStyle] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [targetAudience, setTargetAudience] = useState('');
  const [linkedinUrls, setLinkedinUrls] = useState<string[]>([]);
  const [brandUSP, setBrandUSP] = useState('');
  const [offerResults, setOfferResults] = useState('');
  const [competitiveLandscape, setCompetitiveLandscape] = useState('');
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState<string>('scrappy-scaler');
  const [activeMethodologyTab, setActiveMethodologyTab] = useState<'outreach' | 'replies'>('outreach');
  const [activeTipsLetter, setActiveTipsLetter] = useState<'T' | 'I' | 'P' | 'S'>('T');
  const [activeAceLetter, setActiveAceLetter] = useState<'A' | 'C' | 'E'>('A');
  const [activeEmailTab, setActiveEmailTab] = useState<'structure' | 'example'>('structure');
  const [selectedEmailProvider, setSelectedEmailProvider] = useState<'google' | null>(null);
  const [teamEmails, setTeamEmails] = useState<string[]>(['']);
  const [inviteLink] = useState('https://app.intempt.com/invite?code=522c8ffc');
  const salesPathDisabled = true;

  // Get the currently selected buyer persona details
  const currentBuyerPersona = buyerPersonas.find(p => p.id === selectedBuyerPersona);

  // Get the currently selected persona details
  const currentPersona = sellerPersonas.find(p => p.id === selectedSellerPersona);

  // Form validation for each step
  const isStep1Valid = fullName.trim() !== '' && email.trim() !== '' && agreeToTerms;
  const isStep2Valid =
    companySearch.trim() !== '' &&
    workspaceName.trim() !== '' &&
    websiteUrl.trim() !== '' &&
    workspaceSlug.trim() !== '';
  const isStep3Valid = selectedPath !== null;
  const isStep5Valid = selectedIntegrations.length > 0;
  const isStep6Valid = true; // Optional step - users can skip or connect later
  const isSalesStep5Valid = selectedSellerPersona !== null && selectedCommunicationStyle !== null;
  const isSalesStep6Valid = targetAudience.trim().length >= 100; // Minimum 100 characters
  const isSalesStep7Valid = brandUSP.trim().length >= 100;
  const isSalesStep8Valid = offerResults.trim().length >= 100;
  const isSalesStep9Valid = competitiveLandscape.trim().length >= 100;
  const isSalesStep10Valid = selectedBuyerPersona !== null;
  const isSalesStep11Valid = true; // Agent ready step - always valid
  const isSalesStep12Valid = true; // Email connection is optional (can skip)
  const isSalesStep13Valid = true; // Team invite is optional

  const addTeamEmail = () => {
    setTeamEmails([...teamEmails, '']);
  };

  const updateTeamEmail = (index: number, value: string) => {
    const newEmails = [...teamEmails];
    newEmails[index] = value;
    setTeamEmails(newEmails);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const toggleIntegration = (tool: string) => {
    setSelectedIntegrations(prev => 
      prev.includes(tool) 
        ? prev.filter(t => t !== tool)
        : [...prev, tool]
    );
  };

  const handleConnectClick = (tool: string) => {
    setCurrentConnectingTool(tool);
    setShowConnectModal(true);
    setApiKey('');
    if (tool === 'gmail') {
      setGmailAuthStep('options');
    }
  };

  const addLinkedinUrl = () => {
    if (linkedinUrls.length < 3) {
      setLinkedinUrls([...linkedinUrls, '']);
    }
  };

  const updateLinkedinUrl = (index: number, value: string) => {
    const newUrls = [...linkedinUrls];
    newUrls[index] = value;
    setLinkedinUrls(newUrls);
  };

  const removeLinkedinUrl = (index: number) => {
    setLinkedinUrls(linkedinUrls.filter((_, i) => i !== index));
  };

  const handleConnectSubmit = () => {
    if (apiKey.trim() && currentConnectingTool) {
      setConnectedIntegrations(prev => [...prev, currentConnectingTool]);
      setShowConnectModal(false);
      setCurrentConnectingTool(null);
      setApiKey('');
    }
  };

  const handleModalClose = () => {
    setShowConnectModal(false);
    setCurrentConnectingTool(null);
    setApiKey('');
    setGmailAuthStep('options');
  };

  // Integration details mapping
  const integrationDetails: Record<string, { name: string; type: string; description: string; logo: string }> = {
    hubspot: { name: 'HubSpot', type: 'Source', description: 'Sync contacts, deals, and marketing data from HubSpot', logo: 'https://cdn.brandfetch.io/hubspot.com?c=1idhE0Bg4BXpFRYkYnt' },
    shopify: { name: 'Shopify', type: 'Source', description: 'Import orders, customers, and product data from Shopify', logo: 'https://cdn.brandfetch.io/shopify.com?c=1idhE0Bg4BXpFRYkYnt' },
    stripe: { name: 'Stripe', type: 'Source', description: 'Track payments, subscriptions, and customer transactions', logo: 'https://cdn.brandfetch.io/stripe.com?c=1idhE0Bg4BXpFRYkYnt' },
    sendgrid: { name: 'Sendgrid', type: 'Destination', description: 'Send transactional and marketing emails via SendGrid', logo: 'https://cdn.brandfetch.io/sendgrid.com?c=1idhE0Bg4BXpFRYkYnt' },
    twilio: { name: 'Twilio', type: 'Destination', description: 'Send SMS notifications and voice messages through Twilio', logo: 'https://cdn.brandfetch.io/twilio.com?c=1idhE0Bg4BXpFRYkYnt' },
    slack: { name: 'Slack', type: 'Destination', description: 'Send notifications and alerts to your Slack workspace', logo: 'https://cdn.brandfetch.io/slack.com?c=1idhE0Bg4BXpFRYkYnt' },
    gmail: { name: 'Gmail', type: 'Destination', description: 'Send personalized emails directly from Gmail', logo: 'https://cdn.brandfetch.io/gmail.com?c=1idhE0Bg4BXpFRYkYnt' },
    android: { name: 'Android', type: 'Source', description: 'Collect user behavior and events from Android apps', logo: 'https://cdn.brandfetch.io/android.com?c=1idhE0Bg4BXpFRYkYnt' },
    ios: { name: 'iOS', type: 'Source', description: 'Track user interactions and events from iOS apps', logo: 'https://cdn.brandfetch.io/apple.com?c=1idhE0Bg4BXpFRYkYnt' },
    web: { name: 'Web', type: 'Source', description: 'Track website visitors and user behavior with JavaScript', logo: '' },
    nodejs: { name: 'Node.JS', type: 'Source', description: 'Integrate server-side tracking with Node.js applications', logo: 'https://cdn.brandfetch.io/nodejs.org?c=1idhE0Bg4BXpFRYkYnt' },
    api: { name: 'API', type: 'Source', description: 'Connect any data source using our REST API', logo: '' }
  };


  const getStepValidations = () => {
    const baseValidations = [isStep1Valid, isStep2Valid, isStep3Valid];
    
    if (selectedPath === 'marketer') {
      return [...baseValidations, isStep5Valid, isStep6Valid];
    } else if (selectedPath === 'sales') {
      return [...baseValidations, isSalesStep5Valid, isSalesStep6Valid, isSalesStep7Valid, isSalesStep8Valid, isSalesStep9Valid, isSalesStep10Valid, isSalesStep11Valid, isSalesStep12Valid, isSalesStep13Valid];
    }
    
    return baseValidations;
  };

  return (
    <div className="min-h-screen bg-white">
      <Stepper
        stepCircleContainerClassName="bg-white"
        stepValidations={getStepValidations()}
        onFinalStepCompleted={() => {
          console.log('Onboarding completed!');
        }}
      >
        <Step>
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <img
                src="/logo-name.svg"
                alt="Intempt"
                className="mx-auto h-10 w-auto"
              />
              <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-600">Get started in seconds</p>
            </div>

            {/* Social Sign-in Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-sm hover:border-gray-400 transition-colors">
                <img 
                  src="https://cdn.brandfetch.io/google.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Google" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>
              
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-sm hover:border-gray-400 transition-colors">
                <img 
                  src="https://cdn.brandfetch.io/microsoft.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Microsoft" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Continue with Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                  style={{ 
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0080FF';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                  style={{ 
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0080FF';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
        </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 border-gray-300 rounded"
                style={{
                  accentColor: '#0080FF'
                }}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" style={{ color: '#0080FF' }} className="hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" style={{ color: '#0080FF' }} className="hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/signin" style={{ color: '#0080FF' }} className="hover:underline font-medium">
                Log In
          </a>
        </div>
          </div>
        </Step>

        <Step>
          <div className="flex flex-col space-y-10">
            {/* Organization creation */}
            <div className="flex flex-col space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Create your organization</h2>
                <p className="text-sm text-gray-600">Search your company to auto-fill organization details.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="companySearch" className="block text-sm font-medium text-gray-700 mb-1">
                    Find your company
                  </label>
                  <input
                    id="companySearch"
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search company name..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{ 
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0080FF';
                      e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button 
                  className="w-full px-4 py-2.5 rounded-sm font-medium transition-colors"
                  style={{
                    backgroundColor: companySearch.trim() ? '#0080FF' : '#F3F4F6',
                    color: companySearch.trim() ? '#FFFFFF' : '#9CA3AF',
                    cursor: companySearch.trim() ? 'pointer' : 'not-allowed',
                    border: companySearch.trim() ? 'none' : '1px solid #E5E7EB'
                  }}
                  disabled={!companySearch.trim()}
                  onMouseEnter={(e) => {
                    if (companySearch.trim()) {
                      e.currentTarget.style.backgroundColor = '#0066CC';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (companySearch.trim()) {
                      e.currentTarget.style.backgroundColor = '#0080FF';
                    }
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Workspace details */}
            <div className="flex flex-col space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Review and customize your workspace details.</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-900 mb-1">
                    Workspace name
                  </label>
                  <input
                    id="workspaceName"
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Intempt Technologies"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{ 
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0080FF';
                      e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-900 mb-1">
                    Website URL
                  </label>
                  <input
                    id="websiteUrl"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="yourcompany.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{ 
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0080FF';
                      e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#D1D5DB';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">We'll analyze your website to pre-fill your brand information</p>
                </div>

                <div>
                  <label htmlFor="workspaceSlug" className="block text-sm font-medium text-gray-900 mb-1">
                    Workspace slug
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden"
                    style={{ 
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0080FF';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#D1D5DB';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <span className="px-4 py-2.5 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                      app.intempt.com/
                    </span>
                    <input
                      id="workspaceSlug"
                      type="text"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      placeholder="intempt"
                      className="flex-1 px-4 py-2.5 focus:outline-none text-gray-900 placeholder-gray-400 border-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">You can change this later in your workspace settings.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Workspace logo
                  </label>
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-sm">
                    <div>
                      <p className="text-sm text-gray-700">Upload image</p>
                      <p className="text-xs text-gray-500">Recommended size: 160A-160px</p>
                    </div>
                    <button 
                      className="px-4 py-2 text-white text-sm font-medium rounded-sm transition-colors"
                      style={{ backgroundColor: '#0080FF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0080FF'}
                    >
                      Choose file
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-900 mb-1">
                    Primary contact number (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+1"
                      readOnly
                      className="w-16 px-3 py-2.5 border border-gray-300 rounded-sm bg-gray-50 text-gray-700 text-center"
                    />
                    <input
                      id="contactNumber"
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="(555) 987-6543"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:border-transparent text-gray-900 placeholder-gray-400"
                      style={{ 
                        transition: 'all 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0080FF';
                        e.target.style.boxShadow = '0 0 0 2px rgba(0, 128, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For account recovery and notifications</p>
                </div>
              </div>
            </div>
          </div>
        </Step>
        <Step>
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-black">GrowthOS</h1>
              <h2 className="text-xl font-semibold text-gray-900">How do you want to grow?</h2>
              <p className="text-sm text-gray-600">Choose your path to unlock the right tools for your role.</p>
            </div>

            {/* Path Options - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2">
              {/* Marketer Option */}
              <div
                onClick={() => setSelectedPath('marketer')}
                className="relative border rounded-sm p-5 cursor-pointer transition-all duration-300 flex flex-col"
                style={{
                  borderColor: selectedPath === 'marketer' ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedPath === 'marketer' ? 'rgba(0, 128, 255, 0.02)' : 'white',
                  boxShadow: selectedPath === 'marketer' ? '0 0 0 3px rgba(0, 128, 255, 0.1)' : 'none'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-semibold text-gray-900">Growth OS for Marketers</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Full-stack marketing automation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Hyper-personalized customer journeys</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>A/B testing & CRO experiments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Product & web analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>AI-powered content generation</span>
                  </li>
                </ul>
                <button
                  className="w-full mt-4 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: selectedPath === 'marketer' ? '#0080FF' : 'white',
                    color: selectedPath === 'marketer' ? 'white' : '#6B7280',
                    border: `1px solid ${selectedPath === 'marketer' ? '#0080FF' : '#D1D5DB'}`
                  }}
                >
                  {selectedPath === 'marketer' ? 'Selected' : 'Select'}
                </button>
              </div>

              {/* Sales Rep Option */}
              <div
                aria-disabled={salesPathDisabled}
                onClick={() => {
                  if (!salesPathDisabled) {
                    setSelectedPath('sales');
                  }
                }}
                className={`relative border rounded-sm p-5 transition-all duration-300 flex flex-col ${
                  salesPathDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
                style={{
                  pointerEvents: salesPathDisabled ? 'none' : 'auto',
                  borderColor: salesPathDisabled
                    ? '#E5E7EB'
                    : selectedPath === 'sales'
                      ? '#0080FF'
                      : '#D1D5DB',
                  backgroundColor: salesPathDisabled
                    ? '#F9FAFB'
                    : selectedPath === 'sales'
                      ? 'rgba(0, 128, 255, 0.02)'
                      : 'white',
                  boxShadow: salesPathDisabled
                    ? 'none'
                    : selectedPath === 'sales'
                      ? '0 0 0 3px rgba(0, 128, 255, 0.1)'
                      : 'none'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base font-semibold text-gray-500">Growth OS for Sales Reps</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Intelligent sales pipeline management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>AI email drafting & inbox management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Calendar & meeting scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Automated note-taking & transcription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xs mt-0.5">•</span>
                    <span>Smart CRM & deal tracking</span>
                  </li>
                </ul>
                <button
                  className="w-full mt-4 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: salesPathDisabled
                      ? '#F3F4F6'
                      : selectedPath === 'sales'
                        ? '#0080FF'
                        : 'white',
                    color: salesPathDisabled
                      ? '#9CA3AF'
                      : selectedPath === 'sales'
                        ? 'white'
                        : '#6B7280',
                    border: `1px solid ${
                      salesPathDisabled
                        ? '#E5E7EB'
                        : selectedPath === 'sales'
                          ? '#0080FF'
                          : '#D1D5DB'
                    }`,
                    cursor: salesPathDisabled ? 'not-allowed' : 'pointer'
                  }}
                  disabled={salesPathDisabled}
                >
                  {salesPathDisabled ? 'Coming soon' : selectedPath === 'sales' ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>

            {/* Helper Text */}
            {!selectedPath && (
              <p className="text-center text-sm" style={{ color: '#EF4444' }}>Select a path</p>
            )}
          </div>
        </Step>
        
        {/* Marketer Path - Step 5: Which tools to integrate */}
        {selectedPath === 'marketer' && (
            <Step>
              <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">Which tools would you like to integrate?</h2>
                  <p className="text-sm text-gray-600">Select the tools you want to connect to power your marketing automation.</p>
                </div>

            {/* Integration Tools Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* HubSpot */}
              <div
                onClick={() => toggleIntegration('hubspot')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('hubspot') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('hubspot') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('hubspot') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/hubspot.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="HubSpot" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">HubSpot</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* Shopify */}
              <div
                onClick={() => toggleIntegration('shopify')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('shopify') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('shopify') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('shopify') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/shopify.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Shopify" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Shopify</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* Stripe */}
              <div
                onClick={() => toggleIntegration('stripe')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('stripe') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('stripe') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('stripe') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/stripe.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Stripe" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Stripe</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* Sendgrid */}
              <div
                onClick={() => toggleIntegration('sendgrid')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('sendgrid') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('sendgrid') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('sendgrid') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/sendgrid.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Sendgrid" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Sendgrid</p>
                <p className="text-xs text-gray-500">Destination</p>
              </div>

              {/* Twilio */}
              <div
                onClick={() => toggleIntegration('twilio')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('twilio') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('twilio') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('twilio') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/twilio.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Twilio" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Twilio</p>
                <p className="text-xs text-gray-500">Destination</p>
              </div>

              {/* Slack */}
              <div
                onClick={() => toggleIntegration('slack')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('slack') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('slack') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('slack') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/slack.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Slack" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Slack</p>
                <p className="text-xs text-gray-500">Destination</p>
              </div>

              {/* Gmail */}
              <div
                onClick={() => toggleIntegration('gmail')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('gmail') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('gmail') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('gmail') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/gmail.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Gmail" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Gmail</p>
                <p className="text-xs text-gray-500">Destination</p>
              </div>

              {/* Android */}
              <div
                onClick={() => toggleIntegration('android')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('android') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('android') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('android') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/android.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Android" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Android</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* iOS */}
              <div
                onClick={() => toggleIntegration('ios')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('ios') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('ios') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('ios') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/apple.com?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="iOS" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">iOS</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* Web */}
              <div
                onClick={() => toggleIntegration('web')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('web') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('web') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('web') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-yellow-400 rounded-sm">
                  <span className="text-2xl font-bold text-black">JS</span>
                </div>
                <p className="text-xs font-medium text-gray-900 text-center">Web</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* Node.JS */}
              <div
                onClick={() => toggleIntegration('nodejs')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('nodejs') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('nodejs') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('nodejs') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <img 
                  src="https://cdn.brandfetch.io/nodejs.org?c=1idhE0Bg4BXpFRYkYnt" 
                  alt="Node.JS" 
                  className="w-12 h-12 mb-2"
                />
                <p className="text-xs font-medium text-gray-900 text-center">Node.JS</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>

              {/* API */}
              <div
                onClick={() => toggleIntegration('api')}
                className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center aspect-square"
                style={{
                  borderColor: selectedIntegrations.includes('api') ? '#0080FF' : '#D1D5DB',
                  backgroundColor: selectedIntegrations.includes('api') ? 'rgba(0, 128, 255, 0.05)' : 'white',
                  boxShadow: selectedIntegrations.includes('api') ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                }}
              >
                <div className="w-12 h-12 mb-2 flex items-center justify-center bg-blue-500 rounded-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-900 text-center">API</p>
                <p className="text-xs text-gray-500">Source</p>
              </div>
            </div>

            {/* Selected Count */}
            {selectedIntegrations.length > 0 && (
              <p className="text-center text-sm text-gray-600">
                {selectedIntegrations.length} tool{selectedIntegrations.length !== 1 ? 's' : ''} selected
              </p>
            )}
        </div>
        </Step>
        )}

        {/* Marketer Path - Step 6: Connect your data */}
        {selectedPath === 'marketer' && (
        <Step>
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Connect your data to get started
              </h2>
              <p className="text-sm text-gray-600">Set up your integrations to start collecting and analyzing data.</p>
            </div>

            {/* Selected Integrations List */}
            <div className="space-y-4">
              {selectedIntegrations.map((toolKey) => {
                const tool = integrationDetails[toolKey];
                const isConnected = connectedIntegrations.includes(toolKey);
                
  return (
                  <div 
                    key={toolKey}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-sm bg-white gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      {/* Logo */}
                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        {tool.logo ? (
                          <img 
                            src={tool.logo} 
                            alt={tool.name} 
                            className="w-12 h-12"
                          />
                        ) : toolKey === 'web' ? (
                          <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-sm">
                            <span className="text-xl font-bold text-black">JS</span>
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-500 rounded-sm">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">{tool.name}</h3>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-sm"
                            style={{ 
                              backgroundColor: tool.type === 'Source' ? '#DBEAFE' : '#FCE7F3',
                              color: tool.type === 'Source' ? '#1E40AF' : '#BE185D'
                            }}
                          >
                            {tool.type}
                          </span>
        </div>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto sm:ml-4">
                      {isConnected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Connected</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleConnectClick(toolKey)}
                            className="px-4 py-2 rounded-sm text-sm font-medium text-white transition-colors w-full sm:w-auto text-center"
                            style={{ backgroundColor: '#0080FF' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0080FF'}
                          >
                            Connect
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Ask project member
                          </button>
                        </>
                      )}
                    </div>
    </div>
  );
              })}
            </div>

            {/* Security Notice */}
            <p className="text-sm text-center" style={{ color: '#10B981' }}>
              Your data is encrypted and secure. We never share your credentials with third parties.
            </p>

            {/* Progress Info */}
            {connectedIntegrations.length > 0 && (
              <p className="text-center text-sm text-gray-600">
                {connectedIntegrations.length} of {selectedIntegrations.length} integration{selectedIntegrations.length !== 1 ? 's' : ''} connected
              </p>
            )}
          </div>
        </Step>
        )}

        {/* Sales Rep Path - Step 5: Seller Persona Selection */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <p className="text-sm font-medium" style={{ color: '#0080FF' }}>Blu AI</p>
                <h2 className="text-2xl font-bold text-gray-900">Choose your Seller Persona</h2>
                <p className="text-sm text-gray-600">How should Agent Blu communicate? Pick the voice that matches your brand.</p>
              </div>

              {/* Seller Personas Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Map through all personas */}
                {sellerPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedSellerPersona(persona.id)}
                    className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedSellerPersona === persona.id ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedSellerPersona === persona.id ? 'rgba(0, 128, 255, 0.05)' : 'white',
                      boxShadow: selectedSellerPersona === persona.id ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                    }}
                  >
                    {/* Selection indicator or Default badge */}
                    <div className="absolute top-2 right-2">
                      {selectedSellerPersona === persona.id ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : persona.isDefault ? (
                        <span className="text-xs px-2 py-0.5 rounded-sm" style={{ backgroundColor: '#0080FF', color: 'white' }}>Default</span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center text-white font-bold" style={{ backgroundColor: persona.color }}>
                        {persona.initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{persona.name}</h3>
                        <p className="text-xs text-gray-500">{persona.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{persona.description}</p>
                    <div className="flex gap-0.5 mt-2">
                      {Array.from({ length: persona.energy }).map((_, i) => (
                        <span key={i} className="text-yellow-400">⚡</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Communication Personality Section - Now below the grid */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Communication Personality</h3>
                    <p className="text-sm text-gray-600">How should your agent express itself?</p>
                  </div>
                  <button className="text-sm" style={{ color: '#0080FF' }}>Show details →</button>
                </div>

                {/* Communication Styles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Default */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('default')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'default' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'default' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="text-sm font-semibold text-gray-900">Default</h4>
                    <p className="text-xs text-gray-600 mt-1">Clear and neutral. Standard style.</p>
                  </div>

                  {/* Professional */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('professional')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'professional' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'professional' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">💼</div>
                    <h4 className="text-sm font-semibold text-gray-900">Professional</h4>
                    <p className="text-xs text-gray-600 mt-1">Polished and precise. Uses formal language.</p>
                  </div>

                  {/* Friendly */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('friendly')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'friendly' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'friendly' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">🤝</div>
                    <h4 className="text-sm font-semibold text-gray-900">Friendly</h4>
                    <p className="text-xs text-gray-600 mt-1">Warm and chatty, with calm clarity and light wit.</p>
                  </div>

                  {/* Candid */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('candid')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'candid' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'candid' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="text-sm font-semibold text-gray-900">Candid</h4>
                    <p className="text-xs text-gray-600 mt-1">Direct and encouraging. Honest feedback with clear next steps.</p>
                  </div>

                  {/* Quirky */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('quirky')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'quirky' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'quirky' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">🎨</div>
                    <h4 className="text-sm font-semibold text-gray-900">Quirky</h4>
                    <p className="text-xs text-gray-600 mt-1">Playful and imaginative. Uses humor and unexpected ideas.</p>
                  </div>

                  {/* Efficient */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('efficient')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'efficient' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'efficient' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="text-sm font-semibold text-gray-900">Efficient</h4>
                    <p className="text-xs text-gray-600 mt-1">Concise and plain. Direct answers without extra words.</p>
                  </div>

                  {/* Nerdy */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('nerdy')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'nerdy' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'nerdy' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">🧠</div>
                    <h4 className="text-sm font-semibold text-gray-900">Nerdy</h4>
                    <p className="text-xs text-gray-600 mt-1">Exploratory and enthusiastic. Celebrates knowledge and discovery.</p>
                  </div>

                  {/* Cynical */}
                  <div
                    onClick={() => setSelectedCommunicationStyle('cynical')}
                    className="border rounded-sm p-3 cursor-pointer transition-all duration-300"
                    style={{
                      borderColor: selectedCommunicationStyle === 'cynical' ? '#0080FF' : '#D1D5DB',
                      backgroundColor: selectedCommunicationStyle === 'cynical' ? 'rgba(0, 128, 255, 0.05)' : 'white'
                    }}
                  >
                    <div className="text-2xl mb-2">😏</div>
                    <h4 className="text-sm font-semibold text-gray-900">Cynical</h4>
                    <p className="text-xs text-gray-600 mt-1">Sarcastic and dry. Delivers blunt help with wit.</p>
                  </div>
                </div>
              </div>

              {/* Selected Persona Preview - Below Communication Personality */}
              {currentPersona && (
                <div className="border border-gray-200 rounded-sm p-6 mt-6" style={{ backgroundColor: '#F9FAFB' }}>
                  <div className="grid grid-cols-3 gap-6">
                    {/* Left: Persona Header */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-sm flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: currentPersona.color }}>
                          {currentPersona.initials}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{currentPersona.name}</h3>
                          <p className="text-sm text-gray-500">{currentPersona.subtitle}</p>
                        </div>
                      </div>

                      {/* Signature Phrase */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="text-xs font-medium text-gray-500">SIGNATURE PHRASE</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{currentPersona.signaturePhrase}</p>
                      </div>

                      {/* Best For */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500">BEST FOR</p>
                        <div className="flex flex-wrap gap-2">
                          {currentPersona.bestFor.map((item, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-sm bg-white border border-gray-200 text-gray-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Communication Style */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500">COMMUNICATION STYLE</p>
                        <ul className="space-y-1.5">
                          {currentPersona.communicationStyle.map((style, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-xs mt-0.5" style={{ color: '#0080FF' }}>•</span>
                              <span className="text-xs text-gray-700">{style}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Sample Message */}
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" style={{ color: '#0080FF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-xs font-medium" style={{ color: '#0080FF' }}>SAMPLE SELLER MESSAGE</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-sm p-4">
                        <p className="text-sm text-gray-900 leading-relaxed">{currentPersona.sampleMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </Step>
        )}

        {/* Sales Step 6: Question 1 - Target Audience */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Question 1 of 4</p>
                <h2 className="text-2xl font-bold text-gray-900">Who is your target audience?</h2>
                <p className="text-sm text-gray-600">
                  Define your audience segments and ideal customer profile. Include job titles, company size, industry, pain points, and any other relevant characteristics. You can also provide up to 3 LinkedIn profile URLs for us to analyze. Please ensure these are public profiles for best results.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[180px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: targetAudience.length >= 100 ? '#0080FF' : '#D1D5DB'
                  }}
                />
                <p className={`text-sm ${targetAudience.length >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                  {targetAudience.length} / 100 characters minimum
                </p>
              </div>

              {/* LinkedIn Profile URLs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">LinkedIn Profile URLs (Optional, max 3)</h3>
                    <p className="text-xs text-gray-600 mt-1">Add up to 3 LinkedIn profile URLs to help us understand your ideal customer.</p>
                  </div>
                  {linkedinUrls.length < 3 && (
                    <button
                      onClick={addLinkedinUrl}
                      className="flex items-center gap-2 px-4 py-2 rounded-sm border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add URL
                    </button>
                  )}
                </div>

                {/* LinkedIn URL Inputs */}
                {linkedinUrls.length > 0 && (
                  <div className="space-y-3">
                    {linkedinUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateLinkedinUrl(index, e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <button
                          onClick={() => removeLinkedinUrl(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 7: Question 2 - Brand & USP */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Question 2 of 4</p>
                <h2 className="text-2xl font-bold text-gray-900">Tell us about your brand and your Unique Selling Proposition</h2>
                <p className="text-sm text-gray-600">
                  Describe your company's story, mission, core values, and key business goals. Include what industry you're in and what makes you unique.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <textarea
                  value={brandUSP}
                  onChange={(e) => setBrandUSP(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[180px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: brandUSP.length >= 100 ? '#0080FF' : '#D1D5DB'
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${brandUSP.length >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                    {brandUSP.length} / 100 characters minimum
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span>Pre-filled from website analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 8: Question 3 - Offer & Results */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Question 3 of 4</p>
                <h2 className="text-2xl font-bold text-gray-900">What do you offer and what results do you deliver?</h2>
                <p className="text-sm text-gray-600">
                  List your main products or services with key features and pricing. Include specific metrics, percentages, or tangible outcomes your customers achieve.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <textarea
                  value={offerResults}
                  onChange={(e) => setOfferResults(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[180px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: offerResults.length >= 100 ? '#0080FF' : '#D1D5DB'
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${offerResults.length >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                    {offerResults.length} / 100 characters minimum
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span>Pre-filled from website analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 9: Question 4 - Competitive Landscape */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Question 4 of 4</p>
                <h2 className="text-2xl font-bold text-gray-900">What is your competitive landscape?</h2>
                <p className="text-sm text-gray-600">
                  List your main competitors (comma-separated), common customer objections, and what makes you unique compared to competitors.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <textarea
                  value={competitiveLandscape}
                  onChange={(e) => setCompetitiveLandscape(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full min-h-[180px] px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: competitiveLandscape.length >= 100 ? '#0080FF' : '#D1D5DB'
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${competitiveLandscape.length >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
                    {competitiveLandscape.length} / 100 characters minimum
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span>Pre-filled from website analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 10: Buyer Persona */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 128, 255, 0.1)', color: '#0080FF' }}>
                  <span>🤖</span>
                  <span>Define your Buyer Persona</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Choose your Buyer Persona</h2>
                <p className="text-sm text-gray-600">Select who your Seller Persona will target.</p>
              </div>

              {/* Info Banner */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🤖</span>
                  <p className="text-sm text-gray-600">
                    These personas will continue to improve as we complete the full website crawl, and will automatically refine based on your real <span className="text-green-600 font-medium">Accounts</span> and <span className="text-orange-500 font-medium">Users</span> once you connect your email to build your CRM.
                  </p>
                </div>
              </div>

              {/* Personas Row - 4 columns */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Personas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {buyerPersonas.map((persona) => (
                    <div
                      key={persona.id}
                      onClick={() => setSelectedBuyerPersona(persona.id)}
                      className="relative border rounded-sm p-4 cursor-pointer transition-all duration-300 text-center"
                      style={{
                        borderColor: selectedBuyerPersona === persona.id ? '#0080FF' : '#D1D5DB',
                        backgroundColor: selectedBuyerPersona === persona.id ? 'rgba(0, 128, 255, 0.05)' : 'white',
                        boxShadow: selectedBuyerPersona === persona.id ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                      }}
                    >
                      {selectedBuyerPersona === persona.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl" style={{ backgroundColor: '#E5E7EB' }}>
                          {persona.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{persona.name}</h3>
                          <p className="text-xs text-gray-500">{persona.employeeRange}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Panel - Full width below */}
              {currentBuyerPersona && (
                <div className="space-y-4">
                    {/* Persona Header */}
                    <div className="border border-gray-200 rounded-sm p-5" style={{ backgroundColor: '#111827' }}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-sm flex items-center justify-center text-2xl" style={{ backgroundColor: '#1F2937' }}>
                            {currentBuyerPersona.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{currentBuyerPersona.name}</h3>
                            <p className="text-sm text-gray-400">{currentBuyerPersona.role} • {currentBuyerPersona.employeeRange}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Primary Risk */}
                      <div className="mt-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Primary Risk</p>
                        <p className="text-sm font-medium text-red-400 mt-1">{currentBuyerPersona.primaryRisk}</p>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-sm text-gray-300">{currentBuyerPersona.description}</p>

                      {/* Key Motivations & Pain Points */}
                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="bg-gray-800/50 rounded-sm p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-green-400">✓</span>
                            <h4 className="text-sm font-semibold text-white">Key Motivations</h4>
                          </div>
                          <ul className="space-y-2">
                            {currentBuyerPersona.keyMotivations.map((motivation, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400 text-xs mt-1">•</span>
                                <span className="text-xs text-gray-300">{motivation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-gray-800/50 rounded-sm p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-red-400">⚠</span>
                            <h4 className="text-sm font-semibold text-white">Pain Points</h4>
                          </div>
                          <ul className="space-y-2">
                            {currentBuyerPersona.painPoints.map((pain, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-400 text-xs mt-1">•</span>
                                <span className="text-xs text-gray-300">{pain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Customer Journey Map */}
                    <div className="border border-gray-200 rounded-sm p-5" style={{ backgroundColor: '#111827' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🤖</span>
                        <h4 className="text-sm font-semibold text-white">Customer Journey Map</h4>
                      </div>
                      <div className="flex items-start justify-between">
                        {currentBuyerPersona.customerJourney.map((step, index) => (
                          <div key={index} className="flex-1 relative">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                step.experience === 'positive' ? 'bg-green-500' : 
                                step.experience === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                              }`}>
                                {index + 1}
                              </div>
                              <p className="text-xs font-medium text-white mt-2">{step.stage}</p>
                              <p className="text-xs text-gray-400 text-center mt-1 px-2">{step.description}</p>
                              <p className={`text-xs mt-2 uppercase tracking-wide ${
                                step.experience === 'positive' ? 'text-green-400' : 
                                step.experience === 'negative' ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {step.experience} experience
                              </p>
                            </div>
                            {index < currentBuyerPersona.customerJourney.length - 1 && (
                              <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-600" style={{ transform: 'translateX(50%)' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Strategic Opportunity */}
                  <div className="border border-gray-200 rounded-sm p-4" style={{ backgroundColor: '#111827' }}>
                    <h4 className="text-sm font-semibold text-white mb-2">Strategic Opportunity</h4>
                    <p className="text-sm text-gray-300">{currentBuyerPersona.strategicOpportunity}</p>
                  </div>
                </div>
              )}
            </div>
          </Step>
        )}

        {/* Sales Step 11: Your Agent is Ready */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 128, 255, 0.1)', color: '#0080FF' }}>
                  <span>🤖</span>
                  <span>Your agent is ready</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Meet Your Agent Blu</h2>
                <p className="text-sm text-gray-600">
                  Combining <span className="font-semibold">{currentPersona?.name || 'Outbound Hunter'}</span> with <span className="font-semibold">{currentBuyerPersona?.name || 'Scrappy Scaler'}</span> using the proven T.I.P.S. framework
                </p>
              </div>

              {/* Seller & Buyer Persona Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Seller Persona */}
                <div className="border border-gray-200 rounded-sm p-4" style={{ backgroundColor: '#F9FAFB' }}>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Seller Persona</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center text-white font-bold" style={{ backgroundColor: currentPersona?.color || '#14B8A6' }}>
                      {currentPersona?.initials || 'OH'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{currentPersona?.name || 'Outbound Hunter'}</h3>
                      <p className="text-xs text-gray-500">{currentPersona?.subtitle || 'Detective energy'}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700 italic">{currentPersona?.signaturePhrase || '"I did my homework."'}</p>
                </div>

                {/* Buyer Persona */}
                <div className="border border-gray-200 rounded-sm p-4" style={{ backgroundColor: '#F9FAFB' }}>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Buyer Persona</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-sm flex items-center justify-center text-xl" style={{ backgroundColor: '#E5E7EB' }}>
                      {currentBuyerPersona?.icon || '📈'}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{currentBuyerPersona?.name || 'Scrappy Scaler'}</h3>
                      <p className="text-xs text-gray-500">{currentBuyerPersona?.role} • {currentBuyerPersona?.employeeRange}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-red-500">
                    <span className="font-medium">Pain:</span> {currentBuyerPersona?.painPoints[0] || 'Pricing increasing steeply as they scale'}
                  </p>
                </div>
              </div>

              {/* Agent Capabilities */}
              <div className="border border-gray-200 rounded-sm p-5" style={{ backgroundColor: '#111827' }}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">YOUR AGENT'S CAPABILITIES</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Outreach */}
                  <div className="bg-gray-800/50 rounded-sm p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Outreach</h4>
                    <p className="text-xs text-gray-400 mb-3">Proactive messaging using T.I.P.S.</p>
                    <div className="flex gap-2">
                      {['T', 'I', 'P', 'S'].map((letter) => (
                        <div key={letter} className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#0080FF' }}>
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Replies */}
                  <div className="bg-gray-800/50 rounded-sm p-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Replies</h4>
                    <p className="text-xs text-gray-400 mb-3">Responding to inbound using A.C.E.</p>
                    <div className="flex gap-2">
                      {['A', 'C', 'E'].map((letter) => (
                        <div key={letter} className="w-8 h-8 rounded-sm flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#10B981' }}>
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Methodology Details */}
              <div className="border border-gray-200 rounded-sm" style={{ backgroundColor: '#111827' }}>
                {/* Tabs */}
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => setActiveMethodologyTab('outreach')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeMethodologyTab === 'outreach' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Outreach (TIPS)
                  </button>
                  <button
                    onClick={() => setActiveMethodologyTab('replies')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeMethodologyTab === 'replies' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-gray-300'}`}
                  >
                    Replies (A.C.E.)
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-5">
                  {activeMethodologyTab === 'outreach' ? (
                    <div className="space-y-6">
                      {/* Methodology Options */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="border border-blue-500 rounded-sm p-3 bg-blue-500/10">
                          <h5 className="text-sm font-semibold text-white">T.I.P.S.</h5>
                          <p className="text-xs text-gray-400 mt-1">Triggered Outreach</p>
                          <p className="text-xs text-gray-500 mt-2">Best for: High relevance + fast replies (esp. B2B SaaS / ABM)</p>
                        </div>
                        <div className="border border-gray-600 rounded-sm p-3">
                          <h5 className="text-sm font-semibold text-gray-300">P.V.P.</h5>
                          <p className="text-xs text-gray-400 mt-1">Direct Value Pitch</p>
                          <p className="text-xs text-gray-500 mt-2">Best for: Broad applicability, fastest to generate</p>
                        </div>
                        <div className="border border-gray-600 rounded-sm p-3">
                          <h5 className="text-sm font-semibold text-gray-300">P.A.S.</h5>
                          <p className="text-xs text-gray-400 mt-1">Pain → Fix</p>
                          <p className="text-xs text-gray-500 mt-2">Best for: Pain-driven offers (ops, data, security)</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400">
                        Core idea: Lead with a real-time reason, add a sharp observation, reduce risk with proof, ask for a tiny next step.
                      </p>

                      {/* T.I.P.S. Framework */}
                      <div>
                        <h4 className="text-base font-semibold text-white mb-2">The T.I.P.S. Framework</h4>
                        <p className="text-xs text-gray-400 mb-4">A proven framework for crafting personalized outreach that gets responses</p>
                        
                        {/* Letter Tabs */}
                        <div className="flex gap-2 mb-4">
                          {(['T', 'I', 'P', 'S'] as const).map((letter) => (
                            <button
                              key={letter}
                              onClick={() => setActiveTipsLetter(letter)}
                              className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold transition-all ${activeTipsLetter === letter ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                              {letter}
                            </button>
                          ))}
                        </div>

                        {/* Letter Content */}
                        <div className="bg-gray-800/50 rounded-sm p-4">
                          {activeTipsLetter === 'T' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">T - Trigger</h5>
                              <p className="text-xs text-gray-300 mb-3">Start with a real, timely reason for reaching out</p>
                              <p className="text-xs text-gray-400">The trigger is what makes your outreach feel timely and relevant. It could be a funding announcement, a new hire, a product launch, or even a LinkedIn post. The key is that it happened recently and gives you a legitimate reason to reach out NOW rather than any other time.</p>
                            </>
                          )}
                          {activeTipsLetter === 'I' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">I - Insight</h5>
                              <p className="text-xs text-gray-300 mb-3">Share a sharp observation that shows you understand their world</p>
                              <p className="text-xs text-gray-400">The insight demonstrates that you've done your research and understand the challenges they're likely facing. It should feel specific to their situation, not generic.</p>
                            </>
                          )}
                          {activeTipsLetter === 'P' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">P - Proof</h5>
                              <p className="text-xs text-gray-300 mb-3">Reduce risk with a relevant success story</p>
                              <p className="text-xs text-gray-400">Proof reduces perceived risk by showing you've helped similar companies achieve similar outcomes. Use specific metrics and company names when possible.</p>
                            </>
                          )}
                          {activeTipsLetter === 'S' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">S - Small Ask</h5>
                              <p className="text-xs text-gray-300 mb-3">End with a micro-CTA that's easy to say yes to</p>
                              <p className="text-xs text-gray-400">The small ask makes it easy for them to take the next step. "Worth a 12-min look?" is much easier to agree to than "Can we schedule a demo?"</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 5-Email Sequence */}
                      <div>
                        <h4 className="text-base font-semibold text-white mb-2">Your 5-Email Sequence</h4>
                        <p className="text-xs text-gray-400 mb-4">T.I.P.S. sequence templates Agent Blu will adapt to your ICP</p>
                        
                        <div className="flex gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <div key={num} className={`flex-1 p-2 rounded-sm text-center ${num === 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                              <p className="text-xs font-bold text-white">{num}</p>
                              <p className="text-xs text-gray-300 mt-1">
                                {num === 1 && 'Trigger + Insight + Proof + Micro-CTA'}
                                {num === 2 && 'New Trigger or Deeper Insight'}
                                {num === 3 && 'Proof-Heavy (Case or Mini-Story)'}
                                {num === 4 && '"Give-First" Teardown/Checklist'}
                                {num === 5 && 'Breakup (Permission-Based)'}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Structure/Example Tabs */}
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => setActiveEmailTab('structure')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeEmailTab === 'structure' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >
                            Structure
                          </button>
                          <button
                            onClick={() => setActiveEmailTab('example')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${activeEmailTab === 'example' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                          >
                            Example
                          </button>
                        </div>

                        <div className="bg-gray-800/50 rounded-sm p-4">
                          {activeEmailTab === 'structure' ? (
                            <div>
                              <p className="text-xs text-gray-400 mb-2">Initial Email • Trigger + Insight + Proof + Micro-CTA</p>
                              <p className="text-xs text-gray-500">Email 1 of 5</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-300">Hey Rob,</p>
                              <p className="text-sm text-gray-300">Saw Acme just closed your Series B — congrats. Scaling the sales team is usually next.</p>
                              <p className="text-sm text-gray-300">Most B2B teams at this stage lose 30% of qualified leads to slow follow-up. It's the hidden cost of growing fast.</p>
                              <p className="text-sm text-gray-300">We helped Lattice cut that to under 5% in 60 days.</p>
                              <p className="text-sm text-gray-300">Worth a 12-min look?</p>
                              <p className="text-sm text-gray-300">Sid</p>
                              <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-xs font-semibold text-white mb-2">Why this works</p>
                                <p className="text-xs text-gray-400">The trigger (Series B) makes this feel timely, not random. The insight (30% lead loss) shows you understand their world. The proof (Lattice) reduces risk. The CTA (12-min look) is so small it's hard to refuse.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* A.C.E. Framework */}
                      <div>
                        <h4 className="text-base font-semibold text-white mb-2">Reply Methodology</h4>
                        <h5 className="text-lg font-bold text-green-400 mb-1">A.C.E.</h5>
                        <p className="text-xs text-gray-400 mb-4">Acknowledge the question, Clarify with context, Engage with next step</p>
                        
                        {/* Letter Tabs */}
                        <div className="flex gap-2 mb-4">
                          {(['A', 'C', 'E'] as const).map((letter) => (
                            <button
                              key={letter}
                              onClick={() => setActiveAceLetter(letter)}
                              className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold transition-all ${activeAceLetter === letter ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                              {letter}
                            </button>
                          ))}
                        </div>

                        {/* Letter Content */}
                        <div className="bg-gray-800/50 rounded-sm p-4">
                          {activeAceLetter === 'A' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">A - Acknowledge</h5>
                              <p className="text-xs text-gray-300 mb-3">Mirror their specific question or concern to show you understood</p>
                              <p className="text-xs text-gray-400">"Great question about our pricing structure..."</p>
                            </>
                          )}
                          {activeAceLetter === 'C' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">C - Clarify</h5>
                              <p className="text-xs text-gray-300 mb-3">Provide context that addresses their underlying concern</p>
                              <p className="text-xs text-gray-400">"The reason we structure it this way is to ensure you only pay for what you use..."</p>
                            </>
                          )}
                          {activeAceLetter === 'E' && (
                            <>
                              <h5 className="text-sm font-semibold text-white mb-1">E - Engage</h5>
                              <p className="text-xs text-gray-300 mb-3">End with a clear next step or question</p>
                              <p className="text-xs text-gray-400">"Would it help if I walked you through a quick comparison with your current setup?"</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Connect Email CTA */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Next: Connect Your Email Inbox</h4>
                <p className="text-xs text-gray-600 mb-4">
                  These best-practice templates will be customized for your ICP and applied to real leads from your inbox. Connect Gmail or Microsoft to start generating personalized outreach for actual prospects.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm text-gray-600">Gmail / Microsoft</span>
                  </div>
                  <button className="px-4 py-2 rounded-sm text-sm font-medium text-white" style={{ backgroundColor: '#0080FF' }}>
                    Activate & Connect Your Inbox
                  </button>
                </div>
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 12: Connect Email */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Connect your email to get started with Blu</h2>
                <p className="text-sm text-gray-600">
                  Your inbox is about to get a serious upgrade. Connect your email provider to unlock powerful AI-driven features.
                </p>
              </div>

              <p className="text-sm font-medium text-gray-700">Choose your email provider</p>

              {/* Email Provider Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* Google Workspace */}
                <div
                  onClick={() => setSelectedEmailProvider('google')}
                  className="border rounded-sm p-5 cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: selectedEmailProvider === 'google' ? '#0080FF' : '#D1D5DB',
                    backgroundColor: selectedEmailProvider === 'google' ? 'rgba(0, 128, 255, 0.02)' : 'white',
                    boxShadow: selectedEmailProvider === 'google' ? '0 0 0 2px rgba(0, 128, 255, 0.2)' : 'none'
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Google Workspace</h3>
                      <p className="text-xs text-gray-500">Connect your Gmail and Google Calendar for seamless integration.</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      Smart email categorization and prioritization
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      AI-powered meeting scheduler
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      Automatic transcription and insights
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span>
                      Calendar sync and availability management
                    </li>
                  </ul>
                </div>

                {/* Microsoft 365 - Greyed out */}
                <div
                  className="border rounded-sm p-5 opacity-50 cursor-not-allowed"
                  style={{ borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path d="M11.4 24H0V12.6L11.4 24z" fill="#EA3E23"/>
                      <path d="M24 24H12.6L0 11.4V0h11.4L24 12.6V24z" fill="#7FBA00"/>
                      <path d="M24 11.4V0H12.6L24 11.4z" fill="#00A4EF"/>
                      <path d="M11.4 0H0v11.4L11.4 0z" fill="#FFB900"/>
                    </svg>
                    <div>
                      <h3 className="text-base font-semibold text-gray-400">Microsoft 365</h3>
                      <p className="text-xs text-gray-400">Connect your Outlook and Microsoft Calendar for complete integration.</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-gray-300">✓</span>
                      Intelligent inbox organization
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-gray-300">✓</span>
                      AI meeting coordination
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-gray-300">✓</span>
                      Real-time transcription features
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-gray-300">✓</span>
                      Teams and calendar synchronization
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-400 italic">Coming soon</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <p className="text-xs text-gray-500 text-center">
                By connecting, you agree to our <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              </p>

              {/* Skip for now link */}
              <div className="text-center">
                <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                  Skip for now
                </button>
              </div>
            </div>
          </Step>
        )}

        {/* Sales Step 13: Invite Team (Final Step) */}
        {selectedPath === 'sales' && (
          <Step>
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Invite your team</h2>
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <span>Powered by</span>
                  <span className="font-semibold" style={{ color: '#0080FF' }}>Blu</span>
                </div>
                <p className="text-sm text-gray-600">
                  Add colleagues to collaborate and share insights across your organization.
                </p>
              </div>

              {/* Invite Options */}
              <div className="space-y-6">
                {/* Share invite link */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Invite colleagues</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Share invite link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-sm text-sm text-gray-600 bg-gray-50"
                      />
                      <button
                        onClick={copyInviteLink}
                        className="px-4 py-2.5 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Invite by email */}
                <div>
                  <label className="text-xs font-medium text-gray-500">Invite by email</label>
                  <div className="space-y-3 mt-2">
                    {teamEmails.map((email, index) => (
                      <input
                        key={index}
                        type="email"
                        value={email}
                        onChange={(e) => updateTeamEmail(index, e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))}
                    <button
                      onClick={addTeamEmail}
                      className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors"
                      style={{ color: '#0080FF' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add another colleague
                    </button>
                  </div>
                </div>
              </div>

              {/* Send Invites Button */}
              <div className="pt-4">
                <button
                  className="w-full px-6 py-3 rounded-sm text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#0080FF' }}
                >
                  Send invites & Continue
                </button>
              </div>
            </div>
          </Step>
        )}
      </Stepper>

      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-sm shadow-lg px-4 py-3 flex items-center gap-3"
            style={{ zIndex: 1000 }}
          >
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ backgroundColor: '#0080FF' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center"
            style={{
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => {
              setShowConnectModal(false);
              setCurrentConnectingTool(null);
              setApiKey('');
              setGmailAuthStep('options');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-sm p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Gmail specific modal */}
              {currentConnectingTool === 'gmail' ? (
                <>
                  {gmailAuthStep === 'options' ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Connect Your Google Account</h3>
                          <p className="text-sm text-gray-600 mt-1">Gmail / G-Suite</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowConnectModal(false);
                            setCurrentConnectingTool(null);
                            setGmailAuthStep('options');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-4">Select a connection option</p>

                      {/* Option 1: OAuth */}
                      <div className="border border-gray-200 rounded-sm p-4 mb-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">Option 1: oAuth</h4>
                          <div className="flex gap-2 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">Once per Domain</span>
                          </div>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1 mb-3">
                          <li>• Easier to setup</li>
                          <li>• More stable and less disconnects</li>
                          <li>• Available for GSuite accounts</li>
                        </ul>
                        <button
                          onClick={() => setGmailAuthStep('oauth')}
                          className="w-full px-4 py-2 rounded-sm text-sm font-medium text-white transition-colors"
                          style={{ backgroundColor: '#0080FF' }}
                        >
                          Select OAuth
                        </button>
                      </div>

                      {/* Option 2: App Password */}
                      <div className="border border-gray-200 rounded-sm p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">Option 2: App Password</h4>
                          <div className="flex gap-2 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">Once per Rep</span>
                          </div>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1 mb-3">
                          <li>• Available for personal accounts</li>
                          <li>• Requires 2-factor authentication</li>
                          <li>• More prone to disconnects</li>
                        </ul>
                        <button
                          onClick={() => setGmailAuthStep('app-password')}
                          className="w-full px-4 py-2 rounded-sm text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Select App Password
                        </button>
                      </div>
                    </>
                  ) : gmailAuthStep === 'oauth' ? (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">oAuth Setup</h3>
                          <p className="text-sm text-gray-600 mt-1">Gmail / G-Suite</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowConnectModal(false);
                            setCurrentConnectingTool(null);
                            setGmailAuthStep('options');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Setup Instructions:</p>
                          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                            <li>Go to your Google Workspace Admin Panel</li>
                            <li>Click "Configure new app"</li>
                            <li>Use this Client-ID to search for Instantly:</li>
                          </ol>
                          <div className="mt-2 p-3 bg-gray-50 rounded-sm border border-gray-200">
                            <code className="text-xs text-gray-800 break-all">
                              536726988839-pt93oro4685dtblemb0pp2vjgjol5mls.apps.googleusercontent.com
                            </code>
                          </div>
                          <ol start={4} className="text-sm text-gray-600 space-y-2 list-decimal list-inside mt-2">
                            <li>Select and approve Instantly to access your Google Workspace</li>
                          </ol>
                        </div>

                        <button
                          onClick={() => {
                            // Handle OAuth sign in
                            setConnectedIntegrations([...connectedIntegrations, 'gmail']);
                            setShowConnectModal(false);
                            setCurrentConnectingTool(null);
                            setGmailAuthStep('options');
                          }}
                          className="w-full px-4 py-2.5 rounded-sm text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                          style={{ backgroundColor: '#0080FF' }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Sign In with Google
                        </button>

                        <button
                          onClick={() => setGmailAuthStep('options')}
                          className="w-full px-4 py-2 rounded-sm text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">App Password Authentication</h3>
                          <p className="text-sm text-gray-600 mt-1">Gmail / G-Suite</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowConnectModal(false);
                            setCurrentConnectingTool(null);
                            setGmailAuthStep('options');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          You'll need to generate an app password in your Google account settings.
                        </p>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">App Password</label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your app password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (apiKey.trim()) {
                              setConnectedIntegrations([...connectedIntegrations, 'gmail']);
                              setShowConnectModal(false);
                              setCurrentConnectingTool(null);
                              setApiKey('');
                              setGmailAuthStep('options');
                            }
                          }}
                          disabled={!apiKey.trim()}
                          className="w-full px-4 py-2.5 rounded-sm text-sm font-medium text-white transition-colors"
                          style={{
                            backgroundColor: apiKey.trim() ? '#0080FF' : '#D1D5DB',
                            cursor: apiKey.trim() ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Connect
                        </button>

                        <button
                          onClick={() => setGmailAuthStep('options')}
                          className="w-full px-4 py-2 rounded-sm text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Standard API key modal for other integrations */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Connect {currentConnectingTool}</h3>
                    <button
                      onClick={() => {
                        setShowConnectModal(false);
                        setCurrentConnectingTool(null);
                        setApiKey('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (apiKey.trim() && currentConnectingTool) {
                          setConnectedIntegrations([...connectedIntegrations, currentConnectingTool]);
                          setShowConnectModal(false);
                          setCurrentConnectingTool(null);
                          setApiKey('');
                        }
                      }}
                      disabled={!apiKey.trim()}
                      className="w-full px-4 py-2.5 rounded-sm text-sm font-medium text-white transition-colors"
                      style={{
                        backgroundColor: apiKey.trim() ? '#0080FF' : '#D1D5DB',
                        cursor: apiKey.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Connect
                    </button>
        </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
