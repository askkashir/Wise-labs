import type { FormSchema } from '../types'

/**
 * Guide Her Growth — Become a Mentor application.
 * Drafted from the Content Brief: "For experts, founders, investors,
 * trainers, and professionals who want to guide women entrepreneurs through
 * practical support." Uses `themeTrack: 'neutral'` since mentor/partner
 * aren't part of the founder/enterprise track-color system.
 */
export const mentorFormSchema: FormSchema = {
  track: 'mentor',
  title: 'Guide Her Growth — Become a Mentor',
  subtitle:
    'For experts, founders, investors, trainers, and professionals who want to guide women entrepreneurs through practical support.',
  themeTrack: 'neutral',
  submitLabel: 'Submit mentor application',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    'Your mentor application is in. Our team will review it and reach out about next steps.',
  sections: [
    {
      id: 'mentor-basics',
      title: 'About you',
      fields: [
        { name: 'fullName', label: 'Full name', type: 'text', required: true },
        { name: 'currentRole', label: 'Current role / title', type: 'text', required: true },
        { name: 'organization', label: 'Organization', type: 'text' },
        {
          name: 'expertiseAreas',
          label: 'Areas of expertise',
          type: 'select',
          required: true,
          analytics: { dimension: 'expertise', kind: 'categorical' },
          options: [
            { value: 'business-strategy', label: 'Business Strategy' },
            { value: 'finance-investment', label: 'Finance & Investment' },
            { value: 'marketing-branding', label: 'Marketing & Branding' },
            { value: 'product-tech', label: 'Product & Technology' },
            { value: 'legal', label: 'Legal' },
            { value: 'operations', label: 'Operations' },
            { value: 'sales-market-access', label: 'Sales & Market Access' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          name: 'yearsExperience',
          label: 'Years of relevant experience',
          type: 'number',
          required: true,
        },
        {
          name: 'motivation',
          label: 'Why do you want to mentor with WISE Lab?',
          type: 'textarea',
          required: true,
        },
        {
          name: 'availability',
          label: 'Weekly availability',
          type: 'select',
          required: true,
          options: [
            { value: '1-2-hours', label: '1–2 hours / week' },
            { value: '3-5-hours', label: '3–5 hours / week' },
            { value: '5-plus-hours', label: '5+ hours / week' },
          ],
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        { name: 'contactNumber', label: 'Contact number', type: 'tel', required: true },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          patternMessage: 'Please enter a valid email.',
        },
        {
          name: 'linkedin',
          label: 'LinkedIn profile',
          type: 'url',
          placeholder: 'https://linkedin.com/in/…',
        },
        {
          name: 'cityProvince',
          label: 'City / Province',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
      ],
    },
    {
      id: 'commitment',
      title: 'Commitment statement',
      fields: [
        {
          name: 'commitmentConsent',
          label:
            'I confirm my commitment to actively mentor and support women entrepreneurs through WISE Lab.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
