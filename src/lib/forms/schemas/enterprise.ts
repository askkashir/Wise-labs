import type { FormSchema } from '../types'

/**
 * Enterprise Flightpath — MSME Training application.
 * No authoritative docx exists for this track (unlike Founder Flightpath),
 * so this schema is drafted from the Website Content Brief's description of
 * the track: "women-led small businesses and home-based entrepreneurs
 * seeking business training, digital skills, visibility, and market access."
 * Mirrors the Founder schema's shape/sections where sensible so the two
 * forms feel like one system.
 */
export const enterpriseFormSchema: FormSchema = {
  track: 'enterprise',
  title: 'Enterprise Flightpath — MSME Training Application',
  subtitle:
    'For women-led small businesses and home-based entrepreneurs seeking business training, digital skills, visibility, and market access.',
  themeTrack: 'enterprise',
  submitLabel: 'Submit application',
  successTitle: 'Thank you, {firstName}.',
  successBody:
    'Your Enterprise Flightpath application is in. Our team will review it and reach out about next steps.',
  sections: [
    {
      id: 'business-basics',
      title: 'Business basics',
      fields: [
        { name: 'businessName', label: 'Business name', type: 'text', required: true },
        {
          name: 'vertical',
          label: 'Business vertical',
          type: 'select',
          required: true,
          analytics: { dimension: 'vertical', kind: 'categorical' },
          options: [
            { value: 'ecommerce', label: 'E-Commerce / Online Store' },
            { value: 'fashion-apparel', label: 'Fashion & Apparel' },
            { value: 'beauty-wellness', label: 'Beauty, Wellness & Personal Care' },
            { value: 'food-beverages', label: 'Food & Beverages / Home-Based Food Business' },
            { value: 'handicrafts', label: 'Handicrafts / Artisanal Products' },
            { value: 'education-training', label: 'Education & Training' },
            { value: 'health-wellness', label: 'Health & Wellness' },
            { value: 'creative-industries', label: 'Creative Industries' },
            { value: 'services', label: 'Services' },
            { value: 'others', label: 'Others' },
          ],
        },
        {
          name: 'yearsOperating',
          label: 'Years in operation',
          type: 'number',
          required: true,
        },
        {
          name: 'businessDescription',
          label: 'What does your business do?',
          type: 'textarea',
          required: true,
        },
        {
          name: 'trainingNeeds',
          label: 'What training or support are you looking for?',
          type: 'textarea',
          required: true,
          helpText: 'Business planning, financial literacy, branding, pricing, digital marketing, e-commerce, etc.',
        },
      ],
    },
    {
      id: 'contact-information',
      title: 'Contact information',
      fields: [
        { name: 'primaryContactName', label: 'Primary contact name', type: 'text', required: true },
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
          name: 'cityProvince',
          label: 'City / Province',
          type: 'text',
          required: true,
          analytics: { dimension: 'city', kind: 'categorical' },
        },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          required: true,
          analytics: { dimension: 'gender', kind: 'categorical' },
          options: [
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
            { value: 'other', label: 'Other' },
            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
          ],
        },
      ],
    },
    {
      id: 'how-did-you-hear',
      title: 'How did you hear about WISE Lab',
      fields: [
        {
          name: 'referralSource',
          label: 'How did you hear about WISE Lab?',
          type: 'select',
          required: true,
          analytics: { dimension: 'source', kind: 'categorical' },
          options: [
            { value: 'social-media', label: 'Social Media' },
            { value: 'peer-referral', label: 'Peer Referral' },
            { value: 'email', label: 'Email' },
            { value: 'print-electronic-media', label: 'Print / Electronic Media' },
            { value: 'others', label: 'Others' },
          ],
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
            'I confirm my commitment to actively participate and contribute to the growth of Pakistan’s women entrepreneurship ecosystem.',
          type: 'consent',
          required: true,
        },
      ],
    },
  ],
}
